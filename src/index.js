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
    GatewayIntentBits.MessageContent
  ],
});
console.log("LOG: \t new client created");

config();

const TOKEN = process.env.TOKEN;
console.log("LOG: \t .env loaded");

//===========================================================
//dynamically import all commands from commands folder
client.commands = new Collection();

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

//=====================================================================
//start
/*function writeToFile(data, file) {
  fs.writeFileSync(file, data);
}*/

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

  let dataFile = fs.readFileSync('data.json');
  let dataObj = JSON.parse(dataFile);

  let userInteracted = interaction.user.id;
  let canQueue = false;

  let playerList = dataObj.playerList;
  /*
 [
 {
   id: '691784137790717984',
   tag: 'mikrda#4890',
   region: 'sea',
   rank: 'R',
   riotId: 'me'
 },
 {
   id: '508402815157403668',
   tag: 'Leighton#5021',
   region: 'sea',
   rank: 'P3',
   riotId: 'AMIG R0adx#HK11'
 }
 ]
 */
  let duoList = dataObj.duoList;
  //an object
  console.log("duoList" + duoList);
  let trioList = dataObj.trioList;
  let fiveStackList = dataObj.fiveStackList;
  let oneVoneList = dataObj.oneVoneList;
  let tenMansList = dataObj.tenMansList;
  let playerQueueingInfo;
  let playerId = interaction.member.id;
  let player_is_in_queue;

  for (let i = 0; i < playerList.length; i++) {
    console.log(playerList[i].tag);

    //if user interacted alrady set up player info
    if (userInteracted === playerList[i].id) {
      playerQueueingInfo = playerList[i];
      console.log("LOG: \t" + "member can queue");
      canQueue = true;
      break;
    }
  }

  //if member can queue
  if (canQueue) {

    if (interaction.isButton()) {
      buttonPressed = interaction.customId;
      memberWhoPressed = interaction.user;
      console.log("button pressed: " + buttonPressed + " member who pressed: " + memberWhoPressed.tag);

      let isInQueue = interaction.member.roles.cache.some(role => role.name === "duo queue" || role.name === "trio queue" || role.name === "5 stack" || role.name === "1v1" || role.name === "10 mans" || role.name == "unrated");
      //if member is in queue remove any member with queuerole
      if (isInQueue) {
        let rolesToRemove = ["duo queue", "trio queue", "5 stack", "1v1", "10 mans", "unrated"];
        rolesToRemove.forEach(roleName => {
          let role = interaction.guild.roles.cache.find(role => role.name === roleName);
          interaction.member.roles.remove(role);
        });
      }
      //update the embed











      if (buttonPressed === "duoQueue") {
        for (let i = 0; i < duoList.length; i++) {
          player_is_in_queue = (playerId == duoList[i]);
        }

        if (!player_is_in_queue) {
          //add role to member
          interaction.channel.send({ content: "you are in queue", ephemeral: true });
          let duoQueueRole = interaction.guild.roles.cache.find(role => role.name === "duo queue");
          interaction.member.roles.add(duoQueueRole);

          //add playerQueueingInfo to duoList
          duoList.push(playerQueueingInfo.id);
          let data = JSON.stringify(dataObj, null, 2);
          globalFunctions.writeToFile(data, 'data.json');
          interaction.channel.send("duo queue list: " + duoList);
          await interaction.reply(
            `
${duoQueueRole} is queueing for duo
(${memberWhoPressed})
`);
        } else {
          await interaction.reply({ content: "You are already in queue", ephemeral: true });
          console.log()
        }























      } else if (buttonPressed === "trioQueue") {
        //add role to member
        let trioQueueRole = interaction.guild.roles.cache.find(role => role.name === "trio queue");
        interaction.member.roles.add(trioQueueRole);
        await interaction.reply(
          `
  ${memberWhoPressed} is queueing for trio
  (${trioQueueRole})
  `);

      } else if (buttonPressed === "fiveStackQueue") {
        //add role to member
        let fiveStackRole = interaction.guild.roles.cache.find(role => role.name === "5 stack");
        interaction.member.roles.add(fiveStackRole);
        await interaction.reply(
          `
  ${memberWhoPressed} is queueing for 5 stack
  (${fiveStackRole})
  `);

      } else if (buttonPressed === "oneVoneQueue") {
        //add role to member
        let oneVoneRole = interaction.guild.roles.cache.find(role => role.name === "1v1");
        interaction.member.roles.add(oneVoneRole);
        await interaction.reply(
          `
  ${memberWhoPressed} is queueing for 1v1
  (${oneVoneRole})
  `);

      } else if (buttonPressed === "tenMansQueue") {
        //add role to member
        let tenMansRole = interaction.guild.roles.cache.find(role => role.name === "10 mans");
        interaction.member.roles.add(tenMansRole);
        await interaction.reply(
          `
  ${memberWhoPressed} is queueing for 10 mans
  (${tenMansRole})
  `);

      } else if (buttonPressed === "unrated") {
        //add role to member
        let unratedRole = interaction.guild.roles.cache.find(role => role.name === "unrated");
        interaction.member.roles.add(unratedRole);
        await interaction.reply(
          `
  ${memberWhoPressed} is queueing for unrated
  (${unratedRole})
      `);

      } else if (buttonPressed === "dequeue") {
        let rolesToRemove = ["duo queue", "trio queue", "5 stack", "1v1", "10 mans", "unrated"];

        memberIsInQueue = interaction.channel.member.roles.cache.some(role => rolesToRemove.includes(role.name));
        console.log("memberIsInQueue: " + memberIsInQueue);

        if (memberIsInQueue) {
          rolesToRemove.forEach(roleName => {
            let role = interaction.guild.roles.cache.find(role => role.name === roleName);
            interaction.member.roles.remove(role);
          });
          await interaction.reply("You have been removed from queue");
          console.log("LOG: \t You have been removed from queue");

        } else {
          await interaction.channel.send("you're not in queue");

        }
      }
    }

    //if member can't queue
  } else {
    interaction.channel.send("Please use /player-info to setup your info before queueing");
    console.log("Please use /player-info to setup your info before queueing");
  }


});

client.on(Events.InteractionCreate, async interaction => {
  //if interaction is a command
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.log(`No ${interaction.commandName} found`);
    return;
  }

  try {
    await command.execute(interaction);
    console.log("interaction: " + interaction.commandName);
  } catch (error) {
    console.log(error);
    await interaction.reply({ content: "Error executing command", ephemeral: true });
  }
});