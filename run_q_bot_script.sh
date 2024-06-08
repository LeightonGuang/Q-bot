#!/bin/bash
export QT_QPA_PLATFORM=xcb

# discordjs path
discordJsPath="/home/lg/Documents/github/Q-bot/dist"
# database path
databasePath="/home/lg/Documents/github/Q-bot-api/dist"

# command to start node server
node_command="node index.js"

echo "running api for Q bot"&
konsole --new-tab -e "bash -c 'cd $databasePath; $node_command'" &

echo "running discord.js"
cd $discordJsPath
$node_command