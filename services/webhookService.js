const {verifySignature} = require('../utils/verifySignature')
// const { getInvoiceById, updateInvoice, insertInvoice } = require('../database/invoiceQueries');


exports.processInvoiceWebhook= async (req)=>{
    console.log('From - webhookService.js')
    let verifyResult = verifySignature(req)
    console.log('verifyResult',verifyResult)
    if(!verifyResult){
        throw new Error('Unauthrized - Invalid Signatue')
    }

    const {companyID,url}=req.companyDetails
    const hookType = req.body.eventNotifications[0].dataChangeEvent.entities[0].name;
   
    if(hookType === 'Invoice'){
    const invoiceId = req.body.eventNotifications[0].dataChangeEvent.entities[0].id;
    const invoiceOperation = req.body.eventNotifications[0].dataChangeEvent.entities[0].operation;
    
    const apiInvoiceResponse = await oauthClient.makeApiCall({ url: `${url}v3/company/${companyID}/invoice/${invoiceId}` });

    const invoiceDetails = JSON.parse(apiInvoiceResponse.text());
    // const invoiceDetails = await getInvoiceById(invoiceId);


    console.log('Invoice Items Details:');
    invoiceDetails.Invoice.Line.forEach(async line => {
        // 检查 DetailType 确保它是 SalesItemLineDetail 类型
        if (line.DetailType === 'SalesItemLineDetail') {
            const itemDetails = line.SalesItemLineDetail;
            const itemResponse = await oauthClient.makeApiCall({ url: `${url}v3/company/${companyID}/item/${itemDetails.ItemRef.value}?minorversion=70` });
            const itemData = JSON.parse(itemResponse.text());
            const SKU = itemData.Item.Sku
            
            
        }
        })
    }else{
    console.log(`${hookType} Webhook is under construction`)

    
    }
}