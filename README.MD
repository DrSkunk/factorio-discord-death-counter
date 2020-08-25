# Factorio Discord Death Counter

Announce the death of a player in a Discord channel. Bonus: Track the amount of rockets launched.

![Bot message: Player wh1tebird has died! That's already 1 time(s)](https://i.imgur.com/q7SlwnV.png)

![!stats output](https://i.imgur.com/HlY7hN0.png)
## Prerequisites

### Node.js

This project is made with Node.js. You can download and install it from the [offical website](https://nodejs.org/en/).

After installation, both `node` and `npm` binaries should be accessible from path.

_**Note:** Currently this bot must be hosted on the same server as the Factorio server._

### Factorio logging

Factorio doesn't log the deaths of players. To do so I wrote a small mod based on [this Reddit comment](https://www.reddit.com/r/factorio/comments/6pqfxq/is_there_a_way_to_have_deaths_in_multiplayer/dkrpwv4/).

In order to install the mod you must first create a savefile. Then unzip the savefile and open`control.lua`.

It should contain the following: 
```lua
local handler = require("event_handler")
handler.add_lib(require("freeplay"))
handler.add_lib(require("silo-script"))
```

Replace the contents with this:

```lua
local handler = require("event_handler")
handler.add_lib(require("freeplay"))
handler.add_lib(require("silo-script"))

local function log_message(msg)
	print ("FDDLOGGER: " .. msg)
end

local function log_player_message(event, msg_in)
	local msg = "Player " .. game.players[event.player_index].name .. " " .. msg_in
	log_message (msg)
end

script.on_event(defines.events.on_player_died,			function(event) log_player_message(event, "died") end)
script.on_event(defines.events.on_rocket_launched,		function(event) log_message("A rocket was launched") end)
```

This adds the player deaths and rocket launches to the printed output of the server. But unfortunately it doesn't log to the default `factorio-current.log`.

In order to be readable by the bot we need to create or own logfile. With Blackjack. And hookers.

In order to do that you need to output your server output to a file with ` 2>&1 | tee log-all`. If this is your startup command:

```/opt/factorio/main/bin/x64/factorio --start-server-load-latest --server-settings /opt/factorio/main/data/server-settings.json```

Then it becomes this.

```/opt/factorio/main/bin/x64/factorio --start-server-load-latest --server-settings /opt/factorio/main/data/server-settings.json 2>&1 | tee log-all```

## Installation

Clone the project and `cd` into newly cloned directory. Then run `npm install` from your command line. This will install the necessary libraries.

Copy `config.example.json` to `config.json` and populate the entries:
- `logfile`: path to logfile above, like `/opt/factorio/main/log-all`
- `discordToken`: Put your token here, you can follow the instructions to get it [here](https://www.writebots.com/discord-bot-token/).
- `textChannel`: The ID of your Discord text channel. You need Discord developer mode enabled to find it.

![Copy ID of text channel](https://i.imgur.com/mXppqKZ.png)

## Run the program

Run the command `npm start` in the directory of the cloned project and all should be good! You can then add the bot to your server:

- Go to the [Discord developer portal]https://discord.com/developers/()
- Select your application 
- Select OAuth2
- Select the `bot` permission
- Copy and paste the link to add the bot to your server.

![Generate link](https://i.imgur.com/5StHNC4.png)

## Use the bot

The bot will automatically announce a death of the player like so:
![Bot message: Player wh1tebird has died! That's already 1 time(s)](https://i.imgur.com/q7SlwnV.png)

You can enter the command `!stats` to get an overview of all deaths and rockets launched.

![!stats output](https://i.imgur.com/HlY7hN0.png)

## Thing doesn't work, halp

That's quite likely, this project is the result of a few hours of coding because I wanted to do something fun for the 1.0 release of Factorio. You can submit your bugs to the [GitHub issue tracker](https://github.com/DrSkunk/factorio-discord-death-counter/issues) and I'll take a look!

Enjoy!