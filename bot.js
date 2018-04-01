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
	var msgContent = message.content;
	if(msgContent.substr(0, 4) == 'modB!'){
		if(msgContent.substr(5, msgContent.indexOf(' ') - 1) == 'addReqs'){
			if(message.member.roles.highestRole != currentGuild.roles.highestRole || message.member.nickname != 'warhammercas#1366'){
				message.channel.send('Must be admin to modify lfg syntax requirements.')
						.then(message => console.log(`Sent message: ${message.content}`))
						.catch(console.error);
				return;
			}
			switch(msgContent.substr(msgContent.indexOf(' ') + 1, msgContent.indexOf(' ', msgContent.indexOf(' ') + 1) - 1)) {
				case 'raid':
					raidReqs.push(msgContent.substr(msgContent.indexOf(' ', msgContent.indexOf(' ') + 1) + 1, msgContent.indexOf(' ', msgContent.indexOf(' ', msgContent.indexOf(' ') + 1) + 1) - 1));
					message.channel.send('Added requirement to raid: ' + msgContent.substr(msgContent.indexOf(' ', msgContent.indexOf(' ') + 1) + 1, msgContent.indexOf(' ', msgContent.indexOf(' ', msgContent.indexOf(' ') + 1) + 1) - 1))
						.then(message => console.log(`Sent message: ${message.content}`))
						.catch(console.error);
					break;
				case 'crucible':
					crucibleReqs.push(msgContent.substr(msgContent.indexOf(' ', msgContent.indexOf(' ') + 1) + 1, msgContent.indexOf(' ', msgContent.indexOf(' ', msgContent.indexOf(' ') + 1) + 1) - 1));
					message.channel.send('Added requirement to crucible: ' + msgContent.substr(msgContent.indexOf(' ', msgContent.indexOf(' ') + 1) + 1, msgContent.indexOf(' ', msgContent.indexOf(' ', msgContent.indexOf(' ') + 1) + 1) - 1))
						.then(message => console.log(`Sent message: ${message.content}`))
						.catch(console.error);
					break;
				case 'pve':
					pveReqs.push(msgContent.substr(msgContent.indexOf(' ', msgContent.indexOf(' ') + 1) + 1, msgContent.indexOf(' ', msgContent.indexOf(' ', msgContent.indexOf(' ') + 1) + 1) - 1));
					message.channel.send('Added requirement to pve: ' + msgContent.substr(msgContent.indexOf(' ', msgContent.indexOf(' ') + 1) + 1, msgContent.indexOf(' ', msgContent.indexOf(' ', msgContent.indexOf(' ') + 1) + 1) - 1))
						.then(message => console.log(`Sent message: ${message.content}`))
						.catch(console.error);
					break;
				case 'all':
					raidReqs.push(msgContent.substr(msgContent.indexOf(' ', msgContent.indexOf(' ') + 1) + 1, msgContent.indexOf(' ', msgContent.indexOf(' ', msgContent.indexOf(' ') + 1) + 1) - 1));
					crucibleReqs.push(msgContent.substr(msgContent.indexOf(' ', msgContent.indexOf(' ') + 1) + 1, msgContent.indexOf(' ', msgContent.indexOf(' ', msgContent.indexOf(' ') + 1) + 1) - 1));
					pveReqs.push(msgContent.substr(msgContent.indexOf(' ', msgContent.indexOf(' ') + 1) + 1, msgContent.indexOf(' ', msgContent.indexOf(' ', msgContent.indexOf(' ') + 1) + 1) - 1));
					message.channel.send('Added requirement to all: ' + msgContent.substr(msgContent.indexOf(' ', msgContent.indexOf(' ') + 1) + 1, msgContent.indexOf(' ', msgContent.indexOf(' ', msgContent.indexOf(' ') + 1) + 1) - 1))
						.then(message => console.log(`Sent message: ${message.content}`))
						.catch(console.error);
					break;
				default:
					message.channel.send('Usage: modB!addreqs raid/crucible/pve/all <requirement>. "All" will set this requirement to all lfg chats.')
						.then(message => console.log(`Sent message: ${message.content}`))
						.catch(console.error);
			}
		}
	}
	if(message.channel == raidChannel){
		
	}
});

client.login(process.env.BOT_TOKEN);
