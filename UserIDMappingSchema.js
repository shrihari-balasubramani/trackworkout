var mongoose     = require('mongoose');

var Schema       = mongoose.Schema;

var UserIDMappingSchema = new Schema({
	userName : String
});

module.exports = mongoose.model('userIDMappingSchema', UserIDMappingSchema);