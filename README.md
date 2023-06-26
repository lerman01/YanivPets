## Installation (Required to run only one time)

Before running the app for the first time please make insure

1. Install docker
2. Open terminal on the project directory and run: `docker build . -t pet-app`

## Start the application
You may run the application with different DB's:
- for MongoDB run: `docker compose -f docker-compose-mongo.yml up --abort-on-container-exit`
- for MySQL rum: `docker compose -f docker-compose-mysql.yml up --abort-on-container-exit`

## Server Endpoints (port: 3000)

Once the application started you can execute the following endpoints:

- Create new pet:
  POST `/pet`
  body:`{
  "type": "dog",
  "properties": { 
  "name": "foo",
  "age": 1.5,
  "color": "blue"
  }
  }`


- Query pet:
  POST `/pet/query`
- body:`{    
  "filters": [{
  "key": "type",
  "operation": "EQ",
  "value": "dog"
  },
  {
  "key": "properties.age",
  "operation": "GT",
  "value": 3.5
  }]
  }`
    * valid operation are: "NEQ" | "EQ" | "GT" | "LT"