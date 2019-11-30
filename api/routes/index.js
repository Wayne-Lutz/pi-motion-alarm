// This is our main Express route configuration index file.
'use strict';

// Pull in our alarm-routes.
const alarmRoutes = require('./alarm-routes');

// And export them.
module.exports = function(app) {
	alarmRoutes(app);
};
