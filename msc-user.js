// Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// User Schema
module.exports = new Schema({
    id: Number,
    username: String,
    password: String,
    statusActivated: Boolean,
    activation_code: String,
    first_name: String,
    last_name: String,
    gender: String,
    drug: {
      opioids: Boolean,
      coke: Boolean,
      xanax: Boolean
    },
    occupation: {
      student: Boolean,
      unemployed: Boolean,
      homeless: Boolean
    },
    history: [{
      location: Number,
      date: Number,
      drug_type: String,
      amount: Number,
      notes: String
    }]
});