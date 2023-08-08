// @see https://blog.jakelee.co.uk/converting-levels-into-xp-vice-versa/

// level = XP_MULTIPLIER * √XP
// xp = (level/XP_MULTIPLIER)^2

const XP_MULTIPLIER = 0.11;

/**
 * Converts an amount of XP to a level.
 * level = XP_MULTIPLIER * √XP
 */
export function xpToLevel(xp: number, rounded = false): number {
    const level = XP_MULTIPLIER * Math.sqrt(xp);
    return rounded ? Math.floor(level) : level;
}

/**
 * Converts a level to an amount of XP.
 * xp = (level/XP_MULTIPLIER)^2
 */
export function levelToXp(level: number): number {
    return (level / XP_MULTIPLIER) ** 2;
}
