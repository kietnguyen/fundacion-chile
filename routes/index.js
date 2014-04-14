#!/usr/bin/env node
"use strict";

require("../models/contact.js");

var mongoose = require('mongoose'),
    _ = require('lodash'),
    Contact = mongoose.model("Contact");

var convertToMonthNum = function(month) {
  switch (month) {
    case "Enero": return 1;
    case "Febrero": return 2;
    case "Marzo": return 3;
    case "Abril": return 4;
    case "Mayo": return 5;
    case "Junio": return 6;
    case "Julio": return 7;
    case "Agosto": return 8;
    case "Septiembre": return 9;
    case "Octubre": return 10;
    case "Noviembre": return 11;
    case "Diciembre": return 12;
  }
};

var convertToMonthWord = function(month) {
  switch (month) {
    case 1: return "Enero";
    case 2: return "Febrero";
    case 3: return "Marzo";
    case 4: return "Abril";
    case 5: return "Mayo";
    case 6: return "Junio";
    case 7: return "Julio";
    case 8: return "Agosto";
    case 9: return "Septiembre";
    case 10: return "Octubre";
    case 11: return "Noviembre";
    case 12: return "Diciembre";
  }
};


var done = function(err, res, options) {
  if (err) { console.error(err); }

  console.dir(options.httpStatusCode);

  return res.render('error', {
    title: "Fundacion Chile | Something went wrong",
    httpStatusCode: options.httpStatusCode
  } );
};

exports.index = function(req, res) {
  Contact.aggregate(
    { $project: { _id: 0, year: 1, month: 1, org: 1, region: 1 } },
    { $sort: { year: -1, month: -1 } },
    function(err, findRes) {
      if (err) { done(err, res, { httpStatusCode: 500 }); }

      //console.dir(findRes);

      findRes.forEach(function(val,key) {
        findRes[key].month = convertToMonthWord(val.month);
      });

      res.render('index', { title: "Fundacion Chile" });
    });
};

exports.getAdd = function(req, res) {
  res.render(
    'add',
    { title: "Fundacion Chile | Add" }
  );
};

exports.add = function(req, res, done) {
  var year = parseInt(req.body.year),
      month = parseInt(req.body.month),
      org = req.body.org,
      region = req.body.region;

  var contact = {
    year: year,
    month: month,
    org: org,
    region: region
  };

  console.dir(contact);

  Contact.findOneAndUpdate(
    contact,
    contact,
    { upsert: true },
    function(err, saveRes) {
      if (err) { done(err, res, { httpStatusCode: 500 }); }

      console.dir(saveRes);

      res.redirect("/");
    });
};

exports.getSearch = function(req, res) {
  res.render(
    'search',
    { title: "Fundacion Chile | Search" }
  );
};

exports.getAll = function(req, res, done) {
  Contact.aggregate(
    { $project: { _id: 0, year: 1, month: 1, org: 1, region: 1 } },
    { $sort: { year: -1, month: -1 } },
    function(err, findRes) {
      if (err) { done(err, res, { httpStatusCode: 500 }); }

      //console.dir(findRes);

      findRes.forEach(function(val,key) {
        findRes[key].month = convertToMonthWord(val.month);
      });

      res.status(200).send(JSON.stringify(findRes));
    });
};

exports.remove = function(req, res) {
  var year = req.body.year,
      month = req.body.month,
      org = req.body.org,
      region = req.body.region;

  var contact = {};
  if (year) { contact.year = parseInt(year); }
  if (month) { contact.month = parseInt(convertToMonthNum(month)); }
  if (org) { contact.org = org; }
  if (region) { contact.region = region; }

  if (Object.keys(contact).length === 0) {
    res.send(200, JSON.stringify({ response: false }));
  }
  Contact.findOneAndRemove(
    contact,
    function(err, rmRes) {
      if (err) { done(err, res, { httpStatusCode: 500 }); }

      console.dir(rmRes);

      if (rmRes)
        res.send(200, JSON.stringify({ response: true }));
      else
        res.send(200, JSON.stringify({ response: false }));
    });
};

exports.unavailable = function(req, res) {
  done(null, res, { httpStatusCode: 404 });
};
