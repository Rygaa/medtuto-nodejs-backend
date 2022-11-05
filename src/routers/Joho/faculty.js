const express = require('express')
const router = new express.Router();
const Faculty = require('../../models/Faculty')

router.post('/faculties', async (req, res) => {
   
    try {
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
    } catch (error) {
        console.log(error)
    }
})












module.exports = router
