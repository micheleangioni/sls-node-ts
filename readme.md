# Serverless Node TypeScript

> Serverless Node TypeScript is a starter kit to write serverless applications 
> by using the Serverless Framework in Node.js and TypeScript.
> It comes with several configurations such as MongoDB and a GraphQL API set up out of the box.

## Requirements

- Node.js 10.x
- NPM / Yarn
- An AWS Account

## Installation

Run `npm install`.

## Running the Application

To run the application locally, just run `sls offline start --port 8080`.

## Env variables

 - NODE_ENV : Set the environment name
 - MONGO_URI : Set the complete MongoDB connection string

## Deployment

The deployment is handled by the Serverless framework. Just run `sls deploy`.

## Testing

Run `npm test` to run the tests or `npm run watch-test` to run the tests with the watcher.

## Contribution Guidelines

Pull requests are welcome.

## License

Serverless Node TypeScript is free software distributed under the terms of the MIT license.
