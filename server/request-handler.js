var fs = require('fs');
var url = require('url');
/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var messagesFile = 'messages.txt';

var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

var writeStaticFile = function(response, filePath, contentType) {
  var fileContents = fs.readFileSync(filePath);
  response.writeHeader(200, {'Content-Type': contentType});
  response.end(fileContents);  
};

var serverStaticFile = {
  '/': function(response) {
    writeStaticFile(response, 'client/index.html', 'text/html');
  },
  '/styles/styles.css': function(response) {
    writeStaticFile(response, 'client/styles/styles.css', 'text/css');
  },
  '/scripts/app.js': function(response) {
    writeStaticFile(response, 'client/scripts/app.js', 'text/javascript');
  },
  '/bower_components/jquery/dist/jquery.js': function(response) {
    writeStaticFile(response, 'client/bower_components/jquery/dist/jquery.js', 'text/javascript');
  },
  '/bower_components/underscore/underscore.js': function(response) {
    writeStaticFile(response, 'client/bower_components/underscore/underscore.js', 'text/javascript');
  }
};

var sendResponse = function(response, statusCode, data) {
  
  response.writeHead(statusCode, headers);
  response.end(data);
};

var requestActions = {
  'OPTIONS': function(request, response) {
    sendResponse(response, 200);
  },
  'POST': function(request, response) {
    if (request.url === '/classes/messages') {
      // statusCode = 201;
      // append object to file
      request.on('data', function(data) {
        if (!fs.existsSync(messagesFile)) {
          var obj = {results: []};         
        } else {
          var obj = fs.readFileSync(messagesFile);
          obj = JSON.parse(obj);
        }
        obj.results.unshift(JSON.parse(data.toString()));
        fs.writeFileSync(messagesFile, JSON.stringify(obj));
      });
    }
    sendResponse(response, 201);
  },
  'GET': function(request, response) {
    if (request.url === '/classes/messages?order=-createdAt' || request.url === '/classes/messages') {
      var data;
      if (!fs.existsSync(messagesFile)) {
        data = JSON.stringify({results: []});
      } else {
        var data = fs.readFileSync(messagesFile);
        data = JSON.stringify(JSON.parse(data.toString()));
      } 
      sendResponse(response, 200, data);
    }
  }
};

var requestHandler = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  // var statusCode = 200;
  var serveFile = serverStaticFile[url.parse(request.url).pathname];
  if (serveFile) {
    serveFile(response);
  }
  if (url.parse(request.url).pathname !== '/classes/messages') {
    sendResponse(response, 404);
  }
  var requestAction = requestActions[request.method];
  if (requestAction) {
    requestAction(request, response);
  }
};

module.exports.requestHandler = requestHandler;