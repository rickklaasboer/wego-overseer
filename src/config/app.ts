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

export default {
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
        ['kortebroek', KortebroekCommand],
        ['stufi', StufiCommand],
        ['deepfry', DeepFryCommand],
        ['drake', DrakeMemeCommand],
        ['joke', JokeMemeCommand],
        ['mariekondo', MarieKondoCommand],
        ['motivational', MotivationalQuoteCommand],
        ['where', WhereMemeCommand],
        ['winnovation', WinnovationMemeCommand],
        ['ccleaderboard', QualityContentLeaderboardCommand],
        ['karma', KarmaCommand],
        ['aoc', AdventOfCodeCommand],
    ]),

    /**
     * All events that will be handled by the bot
     */
    events: new Map<string, Eventable>([
        ['embedfix', EmbedFixEvent],
        ['qualitycontentupvote', QualityContentUpvoteEvent],
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
    ]),

    /**
     * All jobs that will be handled by the bot
     */
    jobs: new Map<string, Jobable>([]),
};
