const express = require('express')
const router = new express.Router();
const Faculty = require('../../models/Faculty')
const { nanoid } = require('nanoid');
const Year = require('../../models/Year');



router.post('/add-year', async (req, res) => {
    if (req.body.yearName == null) {
        res.send({ error: `Please provide name for year` })
        return;
    }
    if (req.body.yearIndex == null) {
        res.send({ error: `Please provide index for year` })
        return;
    }
    const year = new Year({ pubId: nanoid(), name: req.body.yearName, index: req.body.yearIndex });

    const faculty = await Faculty.findOne({ pubId: req.body.facultyPubId });
    if (!faculty) {
        res.send({ error: `The faculty ${req.body.facultyPubId} does not exist ` })
        return;
    }
    faculty.years = faculty.years.concat(year._id);
    await year.save();
    await faculty.save();
    res.send({
        status: "Success"
    })
})


router.post('/update-year', async (req, res) => {
    const year = await Year.findOne({ pubId: req.body.yearPubId });
    if (!year) {
        res.send({ error: `The year ${req.body.yearPubId} does not exist` })
        return;
    }
    if (req.body.yearName == null) {
        res.send({ error: `Please provide name for year` })
        return;
    }
    if (req.body.yearIndex == null) {
        res.send({ error: `Please provide index for year` })
        return;
    }
    year.name = req.body.newYearName;
    year.index = req.body.newYearIndex;
    await year.save();
    res.send({
        status: 'Faculty Updated with success'
    })
})

router.post('/remove-year', async (req, res) => {
    const year = await Year.findOne({ pubId: req.body.yearPubId })
    if (!year) {
        res.send({ error: `The year ${req.body.yearPubId} does not exist` })
        return;
    }
    const faculty = await Faculty.findOne({ pubId: req.body.facultyPubId });
    if (!faculty) {
        res.send({ error: `The faculty ${req.body.facultyPubId} does not exist` })
        return;
    }
    await Year.findOneAndDelete({ pubId: req.body.yearPubId })
    const index = faculty.years.indexOf(year._id);
    if (index == -1) {
        res.send({ error: `The year ${req.body.yearPubId} does not belong to the faculty ${req.body.facultyPubId}` })
        return;
    }
    faculty.years.splice(faculty.years.indexOf(year._id), 1);
    await faculty.save();
    res.send({
        status: 'Success'
    })
})

module.exports = router
