import {BangerEvent} from '@/events/meme/BangerEvent';
import {IAmDadEvent} from '@/events/meme/IAmDadEvent';
import {KabelbaanNoobEvent} from '@/events/meme/KabelbaanNoobEvent';
import {KarmaDownvoteEvent} from '@/events/karma/KarmaDownvoteEvent';
import {KarmaRemoveDownvoteEvent} from '@/events/karma/KarmaRemoveDownvoteEvent';
import {KarmaRemoveUpvoteEvent} from '@/events/karma/KarmaRemoveUpvoteEvent';
import {KarmaUpvoteEvent} from '@/events/karma/KarmaUpvoteEvent';
import {KarmaMessageCreateEvent} from '@/events/karma/KarmaMessageCreateEvent';
import {UpvoteEvent} from '@/events/UpvoteEvent';
import {ReceiveVoteEvent} from '@/events/poll/ReceiveVoteEvent';
import {MusicQueueButtonEvent} from '@/events/music/MusicQueueButtonEvent';
import {BiBaBussinEvent} from '@/events/meme/BiBaBussinEvent';
import {EmbedFixEvent} from '@/events/EmbedFixEvent';
import {YoloSwagEvent} from '@/events/meme/YoloSwagEvent';
import {CrazyEvent} from '@/events/meme/CrazyEvent';
import {ReceiveExperienceEvent} from '@/events/experience/ReceiveExperienceEvent';
import {LevelUpEvent} from '@/events/experience/LevelUpEvent';
import {ConfirmResetExperienceEvent} from '@/events/experience/ConfirmResetExperienceEvent';

export default [
    BangerEvent,
    IAmDadEvent,
    KabelbaanNoobEvent,
    KarmaDownvoteEvent,
    KarmaRemoveDownvoteEvent,
    KarmaRemoveUpvoteEvent,
    KarmaUpvoteEvent,
    KarmaMessageCreateEvent,
    UpvoteEvent,
    ReceiveVoteEvent,
    MusicQueueButtonEvent,
    BiBaBussinEvent,
    EmbedFixEvent,
    YoloSwagEvent,
    CrazyEvent,
    ReceiveExperienceEvent,
    LevelUpEvent,
    ConfirmResetExperienceEvent,
];
