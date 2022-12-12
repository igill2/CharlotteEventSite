const express = require('express');
const controller = require("../controllers/mainController");
const router = express.Router();
exports.about = (req, res) => {
    res.render('about');
}

exports.contact = (req, res) => {
    res.render('contact');
}