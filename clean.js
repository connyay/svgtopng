var fs = require('fs');
var TMP_PATH = __dirname + '/tmp/';
fs.readdir(TMP_PATH, function(err, files) {
    if (err) {
        throw err;
    }
    files.forEach(function(file) {
        if (file !== '.gitignore') {
            fs.unlink(TMP_PATH + file);
        }
    });
});
