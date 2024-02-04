# Deployment

Below is a quick getting started guide to deploying Wego Overseer.

## Deploying with Docker

Example command for deploying Wego Overseer using Docker:

```sh
docker pull ghcr.io/rickklaasboer/wego-overseer:master

docker run \
-e DISCORD_APPLICATION_ID="" \
-e DISCORD_TOKEN="" \
-e DB_CLIENT="" \
-e DB_HOST="" \
-e DB_USER="" \
-e DB_PASSWORD="" \
-e DB_DATABASE="" \
-e GIPHY_API_KEY="" \
-e QCC_EMOJI_NAME="" \
-e QCC_MIN_EMOJI_COUNT="" \
-e QCC_CHANNEL_ID="" \
-e AOC_SESSION_COOKIE="" \
-e AOC_LEADERBOARD_URL="" \
-d ghcr.io/rickklaasboer/wego-overseer:master
```

Or using `docker-compose`:

```yml
version: '3.3'
services:
    wego_overseer:
        restart: unless-stopped
        environment:
            # Docker will automagically pull these from .env
            DISCORD_APPLICATION_ID: ${DISCORD_APPLICATION_ID}
            DISCORD_TOKEN: ${DISCORD_TOKEN}
            DB_CLIENT: ${DB_CLIENT}
            DB_HOST: ${DB_HOST}
            DB_USER: ${DB_USER}
            DB_PASSWORD: ${DB_PASSWORD}
            DB_DATABASE: ${DB_DATABASE}
            GIPHY_API_KEY: ${GIPHY_API_KEY}
            QCC_EMOJI_NAME: ${QCC_EMOJI_NAME}
            QCC_MIN_EMOJI_COUNT: ${QCC_MIN_EMOJI_COUNT}
            QCC_CHANNEL_ID: ${QCC_CHANNEL_ID}
            AOC_SESSION_COOKIE: ${AOC_SESSION_COOKIE}
            AOC_LEADERBOARD_URL: ${AOC_LEADERBOARD_URL}
        image: ghcr.io/rickklaasboer/wego-overseer:master
```

## Deploying without Docker

Don't.
