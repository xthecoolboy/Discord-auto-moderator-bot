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
var adminRoles = ["LEADERSHIP"];

var raidReqs = [];
var crucibleReqs = [];
var pveReqs = [];

var raidId = [[],[]];
var crucibleId = [[],[]];
var pveId = [[], []];

var raidWild = [[], []];
var crucibleWild = [[], []];
var pveWild = [[], []];

var raidor = [[],[]];
var crucibleor = [[],[]];
var pveor = [[], []];

var cmds = ['modB!', 'addReqs', 'rmReqs', 'listReqs', 'addAdminRole', 'rmAdminRole', 'setHereRequired', 'setCmd', 'commands', 'setDefault'];
const cmdsReset = ['modB!', 'addReqs', 'rmReqs', 'listReqs', 'addAdminRole', 'rmAdminRole', 'setHereRequired', 'setCmd', 'commands', 'setDefault'];

client.on('ready', () => {
	console.log("I am ready!");
});

client.on('message', message => {
	if(!foundGuild){
		currentGuild = message.guild;
		raidChannel = currentGuild.channels.find("name", "lfg-raid");
		crucibleChannel = currentGuild.channels.find("name", "lfg-crucible");
		pveChannel = currentGuild.channels.find("name", "lfg-pve");
		questionsChannel = currentGuild.channels.find("name", "lfg-questions");
		foundGuild = true;
	}
	
	//############################################
	//----------------COMMANDS--------------------
	//############################################
	if (message.content.substr(0, cmds[0].length) == cmds[0]) {
	    if (message.content.split(cmds[0].slice(-1)).pop() == 'resetCommands') {
	        cmds = cmdsReset;
	        message.channel.send('Reset commands to: ' + cmds, { code: true })
				.then(message => console.log(`Sent message: ${message.content}`))
				.catch(console.error);
	    }
		if(message.content.substr(cmds[0].length, message.content.indexOf(" ") - cmds[0].length) == cmds[1]){
		    if (checkAdmin(message)) { return;}
			var requirement = message.content.split(" ").pop();
			switch(message.content.substr(message.content.indexOf(' ') + 1, message.content.indexOf(' ', message.content.indexOf(' ') + 1) - message.content.indexOf(' ') - 1)) {
			    case 'raid':
			        raidReqs.push(new RegExp(requirement, "i"));
				    //setupReq("raid");
			        message.channel.send('Added requirement to raid: ' + requirement, {code:true})
						.then(message => console.log(`Sent message: ${message.content}`))
						.catch(console.error);
					break;
				case 'crucible':
				    crucibleReqs.push(new RegExp(requirement, "i"));
				    //setupReq("crucible");
				    message.channel.send('Added requirement to crucible: ' + requirement, { code: true })
						.then(message => console.log(`Sent message: ${message.content}`))
						.catch(console.error);
					break;
				case 'pve':
				    pveReqs.push(new RegExp(requirement, "i"));
				    //setupReq("pve");
				    message.channel.send('Added requirement to pve: ' + requirement, { code: true })
						.then(message => console.log(`Sent message: ${message.content}`))
						.catch(console.error);
					break;
				case 'all':
				    raidReqs.push(new RegExp(requirement, "i"));
				    crucibleReqs.push(new RegExp(requirement, "i"));
				    pveReqs.push(new RegExp(requirement, "i"));
					//setupReq("all");
				    message.channel.send('Added requirement to all: ' + requirement, { code: true })
						.then(message => console.log(`Sent message: ${message.content}`))
						.catch(console.error);
					break;
				default:
				    message.channel.send('Usage: modB!addreqs raid/crucible/pve/all <requirement>.' + '\r\n' + '"All" will set this requirement to all lfg chats.', { code: true })
						.then(message => console.log(`Sent message: ${message.content}`))
						.catch(console.error);
			}
		}
		if (message.content.substr(cmds[0].length, message.content.indexOf(" ") - cmds[0].length) == cmds[2]) {
		    if (checkAdmin(message)) { return; }
			var requirement = message.content.split(" ").pop();
			switch(message.content.substr(message.content.indexOf(' ') + 1, message.content.indexOf(' ', message.content.indexOf(' ') + 1) - message.content.indexOf(' ') - 1)){
				case 'raid':
					if(raidReqs.indexOf(requirement) == -1){
					    message.channel.send('Could not find requirement in lfg-raid: ' + requirement, { code: true })
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					}else{
						raidReqs.splice(raidReqs.indexOf(requirement), 1);
					    message.channel.send('Removed requirement from raid: ' + requirement, { code: true })
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					}
					break;
				case 'crucible':
					if(crucibleReqs.indexOf(requirement) == -1){
					    message.channel.send('Could not find requirement in lfg-crucible: ' + requirement, { code: true })
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					}else{
						crucibleReqs.splice(raidReqs.indexOf(requirement), 1);
					    message.channel.send('Removed requirement from crucible: ' + requirement, { code: true })
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					}
					break;
				case 'pve':
					if(pveReqs.indexOf(requirement) == -1){
					    message.channel.send('Could not find requirement in lfg-pve: ' + requirement, { code: true })
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					}else{
						pveReqs.splice(raidReqs.indexOf(requirement), 1);
					    message.channel.send('Removed requirement from crucible: ' + requirement, { code: true })
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					}
					break;
				case 'all':
					if(raidReqs.indexOf(requirement) == -1){
					    message.channel.send('Could not find requirement in lfg-raid: ' + requirement, { code: true })
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					}else if(crucibleReqs.indexOf(requirement) == -1){
					    message.channel.send('Could not find requirement in lfg-crucible: ' + requirement, { code: true })
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					}else if(pveReqs.indexOf(requirement) == -1){
					    message.channel.send('Could not find requirement in lfg-pve: ' + requirement, { code: true })
							.then(message => console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					}else{
						raidReqs.splice(raidReqs.indexOf(requirement), 1);
						crucibleReqs.splice(raidReqs.indexOf(requirement), 1);
						pveReqs.splice(raidReqs.indexOf(requirement), 1);
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
		}
		if(message.content.split(cmds[0].slice(-1)).pop() == cmds[3]){
		    message.channel.send('Requirements:' + '\r\n' + 'Order matters: ' + orderMatters + '\r\n' + '@here required: ' + hereRequired + '\r\n' + 'Allow extra text: ' + allowExtra + '\r\n' + 'lfg-raid requirements: ' + raidReqs + '\r\n' + 'lfg-crucible requirements: ' + crucibleReqs + '\r\n' + 'lfg-pve requirements: ' + pveReqs, { code: true, disableEveryone: true, split: true })
				.then(message => console.log(`Sent message: ${message.content}`))
				.catch(console.error);
		}
		if (message.content.substr(cmds[0].length, message.content.indexOf(" ") - cmds[0].length) == cmds[4]) {
		    if (checkAdmin(message)) { return; }
			adminRoles.push(message.content.split(" ").pop());
		    message.channel.send('Added admin role: ' + message.content.split(" ").pop(), {code:true})
				.then(message => console.log(`Sent message: ${message.content}`))
				.catch(console.error);
		}
		if (message.content.substr(cmds[0].length, message.content.indexOf(" ") - cmds[0].length) == cmds[5]) {
		    if (checkAdmin(message)) { return; }
			adminRoles.splice(adminRoles.indexOf(message.content.split(" ").pop()), 1);
		    message.channel.send('Removed admin role: ' + message.content.split(" ").pop(), { code: true })
				.then(message => console.log(`Sent message: ${message.content}`))
				.catch(console.error);
		}
		/*if (message.content.substr(cmds[0].length, message.content.indexOf(" ") - cmds[0].length) == cmds[6]) {
		    if (checkAdmin(message)) { return; }
			if(message.content.split(" ").pop() == 'true'){
				orderMatters = true;
			    message.channel.send('Set orderMatters to true.', { code: true })
					.then(message => console.log(`Sent message: ${message.content}`))
					.catch(console.error);
			}else if(message.content.split(" ").pop() == 'false'){
				orderMatters = false;
			    message.channel.send('Set orderMatters to false.', { code: true })
					.then(message => console.log(`Sent message: ${message.content}`))
					.catch(console.error);
			}else{
			    message.channel.send('Usage: modB!setOrderMatters true/false', { code: true })
					.then(message => console.log(`Sent message: ${message.content}`))
					.catch(console.error);
			}
		}*/
		if (message.content.substr(cmds[0].length, message.content.indexOf(" ") - cmds[0].length) == cmds[6]) {
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
		}
		/*if (message.content.substr(cmds[0].length, message.content.indexOf(" ") - cmds[0].length) == cmds[8]) {
		    if (checkAdmin(message)) { return; }
			if(message.content.split(" ").pop() == 'true'){
				allowExtra = true;
			    message.channel.send('Set allowExtra to true.', { code: true })
					.then(message => console.log(`Sent message: ${message.content}`))
					.catch(console.error);
			}else if(message.content.split(" ").pop() == 'false'){
				allowExtra = true;
			    message.channel.send('Set allowExtra to false.', { code: true })
					.then(message => console.log(`Sent message: ${message.content}`))
					.catch(console.error);
			}else{
			    message.channel.send('Usage: modB!setAllowExtra true/false', { code: true })
					.then(message => console.log(`Sent message: ${message.content}`))
					.catch(console.error);
			}
		}*/
		if (message.content.substr(cmds[0].length, message.content.indexOf(" ") - cmds[0].length) == cmds[7]) {
		    if (checkAdmin(message)) { return; }
		    cmds[cmds.indexOf(getSubstr(message.content, 2))] = getSubstr(message.content, 3);
		    message.channel.send('Set command ' + getSubstr(message.content, 2) + ' to: ' + getSubstr(message.content, 3), { code: true })
				.then(message => console.log(`Sent message: ${message.content}`))
				.catch(console.error);
		}
		if (message.content.split(cmds[0].slice(-1)).pop() == cmds[8]) {
		    message.channel.send('Commands: ' + '\r\n' + 'resetCommands(unchangable),' + cmds, {code:true})
				.then(message => console.log(`Sent message: ${message.content}`))
				.catch(console.error);
		}
	}
	
	//############################################
	//-------------SYNTAX CHECKING----------------
    //############################################
	console.log('Members: ' + message.mentions.members);

	if(hereRequired){
	    if(!message.mentions.everyone){
	        message.member.user.createDM()
				.then(dm => dm.send('@here must be the first thing in the lfg messages.', {disableEveryone:true,split:true,code:true}).then(message => console.log(`Sent message: ${message.content}`)).catch(console.error))
				.catch(console.error);
	        return;
	    }
	}

	if (message.channel == raidChannel) {
	    if (message.mentions.members != null) {
	        questionsChannel.send(message.content, { reply: message.author })
                .then(message => console.log(`Sent message: ${message.content}`))
                .catch(console.error);
	        return;
	    }
	    for (i = 0; i < raidReqs.length; i++) {
	        if(!message.content.test(raidReqs[i])){
	            message.member.user.createDM()
				    .then(dm => dm.send('Destiny raid LFG messages must be in this syntax: ' + '\r\n' + raidReqs.toString().replace(',', ' ') + '\r\n' + '@here required is ' + hereRequired, { disableEveryone: true, split: true, code: true }).then(message => console.log(`Sent message: ${message.content}`)).catch(console.error))
				    .catch(console.error);
	            return;
	        }
	    }
	} else if (message.channel == crucibleChannel) {
	    for (i = 0; i < crucibleReqs.length; i++) {
	        if (!message.content.test(crucibleReqs[i])) {
	            message.member.user.createDM()
				    .then(dm => dm.send('Destiny crucible LFG messages must be in this syntax: ' + '\r\n' + crucibleReqs.toString().replace(',', ' ') + '\r\n' + '@here required is ' + hereRequired, { disableEveryone: true, split: true, code: true }).then(message => console.log(`Sent message: ${message.content}`)).catch(console.error))
				    .catch(console.error);
	            return;
	        }
	    }
	} else if (message.channel == pveChannel) {
	    for (i = 0; i < pveReqs.length; i++) {
	        if (!message.content.test(pveReqs[i])) {
	            message.member.user.createDM()
				    .then(dm => dm.send('Destiny PvE LFG messages must be in this syntax: ' + '\r\n' + pveReqs.toString().replace(',', ' ') + '\r\n' + '@here required is ' + hereRequired, { disableEveryone: true, split: true, code: true }).then(message => console.log(`Sent message: ${message.content}`)).catch(console.error))
				    .catch(console.error);
	            return;
	        }
	    }
	}
});

function setupReq(id) {
    
    /*switch (id) {
        case 'raid':
            if (raidReqs[raidReqs.length - 1].includes("||")) {
                for (i = 0; i <= raidReqs[raidReqs.length - 1].split("||").length - 1; i++) {
                    raidor[raidReqs.length - 1][i] = raidReqs[raidReqs.length - 1].split("||")[i];
                }
            } else {
                raidor[raidReqs.length - 1][0] = raidReqs[raidReqs.length - 1];
            }
            for (i = 0; i < raidor[raidReqs.length - 1].length; i++) {
                if (raidor[raidReqs.length - 1][i].charAt(0) == '~') {
                    if (raidor[raidReqs.length - 1][i].slice(-1) == '~') {
                        raidId[raidReqs.length - 1][i] = "both";
                    } else {
                        raidId[raidReqs.length - 1][i] = "front";
                    }
                } else if (raidor[raidReqs.length - 1][i].slice(-1) == '~') {
                    raidId[raidReqs.length - 1][i] = "end";
                } else {
                    raidId[raidReqs.length - 1][i] = "none";
                }
                raidWild[raidReqs.length - 1][i] = [];
                if (raidor[raidReqs.length - 1][i].includes("$")) {
                    for (a = 0; a <= raidor[raidReqs.length - 1][i].split("$").length - 1; a++) {
                        raidWild[raidReqs.length - 1][i][a] = getPosition(raidReqs[raidReqs.length - 1], '$', a+1);
                    }
                }
            }
            break;
        case 'crucible':
            if (crucibleReqs[crucibleReqs.length - 1].includes("||")) {
                for (i = 0; i <= crucibleReqs[crucibleReqs.length - 1].split("||").length - 1; i++) {
                    crucibleor[crucibleReqs.length - 1][i] = crucibleReqs[crucibleReqs.length - 1].split("||")[i];
                }
            } else {
                crucibleor[crucibleReqs.length - 1][0] = crucibleReqs[crucibleReqs.length - 1];
            }
            for (i = 0; i < crucibleor[crucibleReqs.length - 1].length; i++) {
                if (crucibleor[crucibleReqs.length - 1][i].charAt(0) == '~') {
                    if (crucibleor[crucibleReqs.length - 1][i].slice(-1) == '~') {
                        crucibleId[crucibleReqs.length - 1][i] = "both";
                    } else {
                        crucibleId[crucibleReqs.length - 1][i] = "front";
                    }
                } else if (crucibleor[crucibleReqs.length - 1][i].slice(-1) == '~') {
                    crucibleId[crucibleReqs.length - 1][i] = "end";
                } else {
                    crucibleId[crucibleReqs.length - 1][i] = "none";
                }
                crucibleWild[crucibleReqs.length - 1][i] = [];
                if (crucibleor[crucibleReqs.length - 1][i].includes("$")) {
                    for (a = 0; a <= crucibleor[crucibleReqs.length - 1][i].split("$").length - 1; a++) {
                        crucibleWild[crucibleReqs.length - 1][i][a] = getPosition(crucibleReqs[crucibleReqs.length - 1], '$', a + 1);
                    }
                }
            }
            break;
        case 'pve':
            if (pveReqs[pveReqs.length - 1].includes("||")) {
                for (i = 0; i <= pveReqs[pveReqs.length - 1].split("||").length - 1; i++) {
                    pveor[pveReqs.length - 1][i] = pveReqs[pveReqs.length - 1].split("||")[i];
                }
            } else {
                pveor[pveReqs.length - 1][0] = pveReqs[pveReqs.length - 1];
            }
            for (i = 0; i < pveor[pveReqs.length - 1].length; i++) {
                if (pveor[pveReqs.length - 1][i].charAt(0) == '~') {
                    if (pveor[pveReqs.length - 1][i].slice(-1) == '~') {
                        pveId[pveReqs.length - 1][i] = "both";
                    } else {
                        pveId[pveReqs.length - 1][i] = "front";
                    }
                } else if (pveor[pveReqs.length - 1][i].slice(-1) == '~') {
                    pveId[pveReqs.length - 1][i] = "end";
                } else {
                    pveId[pveReqs.length - 1][i] = "none";
                }
                pveWild[pveReqs.length - 1][i] = [];
                if (pveor[pveReqs.length - 1][i].includes("$")) {
                    for (a = 0; a <= pveor[pveReqs.length - 1][i].split("$").length - 1; a++) {
                        pveWild[pveReqs.length - 1][i][a] = getPosition(pveReqs[pveReqs.length - 1], '$', a + 1);
                    }
                }
            }
            break;
        case 'all':
            if (raidReqs[raidReqs.length - 1].includes("||")) {
                for (i = 0; i <= raidReqs[raidReqs.length - 1].split("||").length - 1; i++) {
                    raidor[raidReqs.length - 1][i] = raidReqs[raidReqs.length - 1].split("||")[i];
                }
            } else {
                raidor[raidReqs.length - 1][0] = raidReqs[raidReqs.length - 1];
            }
            for (i = 0; i < raidor[raidReqs.length - 1].length; i++) {
                if (raidor[raidReqs.length - 1][i].charAt(0) == '~') {
                    if (raidor[raidReqs.length - 1][i].slice(-1) == '~') {
                        raidId[raidReqs.length - 1][i] = "both";
                    } else {
                        raidId[raidReqs.length - 1][i] = "front";
                    }
                } else if (raidor[raidReqs.length - 1][i].slice(-1) == '~') {
                    raidId[raidReqs.length - 1][i] = "end";
                } else {
                    raidId[raidReqs.length - 1][i] = "none";
                }
                raidWild[raidReqs.length - 1][i] = [];
                if (raidor[raidReqs.length - 1][i].includes("$")) {
                    for (a = 0; a <= raidor[raidReqs.length - 1][i].split("$").length - 1; a++) {
                        raidWild[raidReqs.length - 1][i][a] = getPosition(raidReqs[raidReqs.length - 1], '$', a + 1);
                    }
                }
            }
            if (crucibleReqs[crucibleReqs.length - 1].includes("||")) {
                for (i = 0; i <= crucibleReqs[crucibleReqs.length - 1].split("||").length - 1; i++) {
                    crucibleor[crucibleReqs.length - 1][i] = crucibleReqs[crucibleReqs.length - 1].split("||")[i];
                }
            } else {
                crucibleor[crucibleReqs.length - 1][0] = crucibleReqs[crucibleReqs.length - 1];
            }
            for (i = 0; i < crucibleor[crucibleReqs.length - 1].length; i++) {
                if (crucibleor[crucibleReqs.length - 1][i].charAt(0) == '~') {
                    if (crucibleor[crucibleReqs.length - 1][i].slice(-1) == '~') {
                        crucibleId[crucibleReqs.length - 1][i] = "both";
                    } else {
                        crucibleId[crucibleReqs.length - 1][i] = "front";
                    }
                } else if (crucibleor[crucibleReqs.length - 1][i].slice(-1) == '~') {
                    crucibleId[crucibleReqs.length - 1][i] = "end";
                } else {
                    crucibleId[crucibleReqs.length - 1][i] = "none";
                }
                crucibleWild[crucibleReqs.length - 1][i] = [];
                if (crucibleor[crucibleReqs.length - 1][i].includes("$")) {
                    for (a = 0; a <= crucibleor[crucibleReqs.length - 1][i].split("$").length - 1; a++) {
                        crucibleWild[crucibleReqs.length - 1][i][a] = getPosition(crucibleReqs[crucibleReqs.length - 1], '$', a + 1);
                    }
                }
            }
            if (pveReqs[pveReqs.length - 1].includes("||")) {
                for (i = 0; i <= pveReqs[pveReqs.length - 1].split("||").length - 1; i++) {
                    pveor[pveReqs.length - 1][i] = pveReqs[pveReqs.length - 1].split("||")[i];
                }
            } else {
                pveor[pveReqs.length - 1][0] = pveReqs[pveReqs.length - 1];
            }
            for (i = 0; i < pveor[pveReqs.length - 1].length; i++) {
                if (pveor[pveReqs.length - 1][i].charAt(0) == '~') {
                    if (pveor[pveReqs.length - 1][i].slice(-1) == '~') {
                        pveId[pveReqs.length - 1][i] = "both";
                    } else {
                        pveId[pveReqs.length - 1][i] = "front";
                    }
                } else if (pveor[pveReqs.length - 1][i].slice(-1) == '~') {
                    pveId[pveReqs.length - 1][i] = "end";
                } else {
                    pveId[pveReqs.length - 1][i] = "none";
                }
                pveWild[pveReqs.length - 1][i] = [];
                if (pveor[pveReqs.length - 1][i].includes("$")) {
                    for (a = 0; a <= pveor[pveReqs.length - 1][i].split("$").length - 1; a++) {
                        pveWild[pveReqs.length - 1][i][a] = getPosition(pveReqs[pveReqs.length - 1], '$', a + 1);
                    }
                }
            }
            break;
    }*/
}

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

function sendSyntax(user, id) {
    switch (id) {
        case 0:
            message.member.user.createDM()
				.then(dm => dm.send('Destiny raid LFG messages must be in this syntax: ' + '\r\n' + raidReqs.toString().replace(',', ' '), { disableEveryone: true, split: true, code: true }).then(message => console.log(`Sent message: ${message.content}`)).catch(console.error))
				.catch(console.error);
    }
}

client.login(process.env.BOT_TOKEN);
