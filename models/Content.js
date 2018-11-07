var mongoose = require('mongoose');
var ContentSchema = require('../schemas/content.js');

module.exports = mongoose.model('Content', ContentSchema)