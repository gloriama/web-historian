// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.


var archive = require('../helpers/archive-helpers');

archive.readListOfUrls()
  .then(function(urls) {
    archive.downloadUrls(urls)
  })
  .catch(function(err) {
    console.log(err);
  });

//to set up cron job on local machine, to run the above command every minute:
  //run "crontab -e" from terminal
  //add "* * * * * /usr/local/bin/node /Users/student/Desktop/2015-11-web-historian/workers/htmlfetcher.js"