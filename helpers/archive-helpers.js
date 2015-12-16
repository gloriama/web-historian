var fs = require('fs');
var path = require('path');
var _ = require('underscore');

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
};

exports.addUrlToList = function(url, callback) {
  //append '\n' + url to sites.txt
};

exports.isUrlArchived = function(url, callback) {
  //check for existence of exports.paths.archivedSites/[url]
};

exports.downloadUrls = function(urls) {
  //filter urls by !isUrlArchived
  //for each, call htmlfetcher.js(?) to save the url to exports.paths.archivedSites/[url]
};
