var fs = require('fs');
var path = require('path');
var glob = require("glob");
var exec = require('child_process').exec;
var mkdirp = require("mkdirp");

var bin = path.join(__dirname, 'node_modules/less2stylus/less2stylus');

module.exports = function(src, dest) {
    src  = src || process.argv[2] || process.cwd();
    dest = dest || process.argv[3] || path.join(process.cwd(), 'stylus');

    glob(path.join(src, '/**/*.less'), function(er, files) {
        for (var i in files) {
            exec(bin + ' ' + files[i], (function(file) {
                return function(err, stdout, stderr) {
                    if (err) {
                        console.error('Failed to convert', file);
                    } else {
                        file = path.join(dest, file.split(src)[1]).replace(/\.less/, '.styl');
                        stdout = stdout.replace(/lesscss-percentage\(n\)\n  \(n * 100\)%\n/g, '');
                        
                        mkdirp(path.dirname(file), function(err) {
                            if (err) {
                                console.error(err);
                            } else {
                                fs.writeFile(file, stdout, function(err) {
                                    if(err) {
                                        console.error(err);
                                    } else {
                                        console.log(file);
                                    }
                                });
                            }
                        });
                    }
                };
            })(files[i]));
        }
    });
};
