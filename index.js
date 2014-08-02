var express = require('express');
var fs = require('fs');
var svg2png = require('svg2png');
var uuid = require('node-uuid');

var app = express();

app.set('port', (process.env.PORT || 5000));

var TMP_PATH = __dirname + '/tmp/';


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

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
});

app.get('/', function(req, res, next) {
    res.redirect('https://github.com/connyay/svgtopng');
});

app.post('/', function(req, res, next) {
    var imgUUID = uuid.v4();

    if (!fs.existsSync(TMP_PATH)) {
        fs.mkdirSync(TMP_PATH);
    }

    var tmp = TMP_PATH + imgUUID;
    var svgFile = tmp + '.svg';
    var pngFile = tmp + '.png';

    fs.writeFileSync(svgFile, req.rawBody);
    svg2png(svgFile, pngFile, function(err) {
        if (err) throw err;
        fs.readFile(pngFile, function(err, image) {
            if (err) {
                return next(err);
            }
            res.send(imgUUID);

        });
    });
});

app.get('/i/:image', function(req, res, next) {
    var pngFile = TMP_PATH + req.params.image + '.png';
    res.download(pngFile);
});

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

app.get('/s/:svg', function(req, res, next) {
    var svgFile = TMP_PATH + req.params.svg + '.svg';
    res.download(svgFile);

});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});