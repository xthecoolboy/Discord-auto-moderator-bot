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
var adminRoles = ["LEADERSHIP"];

var raidReqs = [];
var crucibleReqs = [];
var pveReqs = [];

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
	if(message.content.substr(0, 5) == 'modB!'){
		if(message.content.substr(5, message.content.indexOf(" ") - 5) == 'addReqs'){
			var isAdmin = false;
			for(i = 0; i < adminRoles.length; i++){
				if(message.member.roles.find("name", adminRoles[i])){
					isAdmin = true;
				}
			}
			if(!isAdmin && message.member.nickname != 'warhamercas#1366'){
				message.channel.send('Must be admin to modify lfg syntax requirements.')
					.then(message => console.log(`Sent message: ${message.content}`))
					.catch(console.error);
				return;
			}
			var requirement = message.content.split(" ").pop();
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
		if(message.content.substr(5, message.content.indexOf(" ") - 5) == 'rmReqs'){
			var isAdmin = false;
			for(i = 0; i < adminRoles.length; i++){
				if(message.member.roles.find("name", adminRoles[i])){
					isAdmin = true;
				}
			}
			if(!isAdmin && message.member.nickname != 'warhamercas#1366'){
				message.channel.send('Must be admin to modify lfg syntax requirements.')
					.then(message => console.log(`Sent message: ${message.content}`))
					.catch(console.error);
				return;
			}
			var requirement = message.content.split(" ").pop();
			switch(message.content.substr(message.content.indexOf(' ') + 1, message.content.indexOf(' ', message.content.indexOf(' ') + 1) - message.content.indexOf(' ') - 1)){
				case 'raid':
					if(raidReqs.indexOf(requirement) == -1){
						message.channel.send('Could not find requirement in lfg-raid: ' + requirement)
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					}else{
						raidReqs.splice(raidReqs.indexOf(requirement), 1);
						message.channel.send('Removed requirement from raid: ' + requirement)
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					}
					break;
				case 'crucible':
					if(crucibleReqs.indexOf(requirement) == -1){
						message.channel.send('Could not find requirement in lfg-crucible: ' + requirement)
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					}else{
						crucibleReqs.splice(raidReqs.indexOf(requirement), 1);
						message.channel.send('Removed requirement from crucible: ' + requirement)
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					}
					break;
				case 'pve':
					if(pveReqs.indexOf(requirement) == -1){
						message.channel.send('Could not find requirement in lfg-pve: ' + requirement)
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					}else{
						pveReqs.splice(raidReqs.indexOf(requirement), 1);
						message.channel.send('Removed requirement from crucible: ' + requirement)
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					}
					break;
				case 'all':
					if(raidReqs.indexOf(requirement) == -1){
						message.channel.send('Could not find requirement in lfg-raid: ' + requirement)
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					}else if(crucibleReqs.indexOf(requirement) == -1){
						message.channel.send('Could not find requirement in lfg-crucible: ' + requirement)
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					}else if(pveReqs.indexOf(requirement) == -1){
						message.channel.send('Could not find requirement in lfg-pve: ' + requirement)
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					}else{
						raidReqs.splice(raidReqs.indexOf(requirement), 1);
						crucibleReqs.splice(raidReqs.indexOf(requirement), 1);
						pveReqs.splice(raidReqs.indexOf(requirement), 1);
						message.channel.send('Removed requirement from all: ' + requirement)
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					}
					break;
				default:
					message.channel.send('Usage: modB!rmReqs raid/crucible/pve/all <requirement>. "All" will remove this requirement in all lfg chats.')
						.then(message => console.log(`Sent message: ${message.content}`))
						.catch(console.error);
			}
		}
		if(message.content.split("!").pop() == 'listReqs'){
			message.channel.send('Requirements:')
				.then(message => console.log(`Sent message: ${message.content}`))
				.catch(console.error);
			message.channel.send('Order matters: ' + orderMatters)
				.then(message => console.log(`Sent message: ${message.content}`))
				.catch(console.error);
			message.channel.send('@ here required: ' + hereRequired)
				.then(message => console.log(`Sent message: ${message.content}`))
				.catch(console.error);
			message.channel.send('Allow extra text: ' + allowExtra)
				.then(message => console.log(`Sent message: ${message.content}`))
				.catch(console.error);
			message.channel.send('lfg-raid requirements: ' + raidReqs)
				.then(message => console.log(`Sent message: ${message.content}`))
				.catch(console.error);
			message.channel.send('lfg-crucible requirements: ' + crucibleReqs)
				.then(message => console.log(`Sent message: ${message.content}`))
				.catch(console.error);
			message.channel.send('lfg-pve requirements: ' + pveReqs)
				.then(message => console.log(`Sent message: ${message.content}`))
				.catch(console.error);
		}
		if(message.content.substr(5, message.content.indexOf(" ") - 5) == 'addAdminRole'){
			var isAdmin = false;
			for(i = 0; i < adminRoles.length; i++){
				if(message.member.roles.find("name", adminRoles[i])){
					isAdmin = true;
				}
			}
			if(!isAdmin && message.member.nickname != 'warhamercas#1366'){
				message.channel.send('Must be admin to modify admin roles.')
					.then(message => console.log(`Sent message: ${message.content}`))
					.catch(console.error);
				return;
			}
			adminRoles.push(message.content.split(" ").pop());
			message.channel.send('Added admin role: '  + message.content.split(" ").pop())
				.then(message => console.log(`Sent message: ${message.content}`))
				.catch(console.error);
		}
		if(message.content.substr(5, message.content.indexOf(" ") - 5) == 'rmAdminRole'){
			var isAdmin = false;
			for(i = 0; i < adminRoles.length; i++){
				if(message.member.roles.find("name", adminRoles[i])){
					isAdmin = true;
				}
			}
			if(!isAdmin && message.member.nickname != 'warhamercas#1366'){
				message.channel.send('Must be admin to modify admin roles.')
					.then(message => console.log(`Sent message: ${message.content}`))
					.catch(console.error);
				return;
			}
			adminRoles.splice(adminRoles.indexOf(message.content.split(" ").pop()), 1);
			message.channel.send('Removed admin role: '  + message.content.split(" ").pop())
				.then(message => console.log(`Sent message: ${message.content}`))
				.catch(console.error);
		}
		if(message.content.substr(5, message.content.indexOf(" ") - 5) == 'setOrderMatters'){
			var isAdmin = false;
			for(i = 0; i < adminRoles.length; i++){
				if(message.member.roles.find("name", adminRoles[i])){
					isAdmin = true;
				}
			}
			if(!isAdmin && message.member.nickname != 'warhamercas#1366'){
				message.channel.send('Must be admin to modify lfg syntax requirements.')
					.then(message => console.log(`Sent message: ${message.content}`))
					.catch(console.error);
				return;
			}
			if(message.content.split(" ").pop()) == 'true'){
				orderMatters = true;
				message.channel.send('Set orderMatters to true.')
					.then(message => console.log(`Sent message: ${message.content}`))
					.catch(console.error);
			}else if(message.content.split(" ").pop() == 'false'){
				orderMatters = false;
				message.channel.send('Set orderMatters to false.')
					.then(message => console.log(`Sent message: ${message.content}`))
					.catch(console.error);
			}else{
				message.channel.send('Usage: modB!setOrderMatters true/false')
					.then(message => console.log(`Sent message: ${message.content}`))
					.catch(console.error);
			}
		}
		if(message.content.substr(5, message.content.indexOf(" ") - 5) == 'setHereRequired'){
			var isAdmin = false;
			for(i = 0; i < adminRoles.length; i++){
				console.log('Checking if has ' + adminRoles[i]);
				if(message.member.roles.find("name", adminRoles[i])){
					isAdmin = true;
				}
			}
			if(!isAdmin && message.member.nickname != 'warhamercas#1366'){
				message.channel.send('Must be admin to modify lfg syntax requirements.')
					.then(message => console.log(`Sent message: ${message.content}`))
					.catch(console.error);
				return;
			}
			if(message.content.split(" ").pop() == 'true'){
				hereRequired = true;
				message.channel.send('Set hereRequired to true.')
					.then(message => console.log(`Sent message: ${message.content}`))
					.catch(console.error);
			}else if(message.content.split(" ").pop() == 'false'){
				hereRequired = true;
				message.channel.send('Set hereRequired to false.')
					.then(message => console.log(`Sent message: ${message.content}`))
					.catch(console.error);
			}else{
				message.channel.send('Usage: modB!setHereRequired true/false')
					.then(message => console.log(`Sent message: ${message.content}`))
					.catch(console.error);
			}
		}
		if(message.content.substr(5, message.content.indexOf(" ") - 5) == 'setAllowExtra'){
			var isAdmin = false;
			for(i = 0; i < adminRoles.length; i++){
				if(message.member.roles.find("name", adminRoles[i])){
					isAdmin = true;
				}
			}
			if(!isAdmin && message.member.nickname != 'warhamercas#1366'){
				message.channel.send('Must be admin to modify lfg syntax requirements.')
					.then(message => console.log(`Sent message: ${message.content}`))
					.catch(console.error);
				return;
			}
			if(message.content.split(" ").pop() == 'true'){
				allowExtra = true;
				message.channel.send('Set allowExtra to true.')
					.then(message => console.log(`Sent message: ${message.content}`))
					.catch(console.error);
			}else if(message.content.split(" ").pop() == 'false'){
				allowExtra = true;
				message.channel.send('Set allowExtra to false.')
					.then(message => console.log(`Sent message: ${message.content}`))
					.catch(console.error);
			}else{
				message.channel.send('Usage: modB!setAllowExtra true/false')
					.then(message => console.log(`Sent message: ${message.content}`))
					.catch(console.error);
			}
		}
	}
	
	//############################################
	//-------------SYNTAX CHECKING----------------
	//############################################
	
	if(message.channel == raidChannel){
		if(orderMatters){
			if(allowExtra){
				if(hereRequired){
					if(message.content.substr(0, message.content.indexOf(" ")) != '@here' && message.content.substr(0, message.content.indexOf(" ")) != '@everyone'){
						
					}
				}
			}
		}else{
			if(allowExtra){
				if(hereRequired){
					if(!message.content.includes("@here") && !message.content.includes("@everyone")){
						message.member.user.createDM()
							.then(dm => dm.send('@here is required somewhere in the lfg messages.', {disableEveryone:true,split:true,code:true}).then(message => console.log('Sent message: ${message.content}')).catch(console.error))
							.catch(console.error);
					}
				}
			}else{
				
			}
		}
	}
});

client.login(process.env.BOT_TOKEN);
