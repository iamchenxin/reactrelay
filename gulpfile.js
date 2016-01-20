/**
 * Created by iamchenxin on 1/15/16.
 */
var gulp=require('gulp');
var babel=require('gulp-babel');
var sourcemaps=require('gulp-sourcemaps');
var rename=require('gulp-rename');
var path=require('path');
var gutil =require('gulp-util');



gulp.task("server",function(){
    return new Promise((resolve,reject)=>{
        gulp.src(['src/**/*.js','!src/client/**'])
            .pipe(sourcemaps.init())
            .pipe(  babel({ 'presets': ["es2015","stage-0"]} ) )
            .pipe(rename(function(path){
                return path.basename;
            }))
            .pipe(sourcemaps.write('.',{includeContent: true, sourceRoot: __dirname+'/src/server',debug:true}))
            .pipe(gulp.dest('dst/'))
            .on("end",function(){
                console.log("server compile end .. ");
                resolve();
            });
    });
});

var webpack=require('webpack');


var webCompiler=webpack({
   entry:'./src/client/app.js',
    output:{
        path:path.join(__dirname,'dst/client'),
        filename:'app.js'
    },
    devtool:"source-map",
    module:{
        loaders:[
            {
                loader:"babel-loader",
                test:/\.js$/,
                exclude:/node_modules/,
                query:{
                    presets:['es2015','react'],
                    plugins:["transform-class-properties","transform-decorators"]
                }
            }
        ]
    }
});

gulp.task("app",function(){
    gutil.log("[webpack]", 'compile client ...');
    webCompiler.run(function (err,stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString());
    });

    gutil.log("[HTML]", 'copy html ...');
    gulp.src('src/client/**/*.html')
    .pipe(gulp.dest('dst/client/'));
});

gulp.task("app-w",function(){
    console.log("watching client ~~~~~~~~");
    webCompiler.watch({
        aggregateTimeout: 300, // wait so long for more changes
        poll: true // use polling instead of native watchers
    },function(err,stats){
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString());
    });
});

gulp.task("schema",['server'],function(){
    var subdir='rblog';
    console.log('update schema ... ');
    var updateSchema=require("./dst/common/scripts/updateSchema.js");
    updateSchema('./dst/common/data/'+subdir+'/schema.js','./dst/common/data/'+subdir+'/');
});