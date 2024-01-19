import {KarmaDownvoteEvent} from '@/app/events/karma/KarmaDownvoteEvent';
import {KarmaRemoveDownvoteEvent} from '@/app/events/karma/KarmaRemoveDownvoteEvent';
import {KarmaRemoveUpvoteEvent} from '@/app/events/karma/KarmaRemoveUpvoteEvent';
import {KarmaUpvoteEvent} from '@/app/events/karma/KarmaUpvoteEvent';
import {KarmaMessageCreateEvent} from '@/app/events/karma/KarmaMessageCreateEvent';
import {ReceiveVoteEvent} from '@/app/events/poll/ReceiveVoteEvent';

export default [
    KarmaDownvoteEvent,
    KarmaRemoveDownvoteEvent,
    KarmaRemoveUpvoteEvent,
    KarmaUpvoteEvent,
    KarmaMessageCreateEvent,
    ReceiveVoteEvent,
];
