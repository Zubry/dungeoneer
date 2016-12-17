module.exports = function(e) {
  require('./door-east.js')(e);
  require('./door-west.js')(e);
  require('./door-north.js')(e);
  require('./door-south.js')(e);
  require('./ggt-portal.js')(e);
  require('./end-portal.js')(e);
};
