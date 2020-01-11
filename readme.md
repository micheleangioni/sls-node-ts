# Serverless Node TypeScript

> Serverless Node TypeScript is a starter kit to write serverless applications 
> by using the Serverless Framework in Node.js and TypeScript.
> It comes with several configurations such as MongoDB and a GraphQL API set up out of the box.

## Requirements

- Node.js 12.x
- NPM / Yarn
- An AWS Account with proper permissions

## Installation

Run `npm install`.

## Running the Application

To run the application locally, just run `npm run offline`.

## Env variables

 - NODE_ENV : Set the environment name, not used in the code
 - ENV : Set manually the environment name, this is the variable used thoughout the code and set via serverless CLI
 - MONGO_URI : Set the complete MongoDB connection string

## Deployment

The deployment is handled by the Serverless Framework. Just run `sls deploy`.

In order to deploy setting a `staging` environment, run `deploy-staging`.
Instead, to deploy setting a `production` environment, run `deploy-production`.

## Features

#### CORS

CORS is setup out of the box, allowing access from all websites, by setting the `Access-Control-Allow-Origin` header
equal to `'*'`.

In order to customise the CORS response, check the [Middy CORS middleware](https://github.com/middyjs/middy/blob/master/docs/middlewares.md#cors).

Furthermore, in order to properly [use CORS with custom authorizers](https://serverless.com/blog/cors-api-gateway-survival-guide/),
their headers must be configured manually in the `serverless.yml` file.

#### Error Messages

All error messages have the following format:

```
{
    "code": (string),
    "error": (string),
    "hasError": 1,
    "statusCode":  (number)
}
```

## Testing

Run `npm test` to run the tests or `npm run watch-test` to run the tests with the watcher.

## Contribution Guidelines

Pull requests are welcome.

## License

Serverless Node TypeScript is free software distributed under the terms of the MIT license.
