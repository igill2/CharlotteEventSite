const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User'},

    connectionID: { type: Schema.Types.ObjectId, ref: 'Activity'},

    status: { type: String, enum: ["Yes", "No", "Maybe"]}    
});


module.exports = mongoose.model('user', rsvpSchema);