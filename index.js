const botconfig = require('./botconfig.json');
const Discord = require('discord.js');
const bot = new Discord.Client();

bot.on("ready", async () => {
    console.log(`${bot.user.username} is now Active!`);
    let statuses = [`n-help | ${bot.guilds.size} servers`, `n-help | Version 2.1!`, `n-help | ${bot.users.size} users`];

setInterval(() => {

  let status = statuses[Math.floor(Math.random() * statuses.length)];
  bot.user.setActivity(status, { type: 'PLAYING' });
    
  }, 5000);
})

const fs = require('fs');
bot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
    if(err) console.log(err);

    const jsfile = files.filter(f => f.endsWith('.js'));
    if (jsfile.length <= 0) return console.log("[FS] Couldn't Find Commands!");

    jsfile.forEach((f, i) => {
        let pull = require(`./commands/${f}`);
        bot.commands.set(pull.config.name, Object.assign(pull, { 
            triggers: [ pull.config.name, ...(pull.config.aliases || []) ]
        }))
    })
});

bot.on("message", async message => {
    const prefix = botconfig.prefix;
    if(message.author.bot || message.channel.type === 'dm') return;
    if(!message.content.startsWith(prefix)) return;

    const [ cmd, ...args ] = message.content.slice(prefix.length).split(/ +/g) 

    let commandFile = bot.commands.find(c => c.triggers.includes(cmd.toLowerCase()));
    if(commandFile) commandFile.run(bot, message, args)
})

bot.login(botconfig.token);
