var mongoose = require('mongoose');
var Schema = mongoose.Schema;

rideSchema = new Schema( {
	route: String,
	plaque: String,
	price: Number,
	image: String,
	room: Number,
	user_id: Schema.ObjectId,
	is_delete: { type: Boolean, default: false },
	date : { type : Date, default: Date.now }
}),
ride = mongoose.model('ride', rideSchema);

module.exports = ride;
