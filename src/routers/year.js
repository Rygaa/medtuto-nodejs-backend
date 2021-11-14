const express = require('express')
const router = new express.Router();
const Faculty = require('../models/Faculty')
const Model = require('../models/Model')
const { nanoid } = require('nanoid');
const fs = require('fs');
const Year = require('../models/Year');
const Course = require('../models/Course');

router.post('/years', async (req, res) => {
    const faculty = await Faculty.findOne({ pubId: req.body.facultyPubId })
    const years_ids = faculty.years;
    const years = []
    for (let i = 0; i < years_ids.length; i++) {
        const year = await Year.findById(years_ids[i])
        years.push({
            pubId: year.pubId,
            name: year.name,
            index: year.index
        })
    }
    res.send({

        years,
        status: 'Success'
    })

})
router.post('/add-year', async (req, res) => {
    const year = new Year({ pubId: nanoid(), name: req.body.yearName, index: req.body.yearIndex });
    await year.save();

    const faculty = await Faculty.findOne({ pubId: req.body.facultyPubId });
    faculty.years = faculty.years.concat(year._id);
    await scriptIt({ file: 'studies', requestName: 'add-year', requestBody: req.body })

    await faculty.save();
    res.send({
        status: "Success"
    })
})


router.post('/update-year', async (req, res) => {
    try {
        console.log(req.body);
        const year = await Year.findOne({ pubId: req.body.yearPubId })
        year.name = req.body.newYearName;
        year.index = req.body.newYearIndex;
        await scriptIt({ file: 'studies', requestName: 'update-year', requestBody: req.body })

        await year.save();
        res.send({
            status: 'Faculty Updated with success'
        })
    } catch (error) {
        console.log(error);
        res.send({
            error: 'Error occured during the update of this new faculty'
        })
    }
})

router.post('/remove-year', async (req, res) => {
    const year = await Year.findOneAndDelete({ pubId: req.body.yearPubId })
    const faculty = await Faculty.findOne({ pubId: req.body.facultyPubId });
    faculty.years.splice(faculty.years.indexOf(year._id), 1);
    await scriptIt({ file: 'studies', requestName: 'remove-year', requestBody: req.body })
    await faculty.save();
    res.send({
        status: 'Success'
    })
})




const scriptIt = async ({ file, requestName, requestBody }) => {
    const __files = __dirname + '/../' + 'scripts/' + `${file}.json`
    const request = {
        name: requestName,
        body: requestBody
    }
    fs.appendFile(__files, JSON.stringify(request) + ',' + "\n", function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}

module.exports = router
