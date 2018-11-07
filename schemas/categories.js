var mongoose = require('mongoose');
//定义用户表结构（字段和类型）,并暴露出去
module.exports = new mongoose.Schema({
    name: String
})