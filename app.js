const express = require('express');
const swig = require('swig');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Cookies = require('cookies');
const app = express();
var User = require('./models/User');

app.use(function(req,res,next){
    req.cookies = new Cookies(req,res);
    req.userInfo = {};

    if(req.cookies.get('userInfo')){
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
            User.findById(req.userInfo._id).then(function(userInfo){
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            })
        } catch(e){
            next();
        }
    }else{
        next();
    }
});

app.engine('html', swig.renderFile);
app.set('views', './views');
app.set('view engine', 'html');
swig.setDefaults({cache:false});

app.use('/public',express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: true}));

app.use('/admin',require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/',require('./routers/main'));

mongoose.connect('mongodb://localhost:27017/blog', function(err){
    if(err) {
        console.log("database connect failed");
    } else {
        console.log("database succeed");
        app.listen(8081);
    }
})

