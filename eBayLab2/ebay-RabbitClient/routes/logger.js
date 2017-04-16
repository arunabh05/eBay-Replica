var winston = require('winston');

var date = new Date();
var winston = new (winston.Logger)({  
    transports: [
        new (winston.transports.Console)({ level: 'debug',
        	'timestamp': String(new Date())
        }),
        new (winston.transports.File)({ filename: 'events.log',
        	'timestamp': String(new Date()) }	
        )
    ]
});

module.exports = winston;  