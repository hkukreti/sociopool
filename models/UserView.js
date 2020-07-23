const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const schema = new Mongoose.Schema({
  userId: { type: String, required: true },
  distance: { type: Number, default: 0 } ,
  startTime: { type: Number, required: true } ,
  endTime: { type: Number, required: true } 
});

module.exports = Mongoose.model('userView', schema);