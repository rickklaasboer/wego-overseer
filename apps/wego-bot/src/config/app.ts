import {Commandable, Eventable, Jobable} from '@/types/util';
import BirthdayCommand from '@/app/commands/birthday/BirthdayCommand';
import KortebroekCommand from '@/app/commands/fun/KortebroekCommand';
import StufiCommand from '@/app/commands/fun/StufiCommand';
import LightshotCommand from '@/app/commands/misc/LightshotCommand';
import PingCommand from '@/app/commands/misc/PingCommand';
import MusicCommand from '@/app/commands/music/MusicCommand';
import EmojifyCommand from '@/app/commands/text/EmojifyCommand';
import MockifyCommand from '@/app/commands/text/MockifyCommand';
import UwuifyCommand from '@/app/commands/text/UwuifyCommand';
import DeepFryCommand from '@/app/commands/meme/DeepFryCommand';
import DrakeMemeCommand from '@/app/commands/meme/DrakeMemeCommand';
import JokeMemeCommand from '@/app/commands/meme/JokeMemeCommand';
import MarieKondoCommand from '@/app/commands/meme/MarieKondoCommand';
import MotivationalQuoteCommand from '@/app/commands/meme/MotivationalQuoteCommand';
import WhereMemeCommand from '@/app/commands/meme/WhereMemeCommand';
import WinnovationMemeCommand from '@/app/commands/meme/WinnovationMemeCommand';
import QualityContentLeaderboardCommand from '@/app/commands/misc/QualityContentLeaderboardCommand';
import KarmaCommand from '@/app/commands/karma/KarmaCommand';
import AdventOfCodeCommand from '@/app/commands/misc/AdventOfCodeCommand';
import EmbedFixEvent from '@/app/events/misc/EmbedFixEvent';
import QualityContentUpvoteEvent from '@/app/events/misc/QualityContentUpvoteEvent';
import TrashContentDownvoteEvent from '@/app/events/misc/TrashContentDownvoteEvent';
import KabelbaanNoobEvent from '@/app/events/meme/KabelbaanNoobEvent';
import YoloSwagEvent from '@/app/events/meme/YoloSwagEvent';
import CrazyEvent from '@/app/events/meme/CrazyEvent';
import IAmDadEvent from '@/app/events/meme/IAmDadEvent';
import BangerEvent from '@/app/events/meme/BangerEvent';
import MusicQueueButtonEvent from '@/app/events/music/MusicQueueButtonEvent';
import KarmaUpvoteEvent from '@/app/events/karma/KarmaUpvoteEvent';
import KarmaDownvoteEvent from '@/app/events/karma/KarmaDownvoteEvent';
import KarmaRemoveUpvoteEvent from '@/app/events/karma/KarmaRemoveUpvoteEvent';
import KarmaRemoveDownvoteEvent from '@/app/events/karma/KarmaRemoveDownvoteEvent';
import KarmaMessageCreateEvent from '@/app/events/karma/KarmaMessageCreateEvent';
import BirthdayJob from '@/app/jobs/birthday/BirthdayJob';
import YouTubeSQSPollJob from '@/app/jobs/youtube/YouTubeSQSPollJob';
import VersionCommand from '@/app/commands/misc/VersionCommand';
import ReceiveExperienceEvent from '@/app/events/experience/ReceiveExperienceEvent';
import LevelUpEvent from '@/app/events/experience/LevelUpEvent';
import ExperienceCommand from '@/app/commands/experience/ExperienceCommand';
import ConfirmResetExperienceEvent from '@/app/events/experience/ConfirmResetExperienceEvent';
import PollCommand from '@/app/commands/poll/PollCommand';
import ReceiveVoteEvent from '@/app/events/poll/ReceiveVoteEvent';
import SwearEvent from '@/app/events/misc/SwearEvent';

export default {
    version: process.env.APP_VERSION ?? 'Unknown',
    /**
     * All commands that will be handled by the bot
     */
    commands: new Map<string, Commandable>([
        ['ping', PingCommand],
        ['lightshot', LightshotCommand],
        ['emojify', EmojifyCommand],
        ['mockify', MockifyCommand],
        ['uwuify', UwuifyCommand],
        ['music', MusicCommand],
        ['birthday', BirthdayCommand],
        ['kanikeenkortebroekaan', KortebroekCommand],
        ['wanneerstufi', StufiCommand],
        ['deepfry', DeepFryCommand],
        ['drake', DrakeMemeCommand],
        ['joke', JokeMemeCommand],
        ['mariekondo', MarieKondoCommand],
        ['motivational', MotivationalQuoteCommand],
        ['where', WhereMemeCommand],
        ['winnovation', WinnovationMemeCommand],
        ['qcleaderboard', QualityContentLeaderboardCommand],
        ['karma', KarmaCommand],
        ['aoc', AdventOfCodeCommand],
        ['version', VersionCommand],
        ['experience', ExperienceCommand],
        ['poll', PollCommand],
    ]),

    /**
     * All events that will be handled by the bot
     */
    events: new Map<string, Eventable>([
        ['embedfix', EmbedFixEvent],
        ['qualitycontentupvote', QualityContentUpvoteEvent],
        ['trashcontentdownvote', TrashContentDownvoteEvent],
        ['kabelbaannoob', KabelbaanNoobEvent],
        ['yoloswag', YoloSwagEvent],
        ['crazy', CrazyEvent],
        ['iamdad', IAmDadEvent],
        ['banger', BangerEvent],
        ['musicqueuebutton', MusicQueueButtonEvent],
        ['karmaupvote', KarmaUpvoteEvent],
        ['karmadownvote', KarmaDownvoteEvent],
        ['karmaremoveuvpote', KarmaRemoveUpvoteEvent],
        ['karmaremovedownvote', KarmaRemoveDownvoteEvent],
        ['karmamessagecreate', KarmaMessageCreateEvent],
        ['receiveexperience', ReceiveExperienceEvent],
        ['levelup', LevelUpEvent],
        ['confirmresetexperience', ConfirmResetExperienceEvent],
        ['receivevote', ReceiveVoteEvent],
        ['swear', SwearEvent],
    ]),

    /**
     * All jobs that will be handled by the bot
     */
    jobs: new Map<string, Jobable>([
        ['birthday', BirthdayJob],
        ['youtubesqspoll', YouTubeSQSPollJob],
    ]),
};
