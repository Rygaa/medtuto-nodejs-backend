const express = require('express')
const router = new express.Router();
const Year = require('../models/Year')
const Faculty = require('../models/Faculty')
const Model = require('../models/Model')
const Course = require('../models/Course')
const { nanoid } = require('nanoid');
var multer = require('multer')
const fs = require('fs')
const upload = multer({ dest: 'images', storage: multer.memoryStorage() });

console.log(__dirname);
const __files = __dirname + '/../' + 'scripts/' + 'studies.json'







module.exports = router