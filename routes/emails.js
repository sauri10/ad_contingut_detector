const express = require('express');
const router = express.Router();
const Curso = require('../models/curso')
const Asignatura = require('../models/asignatura')

router.get('/', function(req, res) {
    res.send('hello world');
});


module.exports = router