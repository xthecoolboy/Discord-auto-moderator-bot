const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();

var raidChannel;
var crucibleChannel;
var pveChannel;
var questionsChannel;

client.on('ready', () => {
	console.log("I am ready!");
});

client.on('message', message => {
	
});

client.login(process.env.BOT_TOKEN);
