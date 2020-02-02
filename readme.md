# Serverless Node TypeScript

[![Build Status](https://api.travis-ci.org/micheleangioni/sls-node-ts.svg?branch=master)](https://travis-ci.org/micheleangioni/sls-node-ts)

> Serverless Node TypeScript is a starter kit to write serverless applications 
> by using the Serverless Framework in Node.js and TypeScript.
> It comes with several configurations such as MongoDB and a GraphQL API set up out of the box.

## Introduction

Serverless Node TypeScript is a starter kit for serverless applications written in TypeScript 
and using the [Serverless Framework](https://serverless.com) to bundle the Lambda functions.

The application is structured with Domain-Driven Design in mind.

It comes with the following features out of the box:

- Configured [Serverless Framework](https://serverless.com)
- CORS
- Secrets via AWS Secrets Manager (see `src/config/index.ts`)
- Authentication via [Lambda Authorizers](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html)
- [Apollo GraphQL server](https://www.apollographql.com/docs/apollo-server/) with modularized schemas
- REST endpoint
- DDD structure
- MongoDB integration
- [Offline bundling](https://github.com/dherault/serverless-offline) for local development
- Testing through Jest

## Requirements

- Node.js 12.x
- NPM / Yarn
- An AWS Account with proper permissions

## Installation

First, edit the application name in the `name` field of the `package.json` file.

Then tun run `npm install`.

## Running the Application

To run the application locally, just run `npm run offline`.

## Environment variables

 - `NODE_ENV` : Set the environment name, not used in the code
 - `ENV` : Set manually the environment name, this is the variable used throughout the code and set via Serverless CLI
 - `MONGO_URI` : Set the complete MongoDB connection string. Default `mongodb://localhost:27017/sls-node-ts-<ENV>}`, where `<ENV>` in the `ENV` env variable 
 - `REGION` : AWS region, default `eu-west-1`

## Deployment

The deployment is handled by the Serverless Framework. Just run `sls deploy`.

In order to deploy setting a `staging` environment, run `npm run deploy-staging`.
Instead, to deploy setting a `production` environment, run `npm run deploy-production`.

To remove the deployed environment, run `npm run remove-staging` or `npm run remove-production`.

## Features

### Authentication

Authentication is handled via [Lambda Authorizers](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html),
easily configurable [via Serverless Framework](https://serverless.com/framework/docs/providers/aws/events/apigateway#http-endpoints-with-custom-authorizers).

In practice, before starting our Lambda function, the Lambda Authorizer in `src/api/authorizer/index.ts` will run.
In it, custom code can be added to check for example an input Authorization Token.

#### Apollo Server (GraphQL)

Serverless Node TypeScript comes with an Apollo Server configured out of the box.

The default endpoint is `/graphql` and you can use a [GraphQL Introspector] to see the available Queries and Mutations.

For example, the following Query lists the available Users:

```graphql
query fetchUsers {
  getUsers {
    _id
    createdAt
    email
    username
  }
}
```

and the following Mutation creates a new User:

```graphql
mutation CreateNewUser {
  createUser(email: "test@test.com", username: "Test") {
    email
    username
  }
}
```

#### CORS

CORS is setup out of the box, allowing access from all websites, by setting the `Access-Control-Allow-Origin` header
equal to `'*'`.

In order to customise the CORS response, check the [Middy CORS middleware](https://github.com/middyjs/middy/blob/master/docs/middlewares.md#cors).
and the `handler.ts` file.

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

### MongoDB

MongoDB is the chosen default database. The connection string can be configured by setting the `MONGO_URI` env variable.
The default connection string is `mongodb://localhost:27017/sls-node-ts-<ENV>`, where `<ENV>` in the `ENV` env variable.
In order to change it, head to the `src/infrastructure/mongo/index.ts` file.

#### Secrets

In `staging` and `production` environments, secrets are fetched from AWS Secrets Manager and saved into local environment variables.

A single JSON formatted Secret per environment must be created, named `sls-node-ts/<ENV>` (where `<ENV>` is either `staging` or `production`).
Each secret per environment must contain all the necessary key value pairs in the format `<env variable>: <Secret Name>`, eg.

```json
{
  "MONGO_URI": "<THE MONGODB CONNECTION STRING>"
}
```

and they will be injected as environment variable in the application.

In order to create, for example, the new secret for the `staging` environment containing, for example, the MongoDB connection string, 
which must be supplied through the `MONGO_URI` environment variable, perform the following steps:

1) Head over the AWS Console in the [Secrets Manager](https://aws.amazon.com/secrets-manager/) service
2) In the menu on the left, select `Secrets`
3) Click to the `Store a new secret` button
4) Select `Other type of secrets`
5) In the `Specify the key/value pairs to be stored in this secret` section, enter `MONGO_URI` as key and your full Mongo URI as value. Then click `Next`
6) In the `Secret name` field, enter `sls-node-ts/staging` and click `Next` to complete the creation 

(!) The name of the secret (in the above example `sls-node-ts/staging`) is bound to the **application name**,
the one defined in the `name` field of the `package.json`. 

## Testing

Run `npm test` to run the tests or `npm run watch-test` to run the tests with the watcher.

## Contribution Guidelines

Pull requests are welcome.

## License

Serverless Node TypeScript is free software distributed under the terms of the MIT license.
