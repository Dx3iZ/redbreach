const https = require('https');

const data = JSON.stringify({ term: 'test@gmail.com' });

const options = {
  hostname: 'breach.vip',
  port: 443,
  path: '/api/search',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  let responseData = '';
  res.on('data', d => {
    responseData += d;
  });
  res.on('end', () => {
    console.log(responseData);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
