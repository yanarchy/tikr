# Tikr
[![Circle CI](https://circleci.com/gh/FatalBadgers/tikr/tree/dev.svg?style=svg)](https://circleci.com/gh/FatalBadgers/tikr/tree/dev)
[![Stories in Ready](https://badge.waffle.io/FatalBadgers/tikr.svg?label=ready&title=Ready)](http://waffle.io/FatalBadgers/tikr)

Tikr is an application that blends the best of GitHub with the best of Linked in. This is a expansion of a project initially concieved by Mike Staub, Bryan Venable, Travis Chapman, and Richard VanBreemen. You can find the original repo on GitHub [here](https://github.com/tikr/tikr).

## Development Team

* Project Owner [Tim Martin](https://github.com/tmartin1)
* Scrum Master [Scott Rice](https://github.com/scottrice10)
* Build Master [Kevin Primat](https://github.com/kxprim)
* UX Lead [Yan Fan](https://github.com/yanarchy)


## Table of Contents

1. [Team](#team)
1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Contributing](#contributing)

## Usage

```sh
grunt serve
```

Browser window will open at localhost:9000 with the app.

## Requirements

- Node
- Express
- Angular JS
- MongoDB
- Mongoose

## Development

### Installing Dependencies

From within the root directory:

```sh
sudo npm install -g bower
npm install
bower install
```

### Roadmap

View the project roadmap [here](https://github.com/FatalBadgers/tikr/wiki/Brainstorming)

### LinkedIn & GitHub

When running on localhost, please set environment variables in your shell before running grunt so the application will work with LinkedIn and GitHub authentication.

Keys and secret keys for LinkedIn and GitHub are provided in a private message.

```sh
export LINKEDIN_API_KEY=linkedin-api-key
export LINKEDIN_SECRET_KEY=linkedin-secret-key
export GITHUB_ID=github-id
export GITHUB_SECRET=github-secret
```

To check whether variables have been set, please use shell command 'echo':
```sh
echo $LINKEDIN_API_KEY
echo $GITHUB_ID
```
and so on.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
