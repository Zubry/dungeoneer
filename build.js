const browserify = require('browserify');
const fs = require('fs');

const b = browserify({
  paths: [
    __dirname
  ]
});

b.add(__dirname + '/client/game/');
// b.add(__dirname + '/client/game/**/*.js');
b.bundle().pipe(fs.createWriteStream(__dirname + '/client/game/bundle.js'));
