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
const { Client, Events, Collection, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { config } = require('dotenv');

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

let duoList = [];
let trioList = [];
let fiveStackList = [];
let oneVoneList = [];
let tenMansList = [];

let queueIsEmpty = [duoList, trioList, fiveStackList, oneVoneList, tenMansList].every(list => list.length === 0);

const inQueueEmbed = new EmbedBuilder()
  .setAuthor({ name: "Q bot" })
  .setTitle("Queue")
  .setDescription("Status")
  /*.addFields(
    { name: "duo", value: duoList },
    { name: "trio", value: trioList },
    { name: "5 stack", value: fiveStackList },
    { name: "1v1", value: oneVoneList },
    { name: "10 mans", value: tenMansList },
  )*/
  .setTimestamp()

//what happen when button is pressed
client.on('interactionCreate', async interaction => {

  if (interaction.isButton()) {
    interaction.channel.send({
      embeds: [inQueueEmbed]
    });
    buttonPressed = interaction.customId;
    memberWhoPressed = interaction.user;
    console.log("button pressed: " + buttonPressed + " member who pressed: " + memberWhoPressed.tag);

    /*if (queueIsEmpty) {
      await interaction.channel.send({
        embeds: ([emptyQueueEmbed]),
        components: [buttonRow1, buttonRow2]
      });

    } else {
      await interaction.channel.send({
        embeds: ([inQueueEmbed]),
        components: [buttonRow1, buttonRow2]
      });
    }*/

    let isInQueue = interaction.member.roles.cache.some(role => role.name === "duo queue" || role.name === "trio queue" || role.name === "5 stack" || role.name === "1v1" || role.name === "10 mans" || role.name == "unrated");
    //if member is in queue remove any member with queuerole
    if (isInQueue) {
      let rolesToRemove = ["duo queue", "trio queue", "5 stack", "1v1", "10 mans", "unrated"];
      rolesToRemove.forEach(roleName => {
        let role = interaction.guild.roles.cache.find(role => role.name === roleName);
        interaction.member.roles.remove(role);
      });
    }

    if (buttonPressed === "duoQueue") {
      //add role to member
      let duoQueueRole = interaction.guild.roles.cache.find(role => role.name === "duo queue");
      interaction.member.roles.add(duoQueueRole);
      duoList.push(memberWhoPressed);
      interaction.channel.send("duo queue list: " + duoList);
      await interaction.reply(
        `
${duoQueueRole} is queueing for duo
(${memberWhoPressed})
`);

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
      //let roleList = ["duoList", "trioList", "fiveStackList", "oneVoneList", "tenMansList"];

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