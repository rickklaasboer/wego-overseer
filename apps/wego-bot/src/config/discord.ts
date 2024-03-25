import {getEnvString} from '@/util/misc/environment';

export default {
    applicationId: getEnvString('DISCORD_APPLICATION_ID', ''),
    token: getEnvString('DISCORD_TOKEN', ''),
};
