console.log(`
   ____    _           _   
  / __ \\  | |         | |  
 | |  | | | |__   ___ | |_ 
 | |  | | | '_ \\ / _ \\| __|
 | |__| | | |_) | (_) | |_ 
 \\ ___\\_\\ |_.__/ \\___/ \\__|
`);

const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, Collection, GatewayIntentBits, EmbedBuilder, isJSONEncodable } = require('discord.js');
const { config } = require('dotenv');
const globalFunctions = require('./globalFunctions.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ],
});
console.log("LOG: \t" + "new client created");

config();

const TOKEN = process.env.TOKEN;
console.log("LOG: \t" + ".env loaded");

//===========================================================
//dynamically import all commands from commands folder
client.commands = new Collection();
client.voiceGenerator = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);

  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}
//===========================================================
client.on("ready", () => {
  console.log(`
=================================
  Q bot is ONLINE as ${client.user.tag}
=================================
  `);

  client.user.setActivity('Playing Valorant', {
    type: "STREAMING",
    url: "https://twitch.tv/tarik"
  });
});

client.login(TOKEN);

//==============start=================================================
let profileDone = false;

client.on("messageCreate", (message) => {
  if (!message.author.bot) {
    let today = new Date();
    let date = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date + " " + time;
    console.log(`${dateTime} \t Server: ${message.guild.name} \t Channel: ${message.channel.name} \t User: ${message.author.tag} \nMessage: ${message.content}`);
  }

  if (message.content === "/guild-id") {
    message.reply("Guild id: " + message.guild.id);
    console.log("Guild id: " + message.guild.id);
  }
});

//what happen when button is pressed
client.on('interactionCreate', async interaction => {

  //=============functions===============================

  function removeAllRoles() {
    let rolesToRemove = ["duo rank", "trio queue", "5 stack", "1v1", "10 mans", "unrated"];
    rolesToRemove.forEach(roleName => {
      let role = guild.roles.cache.find(role => role.name === roleName);
      interaction.member.roles.remove(role);
    });
    console.log("LOG: \t" + "remove all queue roles from player");
  }

  //=====================================================

  const { guild, member } = interaction;

  let dataFile = fs.readFileSync('data.json');
  let dataObj = JSON.parse(dataFile);

  let userInteracted = interaction.user.id;


  let playerList = dataObj.playerList;
  let duoList = dataObj.duoList;
  let trioList = dataObj.trioList;
  let fiveStackList = dataObj.fiveStackList;
  let oneVoneList = dataObj.oneVoneList;
  let tenMansList = dataObj.tenMansList;
  let playerQueueingInfo;
  let playerId = interaction.member.id;
  let player_is_in_queue;

  //loop through the playerList to check if player profile is done
  for (let i = 0; i < playerList.length; i++) {
    //if user interacted alrady set up player profile
    if (userInteracted === playerList[i].id) {
      playerQueueingInfo = playerList[i];

      //player profile must be done before queuing anyting
      if (interaction.commandName !== "player-profile") {
        profileDone = true;
      }
      break;
    }
  }

  //=========================interaction is button======================
  if (interaction.isButton()) {
    buttonPressed = interaction.customId;
    memberWhoPressed = interaction.user;
    console.log("LOG: \t" + `${memberWhoPressed.tag} clicked on (${buttonPressed})`);

    let isInQueue = interaction.member.roles.cache.some(role => role.name === "duo rank" || role.name === "trio queue" || role.name === "5 stack" || role.name === "1v1" || role.name === "10 mans" || role.name == "unrated");
    //if member is in queue remove any member with queuerole
    if (isInQueue) {
      removeAllRoles();
    }

    //update the embed

    let queueNotificationChannel = guild.channels.cache.find(c => c.name === "queue-notification");

    if (buttonPressed === "duoRankQueue") {
      for (let i = 0; i < duoList.length; i++) {
        //check if player is in duoList
        player_is_in_queue = (playerId === duoList[i]);
      }

      if (!player_is_in_queue) {
        //add role to member
        let duoQueueRole = guild.roles.cache.find(role => role.name === "duo rank");
        interaction.member.roles.add(duoQueueRole);

        //add playerQueueingInfo(player's discord id) to duoList
        duoList.push(playerQueueingInfo.id);

        await interaction.reply({ content: "You are in duo rank queue", ephemeral: true });
        console.log("LOG: \t" + "You are in duo rank queue");

        globalFunctions.writeToFile(dataObj, 'data.json');

        queueNotificationChannel.send(`${memberWhoPressed} is queueing for ${duoQueueRole}`);
        console.log("LOG: \t" + `${memberWhoPressed} is queueing for ${duoQueueRole}`);
        //if player 
      }
      else {
        await interaction.reply({ content: "You are already in queue", ephemeral: true });
        console.log()
      }

    } else if (buttonPressed === "trioRankQueue") {
      //add role to member
      let trioQueueRole = guild.roles.cache.find(role => role.name === "trio queue");
      interaction.member.roles.add(trioQueueRole);
      await interaction.reply(
        `
  ${memberWhoPressed} is queueing for trio
  (${trioQueueRole})
  `);

    } else if (buttonPressed === "fiveStackRankQueue") {
      //add role to member
      let fiveStackRole = guild.roles.cache.find(role => role.name === "5 stack");
      interaction.member.roles.add(fiveStackRole);
      await interaction.reply(
        `
  ${memberWhoPressed} is queueing for 5 stack
  (${fiveStackRole})
  `);

    } else if (buttonPressed === "oneVoneQueue") {
      //add role to member
      let oneVoneRole = guild.roles.cache.find(role => role.name === "1v1");
      interaction.member.roles.add(oneVoneRole);
      await interaction.reply(
        `
  ${memberWhoPressed} is queueing for 1v1
  (${oneVoneRole})
  `);

    } else if (buttonPressed === "tenMansQueue") {
      //add role to member
      let tenMansRole = guild.roles.cache.find(role => role.name === "10 mans");
      interaction.member.roles.add(tenMansRole);
      await interaction.reply(
        `
  ${memberWhoPressed} is queueing for 10 mans
  (${tenMansRole})
  `);

    } else if (buttonPressed === "unrated") {
      //add role to member
      let unratedRole = guild.roles.cache.find(role => role.name === "unrated");
      interaction.member.roles.add(unratedRole);
      await interaction.reply(
        `
  ${memberWhoPressed} is queueing for unrated
  (${unratedRole})
      `);

    } else if (buttonPressed === "dequeue") {
      let rolesToRemove = ["duo rank", "trio queue", "5 stack", "1v1", "10 mans", "unrated"];
      let memberIsInQueue = false;
      interaction.member.roles.cache.forEach(role => {
        //if player have queue roles
        if (rolesToRemove.includes(role.name)) {
          memberIsInQueue = true;
        }
      });

      if (memberIsInQueue) {
        let role = guild.roles.cache.find(role => role.name === 'duo rank');
        //if member have duo rank roles and if player id is in duoList
        if (interaction.member.roles.cache.has(role.id)) {
          //remove player id from duoList
          dataObj.duoList = duoList.filter(item => item !== playerId);
          globalFunctions.writeToFile(dataObj, 'data.json');
        }

        removeAllRoles();
        await interaction.reply({ content: "You have been removed from queue", ephemeral: true });
        console.log("LOG: \t" + "You have been removed from queue");

      } else {
        await interaction.reply({ content: "you're not in queue", ephemeral: true });
        console.log("LOG: \t" + "You have been removed from queue");
      }
    }
  }

  //=========================interaction is a command===========================
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.log(`No ${interaction.commandName} found`);
    return;
  }

  //if command is in queue channel
  if (interaction.channel.name === "queue") {
    //if commands are in queue channel then run the command
    if (profileDone) {
      try {
        await command.execute(interaction);
        console.log("interaction: /" + interaction.commandName);
      } catch (error) {
        console.log(error);
        await interaction.reply({ content: "Error executing command", ephemeral: true });
      }
      //if player profile is not done (use /player-profile)
    } else {
      await interaction.reply({ content: "Please use /player-profile to setup your info before queueing", ephemeral: true });
      console.log("Please use /player-profile to setup your info before queueing");
    }

    //if command is not in queue channel
  } else {
    //but use help and player profile command run it
    if (interaction.commandName === "help" || interaction.commandName === "player-profile") {
      try {
        await command.execute(interaction);
        console.log("interaction: /" + interaction.commandName);
      } catch (error) {
        console.log(error);
        await interaction.reply({ content: "Error executing command", ephemeral: true });
      }

      //if not in queue and using commands that are not permitted
    } else {
      let channelTag = guild.channels.cache.find(channel => channel.name === "queue");
      await interaction.reply({ content: `Please use / commands in ${channelTag}`, ephemeral: true });
      console.log("LOG: \t" + `Please use / commands in ${channelTag.name} channel`);
    }
  }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
  const { guild } = newState;
  let dataFile = fs.readFileSync('data.json');
  let dataObj = JSON.parse(dataFile);
  let customVoiceChannel = dataObj.customVoiceChannel;

  //if there are no custom voice channel
  if (customVoiceChannel.length !== 0) {
    for (let name of customVoiceChannel) {
      const channel = guild.channels.cache.find(c => c.name === name);

      //if all member left vc that is in custom vc
      if (channel && channel.members.size === 0) {
        //delete vc name in customVoiceChannel
        dataObj.customVoiceChannel = customVoiceChannel.filter(item => item !== oldState.channel.name);
        globalFunctions.writeToFile(dataObj, 'data.json');
        //delete vc
        oldState.channel.delete();
        console.log(`${oldState.channel.name} deleted`);
        break;
      }
    }
  }
});