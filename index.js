const Tail = require('tail').Tail;
const fs = require('fs');
const config = require('./config.json');

const Discord = require('discord.js');

const stats = JSON.parse(fs.readFileSync('./stats.json'));

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content === '!stats') {
        const deathStats = Object.keys(stats.deaths).map((player) => `${player}: ${stats.deaths[player]}`);
        let text = '```Deaths:\n'
        text += deathStats.join('\n');
        text += '\n\nRockets launched: ' + stats.launches + '```';
        msg.channel.send(text);
    }
});

client.login(config.discordToken).then(() => {
    client.user.setActivity('you die', { type: 'WATCHING' })
})

tail = new Tail(config.logfile);

tail.on("line", function (data) {
    if (data.startsWith('FDDLOGGER:')) {
        console.log(data);
        if (data.includes("Player ")) {
            const player = data.split("Player ")[1].split(" ")[0]
            addDeath(player)
        } else {
            console.log(data);
            // Rocket launched
            addLaunch();
        }
    };
});

tail.on("error", function (error) {
    console.log('ERROR: ', error);
});

function addLaunch() {
    console.log("Added rocket launch")
    stats.launches = stats.launches + 1;
    saveStats();
}

function addDeath(player) {
    console.log(stats.deaths, player)
    console.log("deds", stats.deaths[player])
    if (stats.deaths[player] !== undefined) {
        stats.deaths[player] = stats.deaths[player] + 1;

    } else {
        stats.deaths[player] = 1;
    }
    console.log("added death for ", player);
    console.log("Current deaths", stats.deaths)
    saveStats();
    client.channels.cache.get(config.textChannel).send(`Player ${player} has died! That's already ${stats.deaths[player]} time(s)`)
}

function saveStats() {
    fs.writeFileSync('./stats.json', JSON.stringify(stats, null, 2));
}

console.log("Launched bridge")
