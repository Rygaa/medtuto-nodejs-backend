const express = require('express')
const router = new express.Router();
const Model = require('../../models/Model')
const Year = require('../../models/Year');

router.post('/models', async (req, res) => {
    try {
        const year = await Year.findOne({ pubId: req.body.yearPubId })
        if (!year) {
            res.send({ error: `The year ${req.body.yearPubId} does not exist` })
            return;
        }
        const models_ids = await year.models;
        const models = []
        for (let i = 0; i < models_ids.length; i++) {
            const model = await Model.findById(models_ids[i])
            if (model != null) {
                models.push({
                    pubId: model.pubId,
                    name: model.name,
                    index: model.index,
                    description: model.description,
                    coefficient: model.coefficient,
                })
            }
        }
        if (models.length == 0) {
            res.send({ error: `The year ${req.body.yearPubId} does not have any models` })
            return;
        }
        res.send({
            models,
            status: 'Success'
        })
    
    } catch (error) {
        console.log(error)
    }

})




module.exports = router
