/**
 * Created by dp on 2014/5/20.
 */
var express=require('express');
var router=express.Router();
var domain = require('domain');
var combo=require('./combo');
var path=require('path');
var d = domain.create();
d.on('error', function (err) {
    console.log(err);
});
router.use(function(req,res,next){

    d.run(next);
});

/*这里是用来配置静态访问的路由的，以后只需在这里增加路由*/
router.use('/volunteer',staticPath('/volunteer'));
/**/
/*这里是用来启动combo的,可以配置seajs combo或普通的combo*/
router.use(combo);

/**/
function staticPath(_path){
    return express.static(
        path.join(
            path.resolve('..'),
            _path
        )
    );
}
module.exports=router;