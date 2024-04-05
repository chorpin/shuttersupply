'use strict';
//const ngrok = require('ngrok');

require('dotenv').config();

/**
 * Require the dependencies
 * @type {*|createApplication}
 */
const express = require('express');
const jwt =require('jsonwebtoken')
const app = express();
const path = require('path');
const OAuthClient = require('intuit-oauth');
const bodyParser = require('body-parser');
var crypto = require('crypto');
const pool = require('./database/db');
const ngrok = process.env.NGROK_ENABLED === 'true' ? require('ngrok') : null;
var frontendBaseUrl='https://wfdapp.shutter.supply'
/**
 * Configure View and Handlebars
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'client/build')));
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');
app.use(bodyParser.json());

const urlencodedParser = bodyParser.urlencoded({ extended: false });

/**
 * App Variables
 * @type {null}
 */
let oauth2_token_json = null;
let redirectUri = '';

/**
 * Instantiate new Client
 * @type {OAuthClient}
 */

let oauthClient = null;

/**
 * Home Route
 
app.get('/', function (req, res) {
  res.render('index');
});
*/
/**
 * Get the AuthorizeUri
 */
app.get('/authUri', urlencodedParser, function (req, res) {
 oauthClient = new OAuthClient({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    environment: process.env.ENVIRONMENT,
    redirectUri: redirectUri
  });


  const authUri = oauthClient.authorizeUri({
    scope: [OAuthClient.scopes.Accounting],
    state: 'intuit-test',
  });
  console.log('/authUri-scope:',OAuthClient.scopes.Accounting)
  res.send(authUri);
});


// 添加用于处理Webhooks通知的路由
app.post('/webhook/invoices', async function(req, res) {
  console.log('------Here is the webhook-----')
  var webhookPayload = JSON.stringify(req.body);
  var signature = req.get('intuit-signature');

  // If signature is empty, return 401 (Unauthorized)
  if (!signature) {
      return res.status(401).send('FORBIDDEN');
  }

  // Verify the payload with the intuit-signature hash
  var hash = crypto.createHmac('sha256', process.env.WEBHOOK_VERIFIER).update(webhookPayload).digest('base64');
  if (signature === hash) {
      // Log the valid webhook payload
      const invoiceId = req.body.eventNotifications[0].dataChangeEvent.entities[0].id;
      const invoiceOperation = req.body.eventNotifications[0].dataChangeEvent.entities[0].operation;
      console.log("Valid Webhook invoiceId notification received:", invoiceId);
      console.log("Valid Webhook invoiceOperation:", invoiceOperation);
      

      //
      const companyID = oauthClient.getToken().realmId;
      const url = oauthClient.environment == 'sandbox' ? OAuthClient.environment.sandbox : OAuthClient.environment.production;
  
      // 在 token 创建后进行 API 调用
      const apiInvoiceResponse = await oauthClient.makeApiCall({ url: `${url}v3/company/${companyID}/invoice/${invoiceId}` });
      //console.log('apiInvoiceResponse:',apiInvoiceResponse)

      const invoiceDetails = JSON.parse(apiInvoiceResponse.text());

      // 假设每个 Line 中的 SalesItemLineDetail 包含您需要的信息
      console.log('Invoice Items Details:');
      invoiceDetails.Invoice.Line.forEach(async line => {
          // 检查 DetailType 确保它是 SalesItemLineDetail 类型
          if (line.DetailType === 'SalesItemLineDetail') {
              const itemDetails = line.SalesItemLineDetail;
              const itemResponse = await oauthClient.makeApiCall({ url: `${url}v3/company/${companyID}/item/${itemDetails.ItemRef.value}` });
              const itemData = JSON.parse(itemResponse.text());
                // 假设 SKU 信息在响应的某个字段中
              console.log('itemResponse',itemResponse)
              console.log('itemData',itemData)
              console.log(`SKU: ${itemData.Item.Sku}`); // 根据实际响应结构调整路径
              //console.log(itemDetails)
              //console.log(`Item: ${itemDetails.ItemRef.name}`);
              //console.log(`Description: ${line.Description}`);
              //console.log(`Quantity: ${itemDetails.Qty}`);
              //console.log(`Unit Price: ${itemDetails.UnitPrice}`);
              // 如果需要，这里也可以添加对 SKU 的处理，但是示例中的响应没有包含 SKU 信息
          }
        })
      // Here you can perform any action needed based on the webhook data
      // For example, updating a database, logging to a file, etc.

      // Send success response
      return res.status(200).send('SUCCESS');
  } else {
      // If the signature does not match, return 401 (Unauthorized)
      return res.status(401).send('FORBIDDEN');
  }
});
// 数据库是否正常连接
app.get('/products', async (req, res) => {
  try {
    console.log('Fetching the data.....')
    console.log('pool:--->',pool)
    const queryResult = await pool.query('SELECT * FROM shuttersupply.product LIMIT 5');
    console.log('queryResult--->',queryResult)
    res.json(queryResult.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


/**
 * Handle the callback to extract the `Auth Code` and exchange them for `Bearer-Tokens`
 */
app.get('/callback', function (req, res) {
  oauthClient
    .createToken(req.url)
    .then(function (authResponse) {
      oauth2_token_json = JSON.stringify(authResponse.getJson(), null, 2);
      const { access_token, refresh_token } = authResponse.getJson();
      // 创建 JWT
    
      let jwtToken = jwt.sign(
        {
          access_token: access_token,
          refresh_token: refresh_token
        },
        'wfd_secret_key', // 使用安全的密钥
        { expiresIn: '1h' }
      );
      const frontendRedirectUrl = `${frontendBaseUrl}/callbackfront?jwtToken=${jwtToken}`;
      //console.log('frontendRedirectUrl:+++--->',frontendRedirectUrl)
      res.redirect(frontendRedirectUrl);
      
    })
    .catch(function (e) {
      console.error(e);
      res.redirect('/');
    });

  //res.send('');
});

/**
 * Display the token : CAUTION : JUST for sample purposes
 */
app.get('/retrieveToken', function (req, res) {
  res.send(oauth2_token_json);
});

/**
 * Refresh the access-token
 */
app.get('/refreshAccessToken', function (req, res) {
  
  oauthClient
    .refresh()
    .then(function (authResponse) {
      //console.log(`The Refresh Token is  ${JSON.stringify(authResponse.getJson())}`);
      oauth2_token_json = JSON.stringify(authResponse.getJson(), null, 2);
      res.send(oauth2_token_json);
    })
    .catch(function (e) {
      console.error(e);
    });
});

/**
 * getCompanyInfo ()
 * 
 * 
 * 
 * 
 */
app.get('/getCompanyInfo', async function (req, res) {
  try {
    

    const companyID = oauthClient.getToken().realmId;
    const url = oauthClient.environment == 'sandbox' ? OAuthClient.environment.sandbox : OAuthClient.environment.production;

    // 在 token 创建后进行 API 调用
    const apiResponse = await oauthClient.makeApiCall({ url: `${url}v3/company/${companyID}/companyinfo/${companyID}` });
    res.send(JSON.parse(apiResponse.text()));
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/createItem', async function (req, res) {
  try {
    const companyID = oauthClient.getToken().realmId;
    const url = oauthClient.environment == 'sandbox' ? OAuthClient.environment.sandbox : OAuthClient.environment.production;

    // 调整后的构建创建Item的请求体，以满足创建库存项目的需要
    const itemData = req.body

    // 进行API调用以创建Item
    const apiResponse = await oauthClient.makeApiCall({
      url: `${url}/v3/company/${companyID}/item?minorversion=70`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData)
    });

    // 发送API响应回客户端
    res.send(JSON.parse(apiResponse.text()));
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



/**
 * disconnect ()
 */
app.get('/disconnect', function (req, res) {
  console.log('The disconnect called ');
  const authUri = oauthClient.authorizeUri({
    scope: [OAuthClient.scopes.OpenId, OAuthClient.scopes.Email],
    state: 'intuit-test',
  });
  res.redirect(authUri);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

console.log('NGROK_ENABLED:', process.env.NGROK_ENABLED);

/**
 * Start server on HTTP (will use ngrok for HTTPS forwarding)
 */
const server = app.listen(process.env.PORT || 8000, () => {
  //console.log(`💻 Server listening on port ${server.address().port}`);
  if (!ngrok) {
    redirectUri = 'https://wfdapp.shutter.supply/callback';
    console.log('redirectUri--->:',redirectUri)
    console.log(
      `💳  Step 1 : Paste this URL in your browser : ` +
        'http://localhost:' +
        `${server.address().port}`,
    );
    console.log(
      '💳  Step 2 : Copy and Paste the clientId and clientSecret from : https://developer.intuit.com',
    );
    console.log(
      `💳  Step 3 : Copy Paste this callback URL into redirectURI :` +
        'http://localhost:' +
        `${server.address().port}` +
        '/callback',
    );
    console.log(
      `💻  Step 4 : Make Sure this redirect URI is also listed under the Redirect URIs on your app in : https://developer.intuit.com`,
    );
  }

  
});

/**
 * Optional : If NGROK is enabled
 */
if (ngrok) {
  console.log('NGROK Enabled');
  ngrok
    .connect({ addr: process.env.PORT || 8000 })
    .then((url) => {
      //console.log('urlllll:',url)
      frontendBaseUrl=url
      redirectUri = `${url}/callback`;
      console.log('redirectUri--->:',redirectUri)

      console.log(`💳 Step 11 : Paste this URL in your browser :  ${url}`);
      console.log(
        '💳 Step 2 : Copy and Paste the clientId and clientSecret from : https://developer.intuit.com',
      );
      console.log(`💳 Step 3 : Copy Paste this callback URL into redirectURI :  ${redirectUri}`);
      console.log(
        `💻 Step 4 : Make Sure this redirect URI is also listed under the Redirect URIs on your app in : https://developer.intuit.com`,
      );
    })
    
}
