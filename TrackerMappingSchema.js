var mongoose     = require('mongoose');

var Schema       = mongoose.Schema;

var TrackerMappingSchema = new Schema({
	userName : String,
  tDate: Date,
  desc: String,
  duration: String
});
module.exports = mongoose.model('trackerMappingSchema', TrackerMappingSchema);