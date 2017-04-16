var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;
var option = {
		};

exports.connect = function(url, callback){
    MongoClient.connect(url, option,function(err, _db){
      if (err) { throw new Error('Could not connect: '+err); }
      db = _db;
      connected = true;
      callback(db);
    });
};


exports.getConnection = function(url, callback){
		MongoClient.connect(url,option, function(err, _db){
		  if (err) { throw new Error('Could not connect: '+err); }
		   	  db = _db;
		      connected = true;
		      callback(db);
		  });
};


exports.collection = function(name){
    if (!connected) {
      throw new Error('Must connect to Mongo before calling "collection"');
    } 
    return db.collection(name);
};