import Event from './Event';

export const IAmDadEvent = new Event<'messageCreate'>({
    name: 'messageCreate',
    run: async (message) => {
        // Terminate if user is a bot
        if (message.author.bot) return;

        const {content} = message;

        // Check if string includes 'ik ben' or 'i am'
        if (content.toLowerCase().includes('ik ben')) {
            const part = content.toLowerCase().split('ik ben')[1].trim();
            const msg = `Hoi ${part}, ik ben Wego Overseer!`;

            message.reply(msg);
        } else if (content.toLowerCase().includes('i am')) {
            const part = content.toLowerCase().split('i am')[1].trim();
            const msg = `Hi ${part}, I am Wego Overseer!`;

            message.reply(msg);
        }
    },
});
