<p align="center"><img src="https://wego.gg/img/logo.png" height="100px"/></p>

# wego-overseer

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

A Discord bot specially built for Wego. It uses Discord.js for interacting with the Discord API.

## Getting started

Below is a getting started guide for using the Wego Overseer.

Prerequisites:

-   Node 16.x
-   Yarn (v1.x).
-   Git
-   Docker (optional)

## Ok, now what?

First, clone the repository

```sh
git clone git@github.com:rickklaasboer/wego-overseer.git
```

Once this is done, cd into the newly created folder, install dependencies and add environment variables.

```sh
yarn

cp .env.example .env
```

Fill in the required environment variables

```conf
# These can be found at the discord developer portal
DISCORD_APPLICATION_ID=
DISCORD_TOKEN=

# should always be mysql2, since that's the only
# installed driver
DB_CLIENT=mysql2
# These can be found in docker-compose.yml
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=testing
DB_DATABASE=local

# Only needed if you'd like to test the spooktober command
# can be left blank if not needed
GIPHY_API_KEY=
```

Now, run your database migrations

```sh
yarn knex migrate:up
```

## Development

For development purposes, you can simply run the bot using one of the following commands

```sh
yarn dev

# Doesn't watch for changes
yarn dev:no-watch
```

You can optionally pipe output to bunyan for fancy log formatting.

```sh
yarn dev:no-watch | yarn bunyan
```

That's it! Now go and create something beautiful.
