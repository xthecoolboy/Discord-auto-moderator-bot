const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const config = require('./config');

var raidChannel;
var crucibleChannel;
var pveChannel;
var questionsChannel;

var currentGuild;
var foundGuild;

var hereRequired;
var adminRoles = [];
var singleString;

var raidReqs = [];
var crucibleReqs = [];
var pveReqs = [];

var cmds = [];

client.on('ready', () => {
    console.log("I am ready!");
    raidReqs = config.defaultRaidReqs.slice();
    crucibleReqs = config.defaultCrucibleReqs.slice();
    pveReqs = config.defaultPveReqs.slice();
    hereRequired = config.defaultHereRequired.valueOf();
    adminRoles = config.defaultAdminRoles.slice();
    cmds = config.defaultCmds.slice();
});

client.on('message', message => {
	if(message.member.user.bot){
		console.log("test");
		return;  
  	}
	message.channel.send("Fuck you " + message.member.nickname)
		.then(message => console.log(`Sent message: ${message.content}`))
		.catch(console.error);
	if(!foundGuild){
		currentGuild = message.guild;
		raidChannel = currentGuild.channels.find("name", config.defaultRaidChannel.slice(0));
		crucibleChannel = currentGuild.channels.find("name", config.defaultCrucibleChannel.slice(0));
		pveChannel = currentGuild.channels.find("name", config.defaultPveChannel.slice(0));
		questionsChannel = currentGuild.channels.find("name", config.defaultQuestionsChannel.slice(0));
		foundGuild = true;
	}
	
	//############################################
	//----------------COMMANDS--------------------
	//############################################
	if (message.content.substr(0, cmds[0].length) == cmds[0]) {
	    if (message.content.split(cmds[0].slice(-1)).pop() == 'resetCommands') {
	        cmds = config.defaultCmds.slice();
	        message.channel.send('Reset commands to: ' + cmds, { code: true })
				.then(message => console.log(`Sent message: ${message.content}`))
				.catch(console.error);
	    }else if(message.content.substr(cmds[0].length, message.content.indexOf(" ") - cmds[0].length) == cmds[1]){
		    if (checkAdmin(message)) { return;}
			var requirement = getSubstrByChar(message.content, '"');
			switch(getSubstr(message.content, 2)) {
			    case 'raid':
			        raidReqs.push(new RegExp(requirement, "i"));
			        message.channel.send('Added requirement to raid: ' + requirement, {code:true})
						.then(message => console.log(`Sent message: ${message.content}`))
						.catch(console.error);
					break;
				case 'crucible':
				    crucibleReqs.push(new RegExp(requirement, "i"));
				    message.channel.send('Added requirement to crucible: ' + requirement, { code: true })
						.then(message => console.log(`Sent message: ${message.content}`))
						.catch(console.error);
					break;
				case 'pve':
				    pveReqs.push(new RegExp(requirement, "i"));
				    message.channel.send('Added requirement to pve: ' + requirement, { code: true })
						.then(message => console.log(`Sent message: ${message.content}`))
						.catch(console.error);
					break;
				case 'all':
				    raidReqs.push(new RegExp(requirement, "i"));
				    crucibleReqs.push(new RegExp(requirement, "i"));
				    pveReqs.push(new RegExp(requirement, "i"));
				    message.channel.send('Added requirement to all: ' + requirement, { code: true })
						.then(message => console.log(`Sent message: ${message.content}`))
						.catch(console.error);
					break;
				default:
				    message.channel.send('Usage: modB!addreqs raid/crucible/pve/all <requirement>.' + '\r\n' + '"All" will set this requirement to all lfg chats.', { code: true })
						.then(message => console.log(`Sent message: ${message.content}`))
						.catch(console.error);
			}
		}else if (message.content.substr(cmds[0].length, message.content.indexOf(" ") - cmds[0].length) == cmds[2]) {
		    if (checkAdmin(message)) { return; }
			var requirement = getSubstrByChar(message.content, '"');
			switch(getSubstr(message.content, 2)){
				case 'raid':
				    if (raidReqs.toString().split(',').indexOf(new RegExp(requirement, 'i').toString()) == -1) {
					    message.channel.send('Could not find requirement in lfg-raid: ' + requirement, { code: true })
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					}else{
					    raidReqs.splice(raidReqs.toString().split(',').indexOf(new RegExp(requirement, 'i').toString()), 1);
					    message.channel.send('Removed requirement from raid: ' + requirement, { code: true })
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					}
					break;
				case 'crucible':
				    if (crucibleReqs.toString().split(',').indexOf(new RegExp(requirement, 'i').toString()) == -1) {
					    message.channel.send('Could not find requirement in lfg-crucible: ' + requirement, { code: true })
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					}else{
				        crucibleReqs.splice(crucibleReqs.toString().split(',').indexOf(new RegExp(requirement, 'i').toString()), 1);
					    message.channel.send('Removed requirement from crucible: ' + requirement, { code: true })
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					}
					break;
				case 'pve':
				    if (pveReqs.toString().split(',').indexOf(new RegExp(requirement, 'i').toString()) == -1) {
					    message.channel.send('Could not find requirement in lfg-pve: ' + requirement, { code: true })
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					}else{
				        pveReqs.splice(crucibleReqs.toString().split(',').indexOf(new RegExp(requirement, 'i').toString()), 1);
					    message.channel.send('Removed requirement from crucible: ' + requirement, { code: true })
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					}
					break;
				case 'all':
				    if (raidReqs.toString().split(',').indexOf(new RegExp(requirement, 'i').toString()) == -1) {
					    message.channel.send('Could not find requirement in lfg-raid: ' + requirement, { code: true })
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
				    } else if (crucibleReqs.toString().split(',').indexOf(new RegExp(requirement, 'i').toString()) == -1) {
					    message.channel.send('Could not find requirement in lfg-crucible: ' + requirement, { code: true })
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
				    } else if (pveReqs.toString().split(',').indexOf(new RegExp(requirement, 'i').toString()) == -1) {
					    message.channel.send('Could not find requirement in lfg-pve: ' + requirement, { code: true })
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					}else{
				        raidReqs.splice(raidReqs.toString().split(',').indexOf(new RegExp(requirement, 'i').toString()), 1);
				        crucibleReqs.splice(crucibleReqs.toString().split(',').indexOf(new RegExp(requirement, 'i').toString()), 1);
				        pveReqs.splice(pveReqs.toString().split(',').indexOf(new RegExp(requirement, 'i').toString()), 1);
					    message.channel.send('Removed requirement from all: ' + requirement, { code: true })
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					}
					break;
				default:
				    message.channel.send('Usage: modB!rmReqs raid/crucible/pve/all <requirement>.' + '\r\n' + '"All" will remove this requirement in all lfg chats.', { code: true })
						.then(message => console.log(`Sent message: ${message.content}`))
						.catch(console.error);
			}
		}else if(message.content.split(cmds[0].slice(-1)).pop() == cmds[3]){
		    message.channel.send('Requirements:' + '\r\n' + '@here required: ' + hereRequired + '\r\n' + 'lfg-raid requirements: ' + raidReqs.toString().replace(',', ', ') + '\r\n' + 'lfg-crucible requirements: ' + crucibleReqs.toString().replace(',', ', ') + '\r\n' + 'lfg-pve requirements: ' + pveReqs.toString().replace(',', ', '), { code: true, disableEveryone: true, split: true })
				.then(message => console.log(`Sent message: ${message.content}`))
				.catch(console.error);
		}else if (message.content.substr(cmds[0].length, message.content.indexOf(" ") - cmds[0].length) == cmds[4]) {
		    if (checkAdmin(message)) { return; }
			adminRoles.push(message.content.split(" ").pop());
		    message.channel.send('Added admin role: ' + message.content.split(" ").pop(), {code:true})
				.then(message => console.log(`Sent message: ${message.content}`))
				.catch(console.error);
		}else if (message.content.substr(cmds[0].length, message.content.indexOf(" ") - cmds[0].length) == cmds[5]) {
		    if (checkAdmin(message)) { return; }
			adminRoles.splice(adminRoles.indexOf(message.content.split(" ").pop()), 1);
		    message.channel.send('Removed admin role: ' + message.content.split(" ").pop(), { code: true })
				.then(message => console.log(`Sent message: ${message.content}`))
				.catch(console.error);
		}else if (message.content.substr(cmds[0].length, message.content.indexOf(" ") - cmds[0].length) == cmds[6]) {
		    if (checkAdmin(message)) { return; }
			if(message.content.split(" ").pop() == 'true'){
				hereRequired = true;
			    message.channel.send('Set hereRequired to true.', { code: true })
					.then(message => console.log(`Sent message: ${message.content}`))
					.catch(console.error);
			}else if(message.content.split(" ").pop() == 'false'){
				hereRequired = true;
			    message.channel.send('Set hereRequired to false.', { code: true })
					.then(message => console.log(`Sent message: ${message.content}`))
					.catch(console.error);
			}else{
			    message.channel.send('Usage: modB!setHereRequired true/false', { code: true })
					.then(message => console.log(`Sent message: ${message.content}`))
					.catch(console.error);
			}
		}else if (message.content.substr(cmds[0].length, message.content.indexOf(" ") - cmds[0].length) == cmds[7]) {
		    if (checkAdmin(message)) { return; }
		    cmds[cmds.indexOf(getSubstr(message.content, 2))] = getSubstr(message.content, 3);
		    message.channel.send('Set command ' + getSubstr(message.content, 2) + ' to: ' + getSubstr(message.content, 3), { code: true })
				.then(message => console.log(`Sent message: ${message.content}`))
				.catch(console.error);
		}else if (message.content.split(cmds[0].slice(-1)).pop() == cmds[8]) {
		    message.channel.send('Commands: ' + '\r\n' + 'resetCommands(unchangable),' + cmds, {code:true})
				.then(message => console.log(`Sent message: ${message.content}`))
				.catch(console.error);
		}else if (message.content.split(cmds[0].slice(-1)).pop() == cmds[9]) {
		    if(checkAdmin(message)){return;}
		    raidReqs = config.defaultRaidReqs.slice();
		    crucibleReqs = config.defaultCrucibleReqs.slice();
		    pveReqs = config.defaultPveReqs.slice();
		    hereRequired = config.defaultHereRequired.valueOf();
		    adminRoles = config.defaultAdminRoles.slice();
		    cmds = config.defaultCmds.slice();
		    raidChannel = currentGuild.channels.find("name", config.defaultRaidChannel.slice(0));
		    crucibleChannel = currentGuild.channels.find("name", config.defaultCrucibleChannel.slice(0));
		    pveChannel = currentGuild.channels.find("name", config.defaultPveChannel.slice(0));
		    questionsChannel = currentGuild.channels.find("name", config.defaultQuestionsChannel.slice(0));
            message.channel.send('Set everything to defaults.', { code: true })
				.then(message => console.log(`Sent message: ${message.content}`))
				.catch(console.error);
		}else if (message.content.substr(cmds[0].length, message.content.indexOf(" ") - cmds[0].length) == cmds[10]) {
		    if (checkAdmin(message)) { return; }
		    var existing = getSubstr(message.content, 3);
		    var requirement = getSubstr(message.content, 4);
		    switch (message.content.substr(message.content.indexOf(' ') + 1, message.content.indexOf(' ', message.content.indexOf(' ') + 1) - message.content.indexOf(' ') - 1)) {
		        case 'raid':
		            if (raidReqs.toString().split(',').indexOf(new RegExp(existing, 'i').toString()) == -1) {
		                message.channel.send('Could not find requirement in lfg-raid: ' + existing, { code: true })
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
		            } else {
		                raidReqs.splice(raidReqs.toString().split(',').indexOf(new RegExp(existing, 'i').toString()), 1, new RegExp(requirement, 'i'));
		                message.channel.send('Replaced requirement ' + existing + ' with ' + requirement, { code: true })
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
		            }
		            break;
		        case 'crucible':
		            if (crucibleReqs.toString().split(',').indexOf(new RegExp(existing, 'i').toString()) == -1) {
		                message.channel.send('Could not find requirement in lfg-crucible: ' + existing, { code: true })
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
		            } else {
		                crucibleReqs.splice(crucibleReqs.toString().split(',').indexOf(new RegExp(existing, 'i').toString()), 1, new RegExp(requirement, 'i'));
		                message.channel.send('Replaced requirement ' + existing + ' with ' + requirement, { code: true })
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
		            }
		            break;
		        case 'pve':
		            if (pveReqs.toString().split(',').indexOf(new RegExp(existing, 'i').toString()) == -1) {
		                message.channel.send('Could not find requirement in lfg-pve: ' + existing, { code: true })
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
		            } else {
		                pveReqs.splice(pveReqs.toString().split(',').indexOf(new RegExp(existing, 'i').toString()), 1, new RegExp(requirement, 'i'));
		                message.channel.send('Replaced requirement ' + existing + ' with ' + requirement, { code: true })
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
		            }
		            break;
		        case 'all':
		            if (raidReqs.toString().split(',').indexOf(new RegExp(existing, 'i').toString()) == -1) {
		                message.channel.send('Could not find requirement in lfg-raid: ' + requirement, { code: true })
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
		            } else if (crucibleReqs.toString().split(',').indexOf(new RegExp(existing, 'i').toString()) == -1) {
		                message.channel.send('Could not find requirement in lfg-crucible: ' + requirement, { code: true })
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
		            } else if (pveReqs.toString().split(',').indexOf(new RegExp(existing, 'i').toString()) == -1) {
		                message.channel.send('Could not find requirement in lfg-pve: ' + requirement, { code: true })
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
		            } else {
		                raidReqs.splice(raidReqs.toString().split(',').indexOf(new RegExp(existing, 'i').toString()), 1, new RegExp(requirement, 'i'));
		                crucibleReqs.splice(crucibleReqs.toString().split(',').indexOf(new RegExp(existing, 'i').toString()), 1, new RegExp(requirement, 'i'));
		                pveReqs.splice(pveReqs.toString().split(',').indexOf(new RegExp(existing, 'i').toString()), 1, new RegExp(requirement, 'i'));
		                message.channel.send('Replaced requirement ' + existing + ' with ' + requirement, { code: true })
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
		            }
		            break;
		        default:
		            message.channel.send('Usage: modB!replaceReqs raid/crucible/pve/all <existingRequirement> <newRequirement>.' + '\r\n' + '"All" will remove this requirement in all lfg chats.', { code: true })
						.then(message => console.log(`Sent message: ${message.content}`))
						.catch(console.error);
		    }
		} else {
		    message.channel.send('Unknown command. Type ' + cmds[0] + cmds[8] + ' to list commands.', { code: true })
				.then(message => console.log(`Sent message: ${message.content}`))
				.catch(console.error);
		}
	}
	
	//############################################
	//-------------SYNTAX CHECKING----------------
    //############################################

	if (message.channel != raidChannel && message.channel != crucibleChannel && message.channel != pveChannel) {return;}

	if(hereRequired){
	    if(!message.mentions.everyone){
	        message.member.user.createDM()
				.then(dm => dm.send('@here must be the first thing in the lfg messages.', {disableEveryone:true,split:true,code:true}).then(message => console.log(`Sent message: ${message.content}`)).catch(console.error))
				.catch(console.error);
	        return;
	    }
	}

	if (message.channel == raidChannel) {
	    if (message.mentions.members.array() != '') {
	        questionsChannel.send(message.content, { reply: message.author })
                .then(message => console.log(`Sent message: ${message.content}`))
                .catch(console.error);
	        return;
	    }
	    for (i = 0; i < raidReqs.length; i++) {
	        if(!raidReqs[i].test(message.content)){
	            message.member.user.createDM()
				    .then(dm => dm.send('Destiny raid LFG messages must be in this syntax: ' + '\r\n' + raidReqs.toString().replace(',', ' ') + '\r\n' + '@here required is ' + hereRequired, { disableEveryone: true, split: true, code: true }).then(message => console.log(`Sent message: ${message.content}`)).catch(console.error))
				    .catch(console.error);
	            return;
	        }
	    }
	} else if (message.channel == crucibleChannel) {
	    if (message.mentions.members.array() != '') {
	        questionsChannel.send(message.content, { reply: message.author })
                .then(message => console.log(`Sent message: ${message.content}`))
                .catch(console.error);
	        return;
	    }
	    for (i = 0; i < crucibleReqs.length; i++) {
	        if (!crucibleReqs[i].test(message.content)) {
	            message.member.user.createDM()
				    .then(dm => dm.send('Destiny crucible LFG messages must be in this syntax: ' + '\r\n' + crucibleReqs.toString().replace(',', ' ') + '\r\n' + '@here required is ' + hereRequired, { disableEveryone: true, split: true, code: true }).then(message => console.log(`Sent message: ${message.content}`)).catch(console.error))
				    .catch(console.error);
	            return;
	        }
	    }
	} else if (message.channel == pveChannel) {
	    if (message.mentions.members.array() != '') {
	        questionsChannel.send(message.content, { reply: message.author })
                .then(message => console.log(`Sent message: ${message.content}`))
                .catch(console.error);
	        return;
	    }
	    for (i = 0; i < pveReqs.length; i++) {
	        if (!pveReqs[i].test(message.content)) {
	            message.member.user.createDM()
				    .then(dm => dm.send('Destiny PvE LFG messages must be in this syntax: ' + '\r\n' + pveReqs.toString().replace(',', ' ') + '\r\n' + '@here required is ' + hereRequired, { disableEveryone: true, split: true, code: true }).then(message => console.log(`Sent message: ${message.content}`)).catch(console.error))
				    .catch(console.error);
	            return;
	        }
	    }
	}
});


function getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
}

function getSubstr(string, index) {
    if (index == string.split(' ').length) {
        return string.split(' ').pop();
    }
    if (index == 1) {
        return string.subString(0, string.indexOf(' '));
    }
    return string.substr(getPosition(string, ' ', index-1)+1, getPosition(string, ' ', index) - getPosition(string, ' ', index-1)-1);
}

function getSubstrByChar(string, char) {
    return string.substr(getPosition(string, char, 1) + 1, getPosition(string, char, 2) - getPosition(string, char, 1) - 1);
}

function checkAdmin(message) {
    var isAdmin = false;
    for (i = 0; i < adminRoles.length; i++) {
        if (message.member.roles.find("name", adminRoles[i])) {
            isAdmin = true;
        }
    }
    if (!isAdmin && message.member.nickname != 'warhamercas#1366') {
        message.channel.send('Must be admin to modify lfg syntax requirements.')
            .then(message => console.log(`Sent message: ${message.content}`))
            .catch(console.error);
        return true;
    }
    return false;
}


client.login(process.env.BOT_TOKEN);
