"use strict";
class Generate {
  constructor() {
    let hash = this.hash(10);
    this.options = {
      "boundary": hash
    };
  }
  hash(characterMax) {
    let hashCharacters = [
      'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'
      ,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
      ,'0','1','2','3','4','5','6','7','8','9'
    ];
    let hash = '';

    for(let i = 0; i < characterMax; i += 1) {
      hash += hashCharacters[Math.floor(Math.random() * hashCharacters.length)];
    };
    return hash;
  }
  request(multipartEntries) {
    /* As per http://www.w3.org/Protocols/rfc1341/7_2_Multipart.html */
    /* http://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types */
    /* Use fat arrows () => {this.watchUpdates();} */
    /* Thanks to this guy: https://gist.github.com/ninozhang/5607358 */
    let headers = {};
    let multipartBody = {};
    let multipartBodyEntries = [];

    let crlf = '\r\n';
    let delimiter = crlf + '--' + this.options.boundary + crlf;
    let closeDelimiter = crlf + '--' + this.options.boundary + '--';
    let contentDispositions = {
      "file": 'Content-Disposition: form-data; name="{name}"; filename="{name}"'
      , "text": 'Content-Disposition: form-data; name="{name}"'
      , "type": "Content-Type: {mimeType}"
    };

    for(let i = 0; i < multipartEntries.length; i += 1) {
      if(Buffer.isBuffer(multipartEntries[i].data)) {
        multipartBodyEntries.push(new Buffer(delimiter));
        multipartBodyEntries.push(new Buffer(contentDispositions.file.replace(/{name}/gim, multipartEntries[i].name)));
        multipartBodyEntries.push(new Buffer(crlf + contentDispositions.type.replace('{mimeType}', multipartEntries[i].mimeType)));
        multipartBodyEntries.push(new Buffer(crlf + crlf));
        multipartBodyEntries.push(multipartEntries[i].data);
      }
      else {
        multipartBodyEntries.push(new Buffer(delimiter));
        multipartBodyEntries.push(new Buffer(contentDispositions.text.replace('{name}', multipartEntries[i].name)));
        multipartBodyEntries.push(new Buffer(crlf + crlf));
        multipartBodyEntries.push(new Buffer(multipartEntries[i].data));
      };
    };
    multipartBodyEntries.push(new Buffer(closeDelimiter));
    multipartBody = Buffer.concat(multipartBodyEntries);

    headers = {
      'Content-Type': 'multipart/form-data; boundary=' + this.options.boundary,
      'Content-Length': multipartBody.length
    };

    return {"headers": headers, "body": multipartBody};
  }
}
exports.generate = Generate;
