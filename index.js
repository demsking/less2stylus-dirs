var fs = require('fs');
var path = require('path');
var glob = require("glob");
var exec = require('child_process').exec;
var mkdirp = require("mkdirp");

var args = process.argv.slice(2);

var src = args[0] || process.cwd();
var src_glob = path.join(src, '/**/*.less');
var dest = args[1] || path.join(process.cwd(), 'stylus');

var bin = path.join(__dirname, 'node_modules/less2stylus/less2stylus');

console.log('Building from', src_glob, 'to', dest);

glob(src_glob, function(er, files) {
    for (var i in files) {
        exec(bin + ' ' + files[i], (function(file) {
            return function(err, stdout, stderr) {
                if (err) {
                    console.error('Failed to convert', file);
                } else {
                    file = path.join(dest, file.split(src)[1]).replace('.less', '.styl');
                    stdout = stdout.replace('lesscss-percentage(n)\n  (n * 100)%\n', '');
                    
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
