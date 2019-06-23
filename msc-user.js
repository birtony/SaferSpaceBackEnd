// Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// User Schema
module.exports = new Schema({
    username: {
        type: String,
        required: true
    },
    password: String,
    statusActivated: Boolean,
    activationCode: String,
    firstName: String,
    lastName: String,
    gender: String,
    city: String,
    complete: Boolean,
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
      drugType: String,
      amount: Number,
      notes: String
    }]
});