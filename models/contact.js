#!/usr/bin/env node
"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ContactSchema = new Schema({
  year: { type: Number },
  month: { type: Number, min: 1, max: 12 },
  org: { type: String, trim: true },
  region: { type: String, trim: true }
});

// Contact validation
ContactSchema.path('year').required(true, 'Year cannot be blank');
ContactSchema.path('month').required(true, 'Month cannot be blank');
ContactSchema.path('org').required(true, 'Organization cannot be blank');
ContactSchema.path('region').required(true, 'Region cannot be blank');

ContactSchema.methods = {

};

ContactSchema.statics = {

};

mongoose.model("Contact", ContactSchema);
