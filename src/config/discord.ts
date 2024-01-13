import {getEnvString} from '@/util/environment';

export default {
    applicationId: getEnvString('DISCORD_APPLICATION_ID', ''),
    token: getEnvString('DISCORD_TOKEN', ''),
};
