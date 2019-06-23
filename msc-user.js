// Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// User Schema
module.exports = new Schema({
    id: Number,
    username: String,
    password: String,
    statusActivated: Bool,
    activation_code: String,
    first_name: String,
    last_name: String,
    gender: String,
    drug: {
      opioids: Bool,
      coke: Bool,
      xanax: Bool
    },
    occupation: {
      student: Bool,
      unemployed: Bool,
      homeless: Bool
    },
    history: [{
      location: Number,
      date: Number,
      drug_type: String,
      amount: Number,
      notes: String
    }]
});