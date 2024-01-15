import {KarmaDownvoteEvent} from '@/events/karma/KarmaDownvoteEvent';
import {KarmaRemoveDownvoteEvent} from '@/events/karma/KarmaRemoveDownvoteEvent';
import {KarmaRemoveUpvoteEvent} from '@/events/karma/KarmaRemoveUpvoteEvent';
import {KarmaUpvoteEvent} from '@/events/karma/KarmaUpvoteEvent';
import {KarmaMessageCreateEvent} from '@/events/karma/KarmaMessageCreateEvent';
import {ReceiveVoteEvent} from '@/events/poll/ReceiveVoteEvent';

export default [
    KarmaDownvoteEvent,
    KarmaRemoveDownvoteEvent,
    KarmaRemoveUpvoteEvent,
    KarmaUpvoteEvent,
    KarmaMessageCreateEvent,
    ReceiveVoteEvent,
];
