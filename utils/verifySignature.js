// utils/verifySignature.js
const crypto = require('crypto');

/**
 * Verifies the webhook signature.
 * @param {object} req - The request object from Express.
 * @returns {boolean} - Returns true if the signature is valid, otherwise false.
 */
exports.verifySignature = (req) => {
    const webhookPayload = JSON.stringify(req.body);
    const signature = req.get('intuit-signature');

    if (!signature) {
        console.error('No signature provided');
        return false;
    }

    const expectedHash = crypto.createHmac('sha256', process.env.WEBHOOK_VERIFIER).update(webhookPayload).digest('base64');

    if (signature === expectedHash) {
        return true;
    } else {
        console.error('Invalid signature');
        return false;
    }
};
