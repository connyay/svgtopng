var express = require('express')
var fs = require('fs');
var svg2png = require('svg2png');
var path = require("path");
var app = express();

app.set('port', (process.env.PORT || 5000))
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

app.post('/', function(request, response) {
    var timestamp = Date.now();

    var tmp = path.join(process.cwd(), 'tmp/') + timestamp;
    var pngFilename = timestamp + '.png';
    var svgFilename = timestamp + '.svg';
    var svgFile = tmp + svgFilename;
    var pngFile = tmp + pngFilename;
    fs.writeFileSync(svgFile, request.rawBody);
    svg2png(svgFile, pngFile, function(err) {
        if (err) throw err;
        fs.readFile(pngFile, function(err, image) {
            if (err) throw err;
            var prefix = 'data:image/png;base64,';
            var base64 = new Buffer(image, 'binary').toString('base64');
            response.set('file-name', pngFilename);
            response.send(prefix + base64);
        });
        
    });
})

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
})