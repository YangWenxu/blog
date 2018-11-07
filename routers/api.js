const express = require('express');
const router = express.Router();
var User = require('../models/User');
var Content = require('../models/Content');

var resData;
router.use(function(req,res,next){
    resData = {
        code: 0,
        message:''
    };
    next();
})

//评论提交
router.post('/comment/post',function(req,res){
	//内容的id
	var contentid = req.body.contentid || '';
	var postData = {
		username:req.userInfo.username,
		postTime:new Date(),
		content:req.body.content
	}
	//查询当前这边内容的信息
	Content.findOne({
		_id:contentid
	}).then(function(content){
		content.comments.push(postData);
		return content.save();
	}).then(function(newContent){
		resData.message = '评论成功';
		resData.data = newContent,
		res.json(resData);
	});
})

router.post('/user/register',function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    if(username == '') {
        resData.code = 1;
        resData.message = '用户名不能为空';
        res.json(resData);
        return;
    }

    if(password == '') {
        resData.code = 2;
        resDate.message = '密码不能为空';
        res.json(resData);
        return;
    }

    if(password != repassword) {
        resDate.code = 3;
        resDate.message = '两次输入的密码不一致';
        res.json(resData);
        return;
    }

    User.findOne({
        username: username
    }).then(function(userInfo){
        if(userInfo) {
            resData.code = 4;
            resData.message = '用户名已被注册';
            res.json(resData);
            return;
        }
        var user = new User({
            username: username,
            password: password
        });

        return user.save();
    }).then(function(newUserInfo){
        resData.message = '注册成功';
        res.json(resData);
    });
})

router.post('/user/login',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    if(username == '' || password == '') {
        resData.code = 1;
        resData.message = '用户名或密码不能为空';
        res.json(resData);
        return;
    }

    User.findOne({
        username: username,
        password: password
    }).then(function(userInfo){
        if(!userInfo) {
            resData.code = 2;
            resData.message='用户名或密码错误';
            res.json(resData);
            return;
        }
        resData.message = '登录成功';
        resData.userInfo = {
            _id: userInfo._id,
            username: userInfo.username
        };

        req.cookies.set('userInfo',JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username
        }));

        res.json(resData);
        return;
    })
})

router.get('/user/logout',function(req,res){
    req.cookies.set('userInfo',null);
    res.json(resData);
})

module.exports = router;