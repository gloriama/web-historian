var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  //

  
  if (req.method === 'GET') {
    // filter on URL

    var url = req.url === '/' ? '/index.html' : req.url;
    var pathToStaticFile;

    //determine directory of static file
    if (url === '/index.html' || 
        url === '/loading.html' ||
        url === '/styles.css') {
      pathToStaticFile = archive.paths.siteAssets;
      serveFileContents(pathToStaticFile + url, res);
    } else {
      pathToStaticFile = archive.paths.archivedSites;
      archive.isUrlArchived(url)
        .then(function(exists) {
          if (exists) {
            //repond with 200 and the file contents
            serveFileContents(pathToStaticFile + url, res);
          } else {
          // respond with 404
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('404: Not Found');
          }
        });
    }    
  } else if (req.method === 'POST') {
    //check if url is in sites.txt
    req.on('data', function(data) {
      var url = data.toString().slice(4);
      archive.isUrlInList(url)
        .then(function(is) {
          //add to list if not already in there
          if (!is) {
            archive.addUrlToList(url);
          }
          return;
        })
        .then(function() {
          //redirect to page if already archived, otherwise to loading.html
          return archive.isUrlArchived(url);
        })
        .then(function(isArchived) {
          var redirectUrl;
          if (isArchived) {
            redirectUrl = '/' + url;
          } else {
            redirectUrl = '/loading.html';
          }
          res.writeHead(302, {'Location': 'http://127.0.0.1:8080' + redirectUrl});
          res.end();
        })
        .catch(function (err) {
          console.log(err);
        });   
    });
  } 
  //else if (req.method === 'OPTIONS') {
  //
  //}
};

var serveFileContents = function(fullpath, res) {
  fs.readFile(fullpath, 'utf8', function (err, data) {
    if (err) {
      throw (err);
    }
    if (path.extname(fullpath) === '.css') {
      res.writeHead(200, {'Content-Type': 'text/css'});
    } else {
      res.writeHead(200, {'Content-Type': 'text/html'});
    }
    res.end(data);
  });
};