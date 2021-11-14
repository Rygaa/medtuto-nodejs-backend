const express = require('express')
const router = new express.Router();
const Faculty = require('../models/Faculty')
const Model = require('../models/Model')
const { nanoid } = require('nanoid');
const fs = require('fs');
const Year = require('../models/Year');
const Course = require('../models/Course');

router.post('/faculties', async (req, res) => {
    const faculties = await Faculty.find({});
    const data = []
    for (let i = 0; i < faculties.length; i++) {
        data.push({
            pubId: faculties[i].pubId,
            name: faculties[i].name,
            index: faculties[i].index,
        })
    }
    res.send({
        faculties: data,
        status: 'Success'
    })

})

router.post('/add-faculty', async (req, res) => {
    try {
        const faculty = new Faculty({ pubId: nanoid(), name: req.body.facultyName, index: req.body.facultyIndex });
        await faculty.save();
        await scriptIt({ file: 'studies', requestName: 'add-faculty', requestBody: req.body })
        res.send({
            status: 'Faculty created with success'
        })
    } catch (error) {
        res.send({
            error: 'Error occured during the creation of this new faculty'
        })
    }
})

router.post('/update-faculty', async (req, res) => {
    try {
        const faculty = await Faculty.findOne({ pubId: req.body.facultyPubId })
        faculty.name = req.body.facultyName;
        faculty.index = req.body.facultyIndex;
        console.log(faculty);
        await faculty.save();
        res.send({
            status: 'Faculty Updated with success'
        })
        await scriptIt({ file: 'studies', requestName: 'update-faculty', requestBody: req.body})
    } catch(error) {
        console.log(error);
        res.send({
            error: 'Error occured during the update of this new faculty'
        })
    }
})

router.post('/remove-faculty', async (req, res) => {
    try {
        await Faculty.findOneAndDelete({ pubId: req.body.facultyPubId })
        await scriptIt({ file: 'studies', requestName: 'remove-faculty', requestBody: req.body })
        res.send({
            status: 'Success'
        })
    } catch (error) {
        res.send({
            error: 'Error occured during the creation of this new faculty'
        })
    }
})










const scriptIt = async ({file, requestName, requestBody}) => {
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
