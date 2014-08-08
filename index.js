var express = require('express');
var fs = require('fs');
var svg2png = require('svg2png');
var uuid = require('node-uuid');

var app = express();

app.set('port', (process.env.PORT || 5000));

var TMP_PATH = __dirname + '/tmp/';

// Check for if we have the tmp folder created, if not create it.
// Only necessary for cloud hosting (heroku / bluemix)
if (!fs.existsSync(TMP_PATH)) {
    fs.mkdirSync(TMP_PATH);
}

// Middleware to grab rawbody from requests
app.use(function(req, res, next) {
    var data = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
        data += chunk;
    });
    req.on('end', function() {
        req.rawBody = data;
        next();
    });
});

// Necessary CORS headers to enable cross domain requests
app.all('*', function(req, res, next) {
    // Standard headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    // IE does not respond unless there is a p3p header... even though it really
    // doesn't do anything here
    res.header('p3p', 'CP="This is not a P3P policy!"');
    next();
});

app.get('/', function(req, res, next) {
    // Redirect back to github
    res.redirect('https://github.com/connyay/svgtopng');
});

/**
 * @api {post} / Convert SVG
 * @apiName ConvertSVG
 * @apiGroup svgtopng
 *
 * @apiSuccess {String} UUID The UUID of converted image
 *
 * @apiSuccessExample Response (example):
 *      142a5752-e0a6-43a3-b004-1c91408be375
 *     
 */
app.post('/', function(req, res, next) {
    var imgUUID = uuid.v4();

    var tmp = TMP_PATH + imgUUID;
    var svgFile = tmp + '.svg';
    var pngFile = tmp + '.png';

    fs.writeFile(svgFile, req.rawBody, function(err) {
        if (err) {
            return next(err);
        }
        svg2png(svgFile, pngFile, function(err) {
            if (err) {
                return next(err);
            }
            res.send(imgUUID);
        });
    });
});

/**
 * @api {get} /i/:uuid Return Image
 * @apiName ReturnImage    
 * @apiGroup svgtopng
 */
app.get('/i/:image', function(req, res, next) {
    var pngFile = TMP_PATH + req.params.image + '.png';
    res.download(pngFile);
});

/**
 * @api {get} /i/:uuid/b64 Return Image as base64
 * @apiName ReturnImageAsBase64 
 * @apiGroup svgtopng
 */
app.get('/i/:image/b64', function(req, res, next) {
    var pngFilename = req.params.image + '.png';
    var pngFile = TMP_PATH + pngFilename;
    fs.readFile(pngFile, function(err, image) {
        if (err) {
            return next(err);
        }
        var prefix = 'data:image/png;base64,';
        var base64 = new Buffer(image, 'binary').toString('base64');
        res.set('file-name', pngFilename);
        res.send(prefix + base64);
    });

});

/**
 * @api {get} /s/:uuid Return SVG
 * @apiName ReturnSVG   
 * @apiGroup svgtopng
 */
app.get('/s/:svg', function(req, res, next) {
    var svgFile = TMP_PATH + req.params.svg + '.svg';
    res.download(svgFile);
});

/**
 * @api {delete} /:uuid Delete SVG & PNG
 * @apiName DeleteSvgAndPng   
 * @apiGroup svgtopng
 */
app.delete('/:uuid', function(req, res, next) {
    var path = TMP_PATH + req.params.uuid;
    var svgFile = path + '.svg';
    var pngFile = path + '.png';

    fs.exists(svgFile, function(exists) {
        if (!exists) {
            return;
        }
        fs.unlink(svgFile, function(err) {
            if (err) {
                return next(err);
            }
        });
    });

    fs.exists(pngFile, function(exists) {
        if (!exists) {
            return;
        }
        fs.unlink(pngFile, function(err) {
            if (err) {
                return next(err);
            }
        });
    });

    res.send();
});

// Start it up
app.listen(app.get('port'), function() {
    console.log("Node app is listening on port: " + app.get('port'));
});
