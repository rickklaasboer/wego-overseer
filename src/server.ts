import {app} from '@/webhooks/youtube.ts';

async function run() {
    await app.listen({port: 3000});
}

run();
