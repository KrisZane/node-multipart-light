# NodeJS Multipart Light
A lightweight library for easily generating/parsing files and text into a "multipart/form-data" request, to be able to upload/download files and data with NodeJS over HTTP/HTTPS.

To generate a multipart/form-data envelope that can be used for uploading, do the following:
```
"use strict";
// Initiate the generator
let https = require('https');
let multipartGenerate = new (require('./lib/multipartlight').generate);

// Build an array with data objects you want to use
let data = [
  // This is how simple text data is written
  {"data": "I like milk!", "name": "text"}
  // This is how files are added, not that it requires a correct mimeType and that the file is a "Buffer"
  , {"mimeType": "application/json", "data": fs.readFileSync("test.json"), "name": "jsondata"}
];

// Run the generator on your data, this returns an object containing headers and the body of the multipart/form-data
let multipartRequest = multipartGenerate.request(data);

// Add any headers you might feel is missing
multipartRequest.headers['Host'] = 'yourpage.com';
multipartRequest.headers['User-Agent'] = 'Node.JS';

// Build an HTTP or HTTPS request and don't forget to add the headers
let request = https.request({
  hostname: 'yourpage.com',
  port: 443,
  path: '/test',
  method: 'POST',
  headers: multipartRequest.headers
});

// Write the body data to the request and end the connection
request.write(multipartRequest.body);
request.end();
```

The returned data object from the generator will look like this:
```
{
  "headers": {
    'Content-Type': 'multipart/form-data; boundary=2dTE2A',
    'Content-Length': 159
  },
  "body": <Buffer 0d 0a ... >
}
```
