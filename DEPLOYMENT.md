# Deployment

Below is a quick getting started guide to deploying Wego Overseer.

## Deploying with Docker

Example command for deploying Wego Overseer using Docker.

```sh
docker run \
-e DISCORD_APPLICATION_ID="" \
-e DISCORD_TOKEN="" \
-e DB_CLIENT="mysql2" \
-e DB_HOST="localhost" \
-e DB_USER="root" \
-e DB_PASSWORD="testing" \
-e DB_DATABASE="local" \
-e GIPHY_API_KEY="" \
-e AWS_ACCESS_KEY_ID="" \
-e AWS_SECRET_ACCESS_KEY="" \
-e AOC_SESSION_COOKIE="" \
-e AOC_LEADERBOARD_URL="" \
-d ghcr.io/rickklaasboer/wego-overseer
```

Or using `docker-compose`

```yml
version: '3.3'
services:
    wego_overseer:
        retart: unless-stopped
        environment:
            - DISCORD_APPLICATION_ID=
            - DISCORD_TOKEN=
            - DB_CLIENT=mysql2
            - DB_HOST=localhost
            - DB_USER=root
            - DB_PASSWORD=testing
            - DB_DATABASE=local
            - GIPHY_API_KEY=
            - AWS_ACCESS_KEY_ID=
            - AWS_SECRET_ACCESS_KEY=
            - AOC_SESSION_COOKIE=
            - AOC_LEADERBOARD_URL=
        image: ghcr.io/rickklaasboer/wego-overseer
```

## Deploying without Docker

Don't.
