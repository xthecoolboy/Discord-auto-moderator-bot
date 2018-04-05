var config = {};

config.defaultCmds = ['modB!', 'addReqs', 'rmReqs', 'listReqs', 'addAdminRole', 'rmAdminRole', 'setHereRequired', 'setCmd', 'commands', 'setDefault', 'replaceReqs'];
config.defaultRaidReqs = [new RegExp('LF[1-5]M|LFG', 'i'), new RegExp('prestige|prest|prest.|normal|anything', 'i'), new RegExp('levi|leviathan|raid|eow|lair|raid lair', 'i'), new RegExp('https://discord.gg/|CR[1-4]', 'i')];
config.defaultCrucibleReqs = [new RegExp('LF[1-4]M|LFG', 'i'), new RegExp('trials|crucible|pvp|quickplay|quick|anything', 'i'), new RegExp('https://discord.gg/|CC[1-5]', 'i')];
config.defaultPveReqs = [new RegExp('LF[1-5]M|LFG', 'i'), new RegExp('prestige|prest|prest.|normal|anything', 'i'), new RegExp('nf|nightfall|anything|rat king|public event|', 'i'), new RegExp('https://discord.gg/|CS[1-4]', 'i')];

config.defaultAdminRoles = ['LEADERSHIP'];

config.defaultHereRequired = false;

config.defaultRaidChannel = "lfg-raid";
config.defaultCrucibleChannel = "lfg-crucible";
config.defaultPveChannel = "lfg-pve";
config.defaultQuestionsChannel = "lfg-questions";

module.exports = config;