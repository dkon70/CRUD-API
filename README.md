# Simple CRUD API

To run in dev mode:
```bash
npm run start:dev
```
To build and run in production mode:
```bash
npm run start:prod
```
To run in multi mode with load balancer:
```bash
npm run multi
```
In multi mode mode, the load balancer listens for requests on port 3000 and sends requests to workers using a round-robin algorithm

+ GET api/users is used to get all persons
+ GET api/users/{userId} is used to get one person by ID
+ POST api/users is used to create record about new user and store it in database
+ PUT api/users/{userId} is used to update existing user
+ DELETE api/users/{userId} is used to delete existing user from database 
