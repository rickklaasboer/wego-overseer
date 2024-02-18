import {injectable} from 'tsyringe';

@injectable()
export default class ExperienceService {
    // Magic value
    private readonly multiplier = 0.11;

    /**
     * Converts an amount of XP to a level.
     * level = multiplier * √XP
     */
    public xpToLevel(xp: number, rounded = false): number {
        const level = this.multiplier * Math.sqrt(xp);
        return rounded ? Math.floor(level) : level;
    }

    /**
     * Converts a level to an amount of XP.
     * xp = (level/multiplier)^2
     */
    public levelToXp(level: number): number {
        return (level / this.multiplier) ** 2;
    }

    /**
     * Get amount of XP needed to reach the next level.
     */
    public nextLevelXp(xp: number): number {
        const currentLevel = this.xpToLevel(xp, true);
        return Math.floor(this.levelToXp(currentLevel + 1) - xp);
    }
}
