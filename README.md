# Crud challenge API

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![](https://github.clouderx.com/api/badges/omarvides/crud-challenge-backend/status.svg?branch=adding-crud)](https://github.clouderx.com/omarvides/crud-challenge-backend)

## Description

This is a restful API to perform CRUD operations on a specific resource

## Running this API locally

### From source

1. Install docker on your computer ([Install from this link for Mac](https://hub.docker.com/editions/community/docker-ce-desktop-mac))

2. Create a file named docker-compose.yml somewhere in your computer with the content

```yaml
version: '3'
services:
  mongo:
    image: mongo:3.7
    environment:
      - MONGO_INITDB_ROOT_USERNAME=root
      - MONGO_INITDB_ROOT_PASSWORD=root
    ports:
      - "27017:27017
```

3. Run in the directory where the docker-compose.yml file is located

```
docker-compose up -d
```

4. Install nvm in your computer, this [Guide](https://nodesource.com/blog/installing-node-js-tutorial-using-nvm-on-mac-os-x-and-ubuntu/) can be used for both mac and linux
5. Clone this repository in a directory in your local computer
6. Inside the just created directory create a file named .env, with the content below

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_PORT=27017
DATABASE=admin
```

7. Move to the directory
8. Install node 8 with nvm

```
nvm install 8
```

9. Set nvm to use node 8

```
nvm use 8
```

10. Install dependencies by running

```
npm install
```

or if you prefer to use yarn and is already installed in your computer (node i -g yarn)

```
yarn install
```

11. Start the API by running

```
yarn start

```

Alternatively you can use nodemon to run this API, this is useful on development, if so, run:

```
npm install -g nodemon

nodemon server/index.js
```

Last step should start the API successfully and it should be ready te be used, you can use tools like [Postman](https://www.getpostman.com/downloads/) to test the API

### From Docker container

#### From registry

1. Install docker on your computer ([Install from this link for Mac](https://hub.docker.com/editions/community/docker-ce-desktop-mac))

2. Create a file named docker-compose.yml somewhere in your computer with the content

```yaml
version: '3'
services:
  mongo:
    image: mongo:3.7
    environment:
      - MONGO_INITDB_ROOT_USERNAME=root
      - MONGO_INITDB_ROOT_PASSWORD=root
    ports:
      - "27017:27017
```

3. Run in the directory where the docker-compose.yml file is located

```
docker-compose up -d
```

4. Once Docker is installed run

```bash
docker pull omarvides/crud-challenge:latest
```

5. Run the container with the following command (assuming there is no process using the port 3000 currently on your development environment)

```
docker run -d -ti -p 3000:3000 --name crud-api  -e DB_HOST=localhost -e DB_USER=root -e DB_PASSWORD=root -e DB_PORT=27017 -e DATABASE=admin omarvides/crud-challenge:latest
```

**To stop the container**

```
docker stop crud-api
docker rm -f crud-api
```

#### Building docker image locally

1. Install docker on your computer ([Install from this link for Mac](https://hub.docker.com/editions/community/docker-ce-desktop-mac))

2. Clone this repository in a directory in your local computer

3. Create a file named docker-compose.yml somewhere in your computer with the content

```yaml
version: '3'
services:
  mongo:
    image: mongo:3.7
    environment:
      - MONGO_INITDB_ROOT_USERNAME=root
      - MONGO_INITDB_ROOT_PASSWORD=root
    ports:
      - "27017:27017
```

4. Run in the directory where the docker-compose.yml file is located

```
docker-compose up -d
```

5. Once Docker is installed, the mongo service running and the repository cloned, inside the just cloned repository run

```bash
docker build -f docker/Dockerfile . -t crud-api
```

6. Run the container with the following command (assuming there is no process using the port 3000 currently on your development environment)

```
docker run -d -ti -p 3000:3000 --name crud-api  -e DB_HOST=localhost -e DB_USER=root -e DB_PASSWORD=root -e DB_PORT=27017 -e DATABASE=admin crud-challenge:latest
```

**To stop the container**

```
docker stop crud-api
docker rm -f crud-api
```

## Testing

To prevent broken commits, this repository uses node pre-commit module, it is configured to run

- Unit tests
- Linter validation using prettier

### Running Unit tests

Unit tests have no dependency other that the source code itself, and can be run with the command

```bash
npm test
```

or if you prefer to use yarn and is already installed in your computer (node i -g yarn)

```bash
yarn test
```

### Running acceptance tests

The Acceptance tests can be run in one of two ways

- Locally by using a mongodb (that could be running in localhost as a container)
- In a remote or local CI server, I'm using drone.io for this (a .drone.yml file can be found at the root directory of the repository)

they require following to exist

- A mongo db (could be a container)
- A .env file configuration to define how the API will find the mongo database

#### Running locally

Dependencies

- A Docker installation up and running

**Getting started**

I'm assuming you already have a Github Account and that you already have git installed in your computer, also I'm assuming any configuration needed
to clone from public repositories from github is also done and that you already have Node.JS version 8 installed or nvm installed.

Resources that could help you configuring your environment

- https://github.com/creationix/nvm (nvm to have multiple versions of node running on your computer)
- https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/ (to generate a SSH key for your github account)

**Guide**

1. Clone this repository to a location in your computer by running

```bash
git clone git@github.com:omarvides/crud-challenge-backend.git
```

2. Inside the just created directory create a file named .env, with the content below

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_PORT=27017
DATABASE=admin
```

we are using admin database here since we don't need to create a real database for the integration tests to run.

3. Create a file named docker-compose.yml in any place in the computer, preferably different that the directory where the API code was cloned
4. Add the code below to the docker-compose.yml file

```yaml
version: '3'
services:
  mongo:
    image: mongo:3.7
    environment:
      - MONGO_INITDB_ROOT_USERNAME=root
      - MONGO_INITDB_ROOT_PASSWORD=root
    ports:
      - '27017:27017'
```

5. Each time the acceptance tests will be run, first, execute the following command at the directory where the docker-compose.yml file is located,
   this will stop the mongo container and delete all data stored in the temporal volume it creates and will leave a clean environment for your tests to run

```
docker-compose down && docker-compose up -d
```

6. Inside the directory you cloned the API run

```bash
npm run acceptance
```

or if you prefer to use yarn and is already installed in your computer (node i -g yarn)

```bash
yarn run acceptance
```

This will run the acceptance tests locally using the mongodb database

#### Running in a Drone.io CI server

This repository is already configured with a .drone.yml file that contains all the steps to

- Run in a Drone.io server
- Start and stop the data services containers that it needs (mongodb in this case)
- Package the API into a docker container, it uses the docker/Dockerfile found in this repository

I'm currently using a Drone.io server I personally created using terraform, hosted on Digital Ocean, managed by terraform, it is located at

https://github.clouderx.com

and is currently open to be used by anyone, I provide it without any warranty as I destroy and recreate my infrastructure
anytime, the builds of the project can be found under

https://github.clouderx.com/omarvides/crud-challenge-backend

I'm keeping this builds public to allow anyone grading my solution of the challenge to be able to see the builds :).

### Acceptance tests

The objective of current acceptance tests is to describe the expected behavior of the API, under the following scenarios

**Implemented**

- The API should start in the default port 3000 when no PORT environment variable is provided.
- An valid account can be created.
- At least an account can be retrieved via GET /account after it was created.
- It should allow to look for a created account by Id.
- It should allow to update the email of an account after it is created.
- The API should allow to delete an existing account.
- The API should not allow to create an account with an email that is already registered.
- Non valid emails will return a 400 bad request when creating using POST: /account.
- A valid Id can be passed to the API and it should create the account succesfully.
- Should not allow to create an account with an id already registered.
- should not allow to create an account with an email already registered.
- Should not allow to update an account with an email that is already registered.

### Unit tests

- Validate that each component returns what's expected from them and behaves as expected
  - controllers
  - models
  - middlewares

## Deployment

This solution will be deployed in a kubernetes cluster, and the yaml definitions will be managed in this repository

https://github.com/omarvides/crud-k8s-deployment

## Changelog

To see what changed on each version please visit the [changelog document](CHANGELOG.md) which contains detailed information about what changed in each version
