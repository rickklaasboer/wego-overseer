<p align="center"><img src="https://www.rickklaasboer.nl/img/logo-black.svg" height="100px"/></p>

# wego-overseer

A Discord bot specially built for Wego. It uses Discord.js for interacting with the Discord API.

## Getting started

Below is a getting started guide for using the Wego Overseer.

Prerequisites:

-   Node 14.x
-   Yarn (v1.x).
-   Git
-   Docker (optional)

## Ok, and now?

First, clone the repository

```sh
git clone git@github.com:rickklaasboer/wego-overseer.git
```

Once this is done, cd into the newly created folder, install dependencies and add environment variables.

```sh
yarn # or npm install, if you prefer

cp .env.example .env
```

Fill in the required environment variables

```conf
# These can be found at the discord developer portal
DISCORD_APPLICATION_ID=""
DISCORD_TOKEN=""

# These can be found in docker.compose.yml
DB_CLIENT=
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_DATABASE=
```

Now, run your database migrations

```sh
yarn knex migrate:up
```

## Development

For development purposes, you can simply run the bos using one of the following commands

```sh
yarn dev

# Doesn't watch for changes
yarn dev:no-watch
```

You can optionally pipe output to bunyan for fancy log formatting.

Now go and create something beautiful!
