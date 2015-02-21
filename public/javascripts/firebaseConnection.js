var config = require('./config/app-config');

var connection = new Firebase( config.firebaseBaseUrl );

module.exports = connection;