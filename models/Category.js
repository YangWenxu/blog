var mongoose = require('mongoose');
var CategorySchema = require('../schemas/categories.js');

module.exports = mongoose.model('Category', CategorySchema)