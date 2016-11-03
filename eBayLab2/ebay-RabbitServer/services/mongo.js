var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;

/**
 * Connects to the MongoDB Database with the provided URL
 */
require('javascript.util');
var ArrayList = javascript.util.ArrayList;
var connectionPool = new ArrayList();

exports.connect = function(url, callback){
    MongoClient.connect(url, function(err, _db){
      if (err) { throw new Error('Could not connect: '+err); }

      // var connectionPool = [];
      	var c = null;
      	var i;
      	var poolConnection;
      	if (connectionPool.isEmpty()) {
      		for (i = 0; i < 50; i++) {
      		//	console.log(c.connection);
      			c = _db;
      			poolConnection = {
      				id : i,
      				connection : c,
      				isFree : true
      			};
      			connectionPool.add(poolConnection);
      		}
      	}
      	for (i = 0; i < connectionPool.size(); i++) {
      		if (connectionPool.get(i).isFree) {
      			connectionPool.get(i).isFree = false;
      			db = connectionPool.get(i);
      			break;
      		}
      	}
      	if (db === null) {
      	console.log("here");
      		var con = _db;
      		var newPoolConnection = {
      			id : connectionPool.size(),
      			connection : con,
      			isFree : false
      		};
      		connectionPool.add(newPoolConnection);
      		db=newPoolConnection;
      	}
      connected = true;
      console.log(connected +" is connected?");
      callback(db.connection);
    });
};

/**
 * Returns the collection on the selected database
 */
exports.collection = function(name){
    if (!connected) {
      throw new Error('Must connect to Mongo before calling "collection"');
    } 
    return db.connection.collection(name);  
};