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
		var guildChannels = currentGuild.channels.array();
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
	console.log(message.content.substr(0, 5));
	console.log(message.content.substr(5, message.content.indexOf(" ") - 5));
	if(message.content.substr(0, 5) == 'modB!'){
		if(message.content.substr(5, message.content.indexOf(" ") - 5) == 'addReqs'){
			if(!message.member.roles.find("name", "LEADERSHIP") && message.member.nickname != 'warhammercas#1366'){
				message.channel.send('Must be admin to modify lfg syntax requirements.')
						.then(message => console.log(`Sent message: ${message.content}`))
						.catch(console.error);
				return;
			}
			var requirement = message.content.split(" ").pop();
			//var requirement = message.content.substr(message.content.indexOf(' ', message.content.indexOf(' ') + 1) - message.content.indexOf(' ') - 1, message.content.indexOf(' ', message.content.indexOf(' ', message.content.indexOf(' ') + 1) - message.content.indexOf(' ') - 1) - message.content.indexOf(' ', message.content.indexOf(' ') + 1) - message.content.indexOf(' ') - 1);
			console.log('Requirement: ' + requirement);
			switch(message.content.substr(message.content.indexOf(' ') + 1, message.content.indexOf(' ', message.content.indexOf(' ') + 1) - message.content.indexOf(' ') - 1)) {
				case 'raid':
					raidReqs.push(requirement);
					message.channel.send('Added requirement to raid: ' + requirement)
						.then(message => console.log(`Sent message: ${message.content}`))
						.catch(console.error);
					break;
				case 'crucible':
					crucibleReqs.push(requirement);
					message.channel.send('Added requirement to crucible: ' + requirement)
						.then(message => console.log(`Sent message: ${message.content}`))
						.catch(console.error);
					break;
				case 'pve':
					pveReqs.push(requirement);
					message.channel.send('Added requirement to pve: ' + requirement)
						.then(message => console.log(`Sent message: ${message.content}`))
						.catch(console.error);
					break;
				case 'all':
					raidReqs.push(requirement);
					crucibleReqs.push(requirement);
					pveReqs.push(requirement);
					message.channel.send('Added requirement to all: ' + requirement)
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
