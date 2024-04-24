const express = require('express')
const router = express.Router()
const webhookController = require('../services/webhookService')

router.post('/', async (req,res)=>{
    try{
        const result =await webhookController.processInvoiceWebhook(req)
        res.status(200).send(result)
    }catch(error){
        res.status(500).send("webhook router internal server error")
    }
})

module.exports = router