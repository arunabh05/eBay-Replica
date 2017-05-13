# eBay-Replica

### RESTful web application to replicate eBay.

## eBay - version 1 
### Technology Stack: AngularJS, ExpressJS, NodeJS, and MySQL 

### Features:

1. User Authentication and Password encryption using bcrypt.

2. Add produtcs to cart, sell products, buy products, payment, user profiles, eBay handles.

3. User Tracking using winston

3. Connection pooling for database.

## eBay - version 2 
### Technology Stack: AngularJS, ExpressJS, NodeJS, MongoDB, RabbitMQ and PassportJS 

### New Features:

1. Migrated the database from MySQL to MongoDB.

2. Added Middleware using RabbitMQ.

3. Added Authentication Middleware using PassportJS.

4. Chai-Mocha Testing

## eBay - version 3 

### Technology Stack: AngularJS, ExpressJS, NodeJS, MySQL, Java Web Services 

### New Features:

1. SOAP based web service for the version 1 of the application.

## Performance Analysis

Each version of the application is tested for performance with JMeter with different testcases ranging from 100 - 500 concurrent users using the application.

The Comparision chart show the difference between different versions.

x-axis : Number of concurrent users.

y-axis : Average response time in micro seconds.

![Alt text](https://github.com/arunabh05/eBay-Replica/blob/master/comparision_chart2.png)

### The application achieved maximum performance with MongoDB database with connection pooling and RabbitMQ Middleware which provided better throughput to the application.
