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
      archive.isUrlArchived(url, function(exists) {
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
  } else if (req.method === 'POST' && req.url === '/') {
    //check if url is in sites.txt
    req.on('data', function(data) {
      var urlToAdd = data.toString().slice(4);
      archive.isUrlInList(urlToAdd, function(is) 
      {
        if (!is) {
          archive.addUrlToList(urlToAdd);
        }
        res.writeHead(302, {});
        res.end();
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