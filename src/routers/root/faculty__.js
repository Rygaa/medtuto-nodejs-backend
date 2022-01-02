const express = require('express')
const router = new express.Router();
const Faculty = require('../models/Faculty')
const { nanoid } = require('nanoid');
var multer = require('multer')
const upload = multer({ dest: 'images', storage: multer.memoryStorage() });
router.post('/add-faculty', async (req, res) => {
    if (req.body.facultyName == null) {
        res.send({ error: `Please provide name for faculty` })
        return;
    }
    if (req.body.facultyIndex == null) {
        res.send({ error: `Please provide index for faculty` })
        return;
    }
    const faculty = new Faculty({ pubId: nanoid(), name: req.body.facultyName, index: req.body.facultyIndex });
    await faculty.save();
    res.send({
        status: 'Faculty created with success'
    })
})
router.post('/update-faculty', async (req, res) => {
    const faculty = await Faculty.findOne({ pubId: req.body.facultyPubId })
    if (!faculty) {
        res.send({ error: `The faculty ${req.body.facultyPubId} does not exist ` })
        return;
    }
    faculty.name = req.body.facultyName;
    faculty.index = req.body.facultyIndex;
    await faculty.save();
    res.send({
        status: 'Faculty Updated with success'
    })
})
router.post('/remove-faculty', async (req, res) => {
    const faculty = await Faculty.findOne({ pubId: req.body.facultyPubId })
    if (!faculty) {
        res.send({ error: `The faculty ${req.body.facultyPubId} does not exist ` })
        return;
    }
    await Faculty.findOneAndDelete({ pubId: req.body.facultyPubId })
    res.send({
        status: 'Success'
    })
})


module.exports = router
