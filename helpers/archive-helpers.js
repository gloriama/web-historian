var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  callback = callback || _.identity;
  //read the file
  var urls;
  //save the urls to urls (which will be an array), specifying utf8 encoding
  //and call the given callback on it;
  fs.readFile(exports.paths.list, 'utf8', function (err, data) {
    if (err) {
      throw err;
    } else {
      urls = data.split('\n');
      return callback(urls);
    }
  })
};

exports.isUrlInList = function(url, callback) {
  //call readListOfUrls with callback to return true/false
  exports.readListOfUrls(function(urls) {
    var isInList = _.contains(urls, url);
    return callback(isInList);
  });
};

exports.addUrlToList = function(url, callback) {
  //call appendFile on exports.paths.list with '\n' + url
  fs.appendFile(exports.paths.list, '\n' + url, function(err) {
    if (err) {
      throw err;
    } else {
      callback();
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  //check for existence of exports.paths.archivedSites/[url]
  fs.exists(exports.paths.archivedSites + '/' + url, callback);

};

exports.downloadUrls = function(urls) {

  _.each(urls, function(url) {
    var options = {
      hostname: url,
      method: 'GET',
      headers: {}
    };



    var request = http.request(options, function (response) {
      var responseBody = "";
      response.on('data', function (chunk) {
        responseBody += chunk.toString();

      });
      response.on('end', function () {
        fs.writeFile(exports.paths.archivedSites + '/' + url, responseBody, function (err) {
          if (err) throw err;
        });
      });
    });

    request.end();

  });
  //and save the contents to exports.paths.archivedSites/[url] <-- htmlfetcher


};
