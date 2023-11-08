const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login('MTE3MTY4ODM4MjIzNDEyMDIyMw.GvzS2v.9sYpmPHtC5XaCd8VT09TOsj5L81IyFmuFz9Lnc');