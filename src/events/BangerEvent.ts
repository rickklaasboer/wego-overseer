import Event from './Event';

export const BangerEvent = new Event<'messageCreate'>({
    name: 'messageCreate',
    run: async (message) => {
        // Terminate if user is a bot
        if (message.author.bot) return;

        const {content} = message;

        //split string into words
        const text = content.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase())
        const words = text.split(" ");
        const word = words.find((word) => word.endsWith("er"));

        // Check if there is an actual word
        if (word != null) {
            if (word.length >= 5){
            const msg = `${word}? I hardly know her!`;

            message.reply(msg);
            }
        } 
    },
});
