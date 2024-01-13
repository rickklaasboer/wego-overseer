import {Commandable, Eventable, Jobable} from '@/types/util';
import BirthdayCommand from '@/commands/birthday/BirthdayCommand';
import KortebroekCommand from '@/commands/fun/KortebroekCommand';
import StufiCommand from '@/commands/fun/StufiCommand';
import LightshotCommand from '@/commands/misc/LightshotCommand';
import PingCommand from '@/commands/misc/PingCommand';
import MusicCommand from '@/commands/music/MusicCommand';
import EmojifyCommand from '@/commands/text/EmojifyCommand';
import MockifyCommand from '@/commands/text/MockifyCommand';
import UwuifyCommand from '@/commands/text/UwuifyCommand';
import DeepFryCommand from '@/commands/meme/DeepFryCommand';
import DrakeMemeCommand from '@/commands/meme/DrakeMemeCommand';
import JokeMemeCommand from '@/commands/meme/JokeMemeCommand';
import MarieKondoCommand from '@/commands/meme/MarieKondoCommand';
import MotivationalQuoteCommand from '@/commands/meme/MotivationalQuoteCommand';
import WhereMemeCommand from '@/commands/meme/WhereMemeCommand';
import WinnovationMemeCommand from '@/commands/meme/WinnovationMemeCommand';
import QualityContentLeaderboardCommand from '@/commands/misc/QualityContentLeaderboardCommand';
import KarmaCommand from '@/commands/karma/KarmaCommand';

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
    ]),

    /**
     * All events that will be handled by the bot
     */
    events: new Map<string, Eventable>([]),

    /**
     * All jobs that will be handled by the bot
     */
    jobs: new Map<string, Jobable>([]),
};
