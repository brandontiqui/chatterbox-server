/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  //'access-control-allow-headers': 'X-Requested-With',
  'access-control-max-age': 10 // Seconds.
};

var optionsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST',
  'access-control-allow-headers': 'content-type'
};

// var messages = [];

var obj = {};
var count = 0;
obj.results = [{value: null, objectId: -1}];

var requestHandler = function(request, response) {

  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'text/plain';
  // headers['Content-Type'] = 'application/json';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  var statusCode;
  var body = [];
  var dataObject = JSON.stringify(obj);
  if (request.method === 'GET') {

    if (request.url === '/') {
      response.statusCode = 200;
    } else if (request.url.indexOf('classes/messages') === -1) {
      response.statusCode = 404;
    } else {
      response.statusCode = 200;
    }
    response.writeHead(response.statusCode, headers);
    console.log('status code for post is', response.statusCode);
    // console.log(dataObject.results.objectId);
    response.end(dataObject);

  } else if (request.method === 'POST') {
    console.log('in Post');

    response.statusCode = 201;
    response.writeHead(response.statusCode, headers);
    console.log('status code for post is', response.statusCode);
    var body = '';

    request.on('data', function(data) {
      body += data;
    });

    request.on('end', function() {

      var post = JSON.parse(body);
      //var temp = {};
      //temp.objectId = count++;
      //temp.text = post;

      // obj.results.push(post);
      post.objectId = count++;
      obj.results.push(post);
    });
    response.end();
  } else if (request.method === 'OPTIONS') {
    console.log('HANDELING THE OPTIONS REQUEST');
    response.statusCode = 200;
    //not sure about what to put inside the response.end();
    
    response.writeHead(response.statusCode, optionsHeaders);
    //response.writeHead(response.statusCode, headers);
    console.log('status code for post is', response.statusCode);
    response.end(JSON.stringify(null)); //copied from Fred's code

  }
  





  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // response.end('Hello, World!');
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

// var defaultCorsHeaders = {
//   'access-control-allow-origin': '*',
//   'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
//   'access-control-allow-headers': 'content-type, accept',
//   'access-control-max-age': 10 // Seconds.
// };

module.exports.requestHandler = requestHandler;
module.exports.defaultCorsHeaders = defaultCorsHeaders;
