// Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Center Schema
module.exports = new Schema({
    id: Number,
    name: String,
    address: String,
    location: {
      lat: Number,
      lon: Number
    }
});