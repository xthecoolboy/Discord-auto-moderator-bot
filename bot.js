const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();

var raidChannel;
var crucibleChannel;
var pveChannel;
var questionsChannel;

var currentGuild;
var foundGuild = false;

var hereRequired = false;
var orderMatters = false;
var allowExtra = true;

var raidReqs, crucibleReqs, pveReqs = [];

client.on('ready', () => {
	console.log("I am ready!");
});

client.on('message', message => {
	if(!foundGuild){
		currentGuild = message.guild;
		var foundRaid, foundCrucible, foundPvE, foundQuestions = false;
		var guildChannels = currentGuild.channels.toArray();
		var i = 0;
		while(!foundRaid){
			if(guildChannels[i].name == 'lfg-raid'){
				foundRaid = true;
				i = 0;
				raidChannel = guildChannels[i];
			}else{
				i++;
			}
		}
		while(!foundCrucible){
			if(guildChannels[i].name == 'lfg-crucible'){
				foundCrucible = true;
				i = 0;
				crucibleChannel = guildChannels[i];
			}else{
				i++;
			}
		}
		while(!foundPvE){
			if(guildChannels[i].name == 'lfg-pve'){
				foundPvE = true;
				i = 0;
				pveChannel = guildChannels[i];
			}else{
				i++;
			}
		}
		while(!foundQuestions){
			if(guildChannels[i].name == 'lfg-questions'){
				foundQuestions = true;
				i = 0;
				questionsChannel = guildChannels[i];
			}else{
				i++;
			}
		}
	}
	
	//############################################
	//----------------COMMANDS--------------------
	//############################################
	if(message.content.substr(0, 4) == 'modB!'){
		if(message.content.substr(5, message.content.indexOf(' ') - 1) == 'addReqs'){
			
		}
	}
	if(message.channel == raidChannel){
		
	}
});

client.login(process.env.BOT_TOKEN);
