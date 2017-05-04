var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var replace = require('underscore');
var mongoose = require('mongoose');
var movie =require('./models/movie');
var port =process.env.PORT || 3000;
var app =express();

mongoose.connect('mongodb://localhost/movie');

app.locals.moment = require('moment');
app.set('views','./views/page/');
app.set('view engine','jade');
app.use(express.static(path.join(__dirname,'bower')));
app.use(bodyParser.urlencoded({extended: true}))
app.listen(port)
console.log('成功了'+port);
//index page
app.get('/',function (req,res) {
    movie.fetch(function (err,movies) {
        if(err){console.log(err)}
        res.render('index',{
            title:'起风了',
            movies:movies
        })
    })

})

app.get('/movie/:id',function (req,res) {
    var id =req.params.id;
    movie.findById(id,function (err,movie) {
        res.render('detail',{
            title:'详情页',
            movie:movie
        })
    })

})
//更新
app.get('/admin/update/:id',function(req,res) {
    var id = req.params.id;
    //console.log(id)

        movie.findById(id,function(err,movie) {
            res.render('admin',{
                title:"更新页",
                movie:movie
            })
        })

})
//添加
app.post('/admin/movie/new',function (req,res) {
    var id = req.body.movie._id;
    var movieObj =req.body.movie;
    if(id !== 'undefined'){
        console.log("1")
        movie.findById(id,function (err,movie) {
            if(err){console.log(err)}
          _movie =replace.extend(movie,movieObj);
            _movie.save(function (err,movie) {
                if(err){console.log(err)}
                res.redirect('/movie/'+movie._id);
            })
        })

    }
    else{
    var _movie = new movie({
        doctor:movieObj.doctor,
        title:movieObj.title,
        country:movieObj.country,
        language:movieObj.language,
        year:movieObj.year,
        poster:movieObj.poster,
        summary:movieObj.summary,
        flash:movieObj.flash
    })
        _movie.save(function (err,movie) {
            if(err){
                console.log(err);
            }
            res.redirect('/movie/'+movie._id);
        })}

})
//登录
app.get('/admin/movie',function (req,res) {
    res.render('admin',{
        title:'起风了',
        movie:{
            title:'',
            doctor:'',
            country:'',
            year:"",
            poster:"",
            language:"",
            flash:"",
            summary:""
        }
    })
})
app.get('/admin/list',function (req,res) {
    movie.fetch(function (err,movies) {
        if(err){console.log(err)}
        res.render('list',{
            title:'起风了',
            movies:movies
        })

    })
})