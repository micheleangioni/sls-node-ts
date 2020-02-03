# Serverless Node TypeScript

[![Build Status](https://api.travis-ci.org/micheleangioni/sls-node-ts.svg?branch=master)](https://travis-ci.org/micheleangioni/sls-node-ts)

> Serverless Node TypeScript is a starter kit to write serverless applications 
> in Node.js and TypeScript using the Serverless Framework.
> It comes with several configurations set up out of the box, such as MongoDB, a GraphQL API server, a REST endpoint and Domain Events via AWS SNS.

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
- Domain Events via AWS SNS
- [Offline bundling](https://github.com/dherault/serverless-offline) for local development
- Testing through Jest

## Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Running the Application locally](#running)
- [Environment variables](#env)
- [Deployment](#deployment)
- [Features](#features)
  - [Authentication](#authentication)
  - [Apollo Server (GraphQL)](#apollo)
  - [CORS](#cors)
  - [Domain Events](#devents)
  - [Error Messages](#errmessages)
  - [MongoDB](#mongodb)
  - [Secrets](#secrets)
- [Testing](#testing)
- [Contribution Guidelines](#guidelines)
- [License](#license)

## <a name="requirements"></a>Requirements

- Node.js 12.x
- NPM / Yarn
- An AWS Account with proper permissions

## <a name="installation"></a>Installation

First, edit the application name in the `name` field of the `package.json` file.

Then run `npm install` or `yarn install`.

## <a name="running"></a>Running the Application locally

To run the application locally, just run `npm run offline`.

## <a name="env"></a>Environment variables

 - `NODE_ENV` : Set the environment name, not used in the code
 - `ENV` : Set the environment name, this is the variable used throughout the code and set via the Serverless CLI
 - `MONGO_URI` : Set the complete MongoDB connection string. Default `mongodb://localhost:27017/sls-node-ts-<ENV>}`, where `<ENV>` in the `ENV` env variable value
 - `AWS_REGION` : AWS region, default `eu-west-1`
 - `SEND_DOMAIN_EVENTS` : if set to `true`, the application will effectively emit the Domain Events of the related Aggregate to its AWS SNS topic. Default is `undefined`
 - `SNS_ENDPOINT` : in non `staging` or `production` environments, you can send Domain Events to a local implementation of AWS SNS. Default is `http://localhost:4575`, i.e. the local url for the [Localstack implementation](https://github.com/localstack/localstack)

## <a name="deployment"></a>Deployment

The deployment is handled by the Serverless Framework.

In order to deploy to a `staging` environment, run `npm run deploy-staging`.
Instead, to deploy to a `production` environment, run `npm run deploy-production`.

To remove the deployed environment, run `npm run remove-staging` or `npm run remove-production`.

## <a name="features"></a>Features

### <a name="authentication"></a>Authentication

Authentication is handled via [Lambda Authorizers](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html),
easily configurable [via Serverless Framework](https://serverless.com/framework/docs/providers/aws/events/apigateway#http-endpoints-with-custom-authorizers).

In practice, before starting our Lambda function, the Lambda Authorizer in `src/api/authorizer/index.ts` will run.
Inside it, custom code can be added, for example, to check or introspect an input Authorization Token.

#### <a name="apollo">Apollo Server (GraphQL)

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
  createUser(userData: {
      email: "test6@test.com"
      username: "Test6"
  }) {
    _id
    createdAt
    email
    username
  }
}
```

#### <a name="cors">CORS

CORS is setup out of the box, allowing access from all websites, by setting the `Access-Control-Allow-Origin` header
equal to `'*'`.

In order to customise the CORS response, check the [Middy CORS middleware](https://github.com/middyjs/middy/blob/master/docs/middlewares.md#cors).
and the `handler.ts` file.

Furthermore, in order to properly [use CORS with custom authorizers](https://serverless.com/blog/cors-api-gateway-survival-guide/),
their headers must be configured manually in the `serverless.yml` file.

### <a name="devents">Domain Events

Serverless Node TypeScript is configured to emit Domain Events to AWS SNS out of the box.
In order to enable this feature, set the `SEND_DOMAIN_EVENTS` environment variable to `true` (default is `undefined`).

Following DDD, each Aggregate must emit its events to its own topic. 
Hence the `User` aggregate has its own topic configured in the `src/config/index.ts` file.

The `serverless.yml` file takes care about

1. Creating the SNS topic, under `resources`;
2. Giving to the Lambdas the permissions to publish events to the topic, in the `iamRoleStatements` section.

In order to develop locally, the other environments other than `staging` and `development` the events will be send 
to a local implementation of AWS SNS, running on `http://localhost:4575`. This is the default URL of [Localstack](https://github.com/localstack/localstack).

The local endpoint can be customized via the `SNS_ENDPOINT` environment variable.

For topic naming conventions, take a look at [this article](https://riccomini.name/how-paint-bike-shed-kafka-topic-naming-conventions).  

#### <a name="errmessages">Error Messages

All error messages have the following format:

```
{
    "code": (string),
    "error": (string),
    "hasError": 1,
    "statusCode":  (number)
}
```

### <a name="mongodb">MongoDB

MongoDB is the chosen default database. The connection string can be configured by setting the `MONGO_URI` env variable.

The default connection string is `mongodb://localhost:27017/sls-node-ts-<ENV>`, where `<ENV>` in the `ENV` env variable.
In order to change it, head to the `src/infrastructure/mongo/index.ts` file.

#### <a name="secrets">Secrets

In the `staging` and `production` environments, secrets are fetched from AWS Secrets Manager and saved into local environment variables.

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

## <a name="testing"></a>Testing

Run `npm test` to run the tests or `npm run watch-test` to run the tests with the watcher.

## <a name="guidelines"></a>Contribution Guidelines

Pull requests are welcome.

## <a name="license"></a>License

Serverless Node TypeScript is free software distributed under the terms of the MIT license.
