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

var raidId = [[],[]];
var crucibleId = [[],[]];
var pveId = [[], []];

var raidWild = [[], []];
var crucibleWild = [[], []];
var pveWild = [[], []];

var raidor = [[],[]];
var crucibleor = [[],[]];
var pveor = [[],[]];

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
	if(message.content.substr(0, 5) == 'modB!'){
		if(message.content.substr(5, message.content.indexOf(" ") - 5) == 'addReqs'){
		    if (checkAdmin(message)) { return;}
			var requirement = message.content.split(" ").pop();
			switch(message.content.substr(message.content.indexOf(' ') + 1, message.content.indexOf(' ', message.content.indexOf(' ') + 1) - message.content.indexOf(' ') - 1)) {
			    case 'raid':
			        raidReqs.push(requirement);
				    setupReq("raid");
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
		    if (checkAdmin(message)) { return; }
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
		    if (checkAdmin(message)) { return; }
			adminRoles.push(message.content.split(" ").pop());
			message.channel.send('Added admin role: '  + message.content.split(" ").pop())
				.then(message => console.log(`Sent message: ${message.content}`))
				.catch(console.error);
		}
		if(message.content.substr(5, message.content.indexOf(" ") - 5) == 'rmAdminRole'){
		    if (checkAdmin(message)) { return; }
			adminRoles.splice(adminRoles.indexOf(message.content.split(" ").pop()), 1);
			message.channel.send('Removed admin role: '  + message.content.split(" ").pop())
				.then(message => console.log(`Sent message: ${message.content}`))
				.catch(console.error);
		}
		if(message.content.substr(5, message.content.indexOf(" ") - 5) == 'setOrderMatters'){
		    if (checkAdmin(message)) { return; }
			if(message.content.split(" ").pop() == 'true'){
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
		    if (checkAdmin(message)) { return; }
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
		    if (checkAdmin(message)) { return; }
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

	if (message.channel == raidChannel) {
	    console.log("RaidReqs: " + raidReqs);
	    console.log("RaidID: " + raidId);
	    console.log("RaidWild: " + raidWild);
	    console.log("Raidor: " + raidor);
		/*if(orderMatters){
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
							.then(dm => dm.send('@here is required somewhere in the lfg messages.', {disableEveryone:true,split:true,code:true}).then(message => console.log(`Sent message: ${message.content}`)).catch(console.error))
							.catch(console.error);
					}else{
						for(i = 0; i < raidReqs.length; i++){
							if(raidReqs[i].includes("*")){
								var req1 = raidReqs[i].substr(0, raidReqs.indexOf("*"));
								var req2 = raidReqs[i].split("*").pop();
								if(req1.charAt(0) == '~'){
									req1 = req1.substr(1);
								}
								if(req2.charAt(req2.length) == '~'){
									req2 = req2.slice(0, -1);
								}
								if(!message.content.includes(req1) || !message.content.includes(req2) || message.content.indexOf(req1) + req1.length != message.content.indexOf(req2) - 1){
									
								}
							}
						}
					}
				}
			}else{
				
			}
		}*/
	}
});

function setupReq(id) {
    switch (id) {
        case 'raid':
            if (raidReqs[raidReqs.length - 1].includes("||")) {
                for (i = 0; i < raidReqs[raidReqs.length - 1].split("||").length - 1; i++) {
                    raidor[raidReqs.length - 1][i] = raidReqs[raidReqs.length - 1].split("||");
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
                console.log("Position: " + getPosition(raidReqs[raidReqs.length - 1], '*', 0));
                console.log("Position + 1: " + getPosition(raidReqs[raidReqs.length - 1], '*', 1));
                if (raidor[raidReqs.length - 1][i].includes("*")) {
                    for (a = 0; a < raidor[raidReqs.length - 1][i].split("*").length - 1; a++) {
                        raidWild[raidReqs.length - 1][i][a] = getPosition(raidReqs[raidReqs.length - 1], '*', a);
                    }
                }
            }
            break;
    }
}

function getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
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
