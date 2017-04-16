var ejs = require('ejs');
var mysql = require('mysql');
require('javascript.util');

function getConnection() {
	var connection = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : 'root123',
		database : 'ebayapp',
		port : 3306
	});
	return connection;
}

var ArrayList = javascript.util.ArrayList;
var connectionPool = new ArrayList();

function getConnectionFromConnectionPool() {
	var c = null;
	var i;
	var poolConnection;
	if (connectionPool.isEmpty()) {
		for (i = 0; i < 50; i++) {
			c = getConnection();
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
			c = connectionPool.get(i);
			break;
		}
	}
	if (c === null) {
		var con = getConnection();
		var newPoolConnection = {
			id : connectionPool.size(),
			connection : con,
			isFree : false
		};
		connectionPool.add(newPoolConnection);
		c=newPoolConnection;
	}
	return c;
}

function releaseConnection(id) {
	var count = 0;
	for (var i = 0; i < connectionPool.size(); i++) {
		if (id === connectionPool.get(i).id) {
			connectionPool.get(i).isFree = true;
			}
		if (connectionPool.get(i).isFree) {
			count++;
		}
	}
}

function fetchData(callback, sqlQuery) {
	var conn = getConnectionFromConnectionPool();
	conn.connection.query(sqlQuery, function(err, rows, fields) {
		if (err) {
			console.log("ERROR: " + err.message);
		} else { // return err or result
			callback(err, rows);
		}
	});
	 releaseConnection(conn.id);
}

function insertData(callback, sqlQuery) {
	var conn = getConnectionFromConnectionPool();
	conn.connection.query(sqlQuery, function(err, result) {
		if (err) {
			console.log("ERROR: " + err.message);
		} else { // return err or result
			result = 1;
			callback(err, result);
		}
	});
	 releaseConnection(conn.id);
}

exports.insertData = insertData;
exports.fetchData = fetchData;