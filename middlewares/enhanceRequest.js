const OAuthClient = require('intuit-oauth');

function enhanceRequestWithCompanyDetails(req, res, next) {
    try {

        if(!req.oauthClient) {
            throw new Error('OAuth Client not initializd yet.')
        }

        //const oauthClient = req.session.oauthClient;
        const companyID = req.oauthClient.getToken().realmId;
        const url = req.oauthClient.environment === 'sandbox' ? OAuthClient.environment.sandbox : OAuthClient.environment.production;

        // Attach the company details to the request object
        req.companyDetails = { companyID, url };
        console.log('went through the middleware enhanceRequestWithCompanyDetails');
        // Call the next middleware/route handler
        next();
    } catch (error) {
        console.error("Failed to enhance request with company details:", error);
        res.status(500).send("Internal Server Error");
    }
}
module.exports = enhanceRequestWithCompanyDetails