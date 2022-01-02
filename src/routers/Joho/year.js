const express = require('express')
const router = new express.Router();
const Faculty = require('../../models/Faculty')
const Year = require('../../models/Year');

router.post('/years', async (req, res) => {
    const faculty = await Faculty.findOne({ pubId: req.body.facultyPubId })
    if (!faculty) {
        res.send({ error: `The faculty ${req.body.facultyPubId} does not exist ` })
        return;
    }
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
    if (years.length == 0) {
        res.send({ error: `No year are found related to faculty ${req.body.facultyPubId}` })
        return;
    }
    res.send({
        years,
        message: 'Year received successfully',
    })
})




module.exports = router
