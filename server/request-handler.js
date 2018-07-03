/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

//create a dataStorage obj to be returned with the GET and POST requests
var dataStorage = {};
dataStorage.results = [];

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/


  var headers = defaultCorsHeaders;
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status. Default it to "not found 404"
  var statusCode = 404;

  //GET request will set status to 200 and return dataStorage
  if (request.method === 'GET' && request.url.includes('/classes/messages')) {
    statusCode = 200;
    headers['Content-Type'] = 'application/json';
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(dataStorage));
  }

  //POST request will set status to 201 and input the data stream's chunks into dataStorage
  //returns dataStorage
  if (request.method === 'POST' && request.url.includes('/classes/messages')) {
    statusCode = 201;
    headers['Content-Type'] = 'application/json';
    response.writeHead(statusCode, headers);
    request.on('data', (chunk) => {
      dataStorage.results.push(JSON.parse(chunk));
    }).on('end', () => response.end(JSON.stringify(dataStorage))
    );
  }

  //OPTIONS request just sends headers
  if (request.method === 'OPTIONS') {
    statusCode = 204;
    headers['Content-Type'] = 'application/json';
    response.writeHead(statusCode, headers);
    response.end();
  }


  
  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  //In case of error, the writeHead function sends back the headers+statusCode
  response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // response.write()
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  response.end(JSON.stringify(dataStorage));
};


exports.requestHandler = requestHandler;
