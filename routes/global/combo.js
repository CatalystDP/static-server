var concat = require('concat-stream');
var fs = require('fs');
var path = require('path');
var async = require('async');
var config = require('../../config');
module.exports = function (req, res, next) {
    var split='f=';
    if (req.originalUrl.indexOf(split) == -1) {
        next();
        return;
    }
    var url = req.originalUrl.split(split);
//    var _path = req.path.replace(split,'/'),
      var js = url[1].replace(/\?.+\=.+/,'').split(','),
        length = js.length;
    var fullPath = path.join(path.resolve('..'), url[0]);
    var count = 0;
    res.set({
        'Cache-Control': "max-age=" + config.cache_time + "",
        'Content-Type':'text/javascript',
        'Expires':new Date(Date.now()+config.cache_time*1000)
    });
    async.whilst(
        function () {
            return count < length;
        },
        function (callback) {
            var p=path.join(fullPath,js[count]);
            var stream = fs.createReadStream(p);
            var c = concat({
                encoding: 'string'
            }, function (data) {
                res.write(data);
                count++;
                callback();
            });
            stream.pipe(c);
        }, function (err) {
            res.end();
        }
    );
};
