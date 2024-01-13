function italics(str: string): string {
    return `*${str}*`;
}

function bold(str: string): string {
    return `**${str}**`;
}

function strikethrough(str: string): string {
    return `~~${str}~~`;
}

function underline(str: string): string {
    return `__${str}__`;
}

function spoiler(str: string): string {
    return `||${str}||`;
}

function underlineItalics(str: string): string {
    return `__*${str}*__`;
}

function underlineBold(str: string): string {
    return `__**${str}**__`;
}

function underlineBoldItalics(str: string): string {
    return `__***${str}***__`;
}

function header(str: string, level: 1 | 2 | 3 = 1) {
    return `${'#'.repeat(level)} ${str}`;
}

function link(str: string, url: string) {
    return `[${str}](${url})`;
}

function listItem(str: string): string {
    return `- ${str}`;
}

function codeblock(str: string): string {
    return `\`\`\`\n${str}\n\`\`\``;
}

function code(str: string): string {
    return `\`${str}\``;
}

function quote(str: string): string {
    return `> ${str}`;
}

function quoteBlock(str: string): string {
    return `>>> ${str}`;
}

export default {
    italics,
    bold,
    strikethrough,
    underline,
    spoiler,
    underlineItalics,
    underlineBold,
    underlineBoldItalics,
    header,
    link,
    listItem,
    codeblock,
    code,
    quote,
    quoteBlock,
};
