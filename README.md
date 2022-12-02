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
-   Docker (and docker-compose)

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
# Provided values will be correct for a local database using docker
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=testing
DB_DATABASE=local

# Only needed if you'd like to test the spooktober command
# can be left blank if not needed
GIPHY_API_KEY=

# Emoji name, defaults to :upvote:
QCC_EMOJI_NAME=
# Number of upvotes required, defaults to 5
QCC_MIN_EMOJI_COUNT=
# Required, use a channel that the bot can access
QCC_CHANNEL_ID=

# Copy cookie from browser console
AOC_SESSION_COOKIE=
# The fully qualified (private) leaderboard url
AOC_LEADERBOARD_URL=
```

Now, run your database migrations (please refer to **'Setting up the development environment'** first for setting up the database)

```sh
yarn knex migrate:up
```

## Development

### Setting up the development environment

To use the development environment provided, you'll be expected to have a working installation of Docker and docker-compose. This project uses docker-compose to create a ready-to-use database for you. To spin up the docker containers, use the below command

```sh
docker-compose up -d # -d means detached
```

At first launch this may take a while, don't worry, though! Docker is just pulling the required image(s).

If you for whatever reason need to reset this image, the below command(s) will do just that.

```sh
docker-compose down -v # also delete volume(s)
docker-compose up -d # spin containers up again
```

For development purposes, you can simply run the bot using one of the following commands

```sh
yarn dev

# Doesn't watch for changes
yarn dev:no-watch
```

Ooptionally, you can pipe log output to bunyan for fancy log formatting.

```sh
yarn dev:no-watch | yarn bunyan
```

## Useful information

This project uses Objection and Knex for its database management. Please refer to the proper documentation for usage guides.

-   [Objection docs](https://vincit.github.io/objection.js/guide/)
-   [Knex docs](https://knexjs.org/guide/)

or more specific

**Objection:**

-   [Creating a model](https://vincit.github.io/objection.js/guide/models.html#examples)
-   [Querying a model](https://vincit.github.io/objection.js/guide/query-examples.html#basic-queries)
-   [Defining relationships](https://vincit.github.io/objection.js/guide/relations.html#examples)
-   [Querying relationships](https://vincit.github.io/objection.js/guide/query-examples.html#relation-queries)
-   [Query hooks](https://vincit.github.io/objection.js/guide/hooks.html)

**Knex:**

-   [Migrations](https://knexjs.org/guide/migrations.html)
-   [Migrations CLI](https://knexjs.org/guide/migrations.html#migration-cli)
-   [Knex query builder](https://knexjs.org/guide/query-builder.html)
    -   Works wonders if objection is unable to create a complex query without a lot of overhead

You probably don't need knex documentation as much, since objection handles most things apart from migrations.

**DiscordJS:**

-   [DiscordJS docs](https://discord.js.org/#/docs/discord.js/main/general/welcome)
-   [DiscordJS guide](https://discordjs.guide/#before-you-begin)

**Discord:**

-   [Discord Developer Portal (docs)](https://discord.com/developers/docs/intro)
-   [Discord Applications](https://discord.com/developers/applications)
-   [Discord Permissions Calculator](https://discordapi.com/permissions.html)

**Image manipulation (Jimp):**

-   [Jimp](https://github.com/oliver-moran/jimp)

## Examples

### Creating a command.

First, create a new file in `src/commands`. This should export an instance of `Command()` with an (async) run method. Please refer to the [DiscordJS docs](https://discord.js.org/#/docs/discord.js/main/general/welcome) for available actions on the `interactionCreate` event. Commands should be PascalCase.

Let's say you want to create a command that says "Hello \<username\>!" when they use the `/greet` command. This should look something like this:

```ts
import {ChatInputCommandInteraction, CacheType} from 'discord.js';
import Command from '@/commands/Command';

export const GreetCommand = new Command<ChatInputCommandInteraction<CacheType>>(
    {
        name: 'greet',
        description: 'says hello to user',
        run: async (interaction) => {
            await interaction.reply(`Hello ${interaction.user.username}!`);
        },
    },
);
```

As you can see, this simply exports a new instance of `Command()`, which automagically handles the run function when it's called. Make sure you register your command in `src/index.ts`.

```ts
bot = new Bot({
    applicationId: DISCORD_APPLICATION_ID,
    token: DISCORD_TOKEN,
    commands: [
        // ...
        GreetCommand,
    ],
    events: [
        // ...
    ],
});
```

### Creating an event

First, create a new event in `src/events`. Please refer to the [DiscordJS docs](https://discord.js.org/#/docs/discord.js/main/general/welcome) for available events. For this example, we'll use the `ready` event. This event is called when our bot reaches the ready state. Events should also be in PascalCase.

Now, this should look something like this

```ts
import Logger from '@/telemetry/logger';
import Event from '../Event';

const logger = new Logger('wego-overseer:BotReadyEvent');

export const BotReadyEvent = new Event<'ready'>({
    name: 'ready',
    run: async (client) => {
        try {
            logger.info('Client is now ready!');
        } catch (err) {
            logger.fatal('Unable to handle BotReadyEvent', err);
        }
    },
});
```

This event simply outputs `'Client is now ready!'` to the console when our bot is ready, but this should be a sufficient example for creating events. Please note that this event has it's own logger, this is useful for outputting (scoped) debug messages to the console.

Please don't forget to register your event in `src/index.ts`.

```ts
bot = new Bot({
    applicationId: DISCORD_APPLICATION_ID,
    token: DISCORD_TOKEN,
    commands: [
        // ...
    ],
    events: [
        // ...,
        BotReadyEvent,
    ],
});
```

## Contributing

Please refer to [`CONTRIBUTING.md`](https://github.com/rickklaasboer/wego-overseer/blob/master/CONTRIBUTING.md).
