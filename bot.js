/*

To Do:
1. clean up random modifier code (the randomness of it not working for some reason (ie r2d20+r2d20 gives r2d20+2 instead of a random number))
done

2. multiple modifiers
done

3. Multiple temp nums and multiple dice rolls
4. clean up overall code
5. automatic webhook creation
6. rig it lol

Side projects:
1. coinflip

Maybe:
1. music?
2. characters

*/
const Discord = require("discord.js");
const config = require("./config.json");
const package = require("./package.json");
const roll = require("./rollDice.js");
const client = new Discord.Client();

client.on("ready", function() {
  console.log("initializing...");
});

client.on("message", (message) => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return undefined;

  let isBotOwner = message.author.id == "InsomniacCheese#0948";

  switch (true) {
    case stringIncludes(message.content, "changeprefix"):
      let v = message.content.indexOf("x ");
      let r = message.content.substr(v+2);
      config.prefix = r;
      message.channel.send(config.prefix + " is the new prefix for the server! *keep in mind the prefix may change back to the default if the bot restarts for updates.");
      break;
    case stringIncludes(message.content, "ping"):
      const pingEmbed = new Discord.MessageEmbed()
        .setColor('#A9EED1')
        .setTitle("Pong!")
        .addFields(
          { name: 'System Latency', value: (Date.now() - message.createdTimestamp) + " ms"},
          { name: 'API Latency', value: Math.round(client.ws.ping) + " ms"},
        )
        .setDescription("Helo <@" + message.author.id + ">, ping pong dingalong")
      message.channel.send(pingEmbed);
      break;
    case stringIncludes(message.content, "help"):
      const helpembed = new Discord.MessageEmbed()
        .setColor('#00008B')
        .setTitle("Help Menu")
        .addFields(
          { name: 'prefix + rxdy +/- z', value: "This allows you to roll x amount of y type dice (eg d20 or d6). The +/- z is optional, but it will add z to every result you get"},
          { name: 'prefix + help', value: "Brings this menu up."},
          { name: 'prefix + updatelogs', value: "Brings the current version, features added, and next version feature plans."},
          { name: 'prefix + ping', value: "Shows if the bot is working or not, and allows you to infer the delay."},
          { name: 'prefix + mrxdy +/- rxdy', value: "Roll x amounts of y type dice, but with dice modifier. (don't use for now, not working for some reason)"},
          { name: 'prefix + changeprefix *new prefix*', value: "change the prefix to a new prefix."},
        )
        .setDescription("Helo <@" + message.author.id + ">, your help menu is here")
      message.channel.send(helpembed);
      break;
    case stringIncludes(message.content, "r") && stringIncludes(message.content, "d"):

      value = roll.rollAnyNumOfDice(message.content);
      nums = roll.diceCheckNumAndAmnt2(message.content);
      if (Array.isArray(value)) {
      const lotsEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(nums[0]+' d'+nums[1]+' Rolled By ' + message.author.username)
        .addFields(
          { name: 'Results', value: value[0]},
        )
        .setDescription("Helo <@" + message.author.id + ">, your dice roll is here")
      let p;
      for (let y = 1, len = value.length; y < len; y++){
        p = aESWNE(message.author.username, value[y], nums[0], nums[1]);
      }
      const webhookClient = new Discord.WebhookClient("869121336637816883", "-d8T5yW9A38dVwXs5kx5SOw5LDbvH1jzj6iXbFAZJPKT6faJVFzbhgX-uhnSRy3Yh3wQ");
      webhookClient.send('Here You go!', {
	       username: 'Dice Roll Bot',
	       avatarURL: 'https://i.imgur.com/wSTFkRM.png',
	       embeds: [lotsEmbed, p],
      });

      } else {
        message.channel.send(embedSomething(message.author.username, value, nums[0], nums[1], message.author.id));
      }
      break;
    case stringIncludes(message.content, "updatelogs"):
      const updatelogs = new Discord.MessageEmbed()
        .setColor('#3CD184')
        .setTitle('Current Version: ' + package.version)
        .addFields(
          { name: 'Version 1.0', value: "Single Dice roll, multi dice roll, modifier, help menu, ping, update logs, "},
          { name: 'Version 1.1', value: "Bug fixes + text updates"},
          { name: 'Version 1.2', value: "Cleaned up the UI + Cleaner Code"},
          { name: 'Version 1.3', value: "New Feature: can add/minus dice modifier (glitched atm, not working)"},
          { name: 'Version 1.4', value: "Bug fixes, a bunch of QOL changes (change prefix, updates to update logs, and updates to help)"},
        )
        .setDescription("Helo <@" + message.author.id + ">, the update logs are here")
        message.channel.send(updatelogs);
      break;
    default:
      message.channel.send("Sorry, that isn't a function this bot has!");
      break;
  }
});

function stringIncludes(text, term) {
  return text.includes(term);
}


function embedSomething(name, j, amnt, type, descName){
  const exampleEmbed = new Discord.MessageEmbed()
  	.setColor('#0099ff')
    .setDescription("Helo <@" + descName + ">, your dice roll is here")
  	.setTitle(amnt+' d'+type+' Rolled By ' + name)
  	.addFields(
  		{ name: 'Results', value: j},
  	)
  	.setTimestamp()
  	.setFooter('Imagine Rolling Dice', 'https://ucarecdn.com/41783f50-5c6b-4655-8f30-127c11542914/-/format/auto/-/preview/3000x3000/-/quality/lighter/');
  return exampleEmbed;
}

function aESWNE(name, j, amnt, type) {

  const lotsEmbedCont = new Discord.MessageEmbed()
  	.setColor('#0099ff')
  	.setTitle(amnt+' d'+type+' Rolled By ' +  + " Cont.")
  	.addFields(
  		{ name: 'Results', value: j},
  	)

  return lotsEmbedCont;
}
client.login(config.token);
