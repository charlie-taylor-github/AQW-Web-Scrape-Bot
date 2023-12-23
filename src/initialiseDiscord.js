const { Client } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
const ItemsSession = require('./ItemsSession.js');
const { initInteraction, getMessage } = require('./controllers/discord_controller.js');
const config = require('../config.js');


const client = new Client({
  intents: config.discordClientIntents
});

const rest = new REST({ version: '9' })
  .setToken(process.env.DISCORD_BOT_TOKEN);

const commands = [
  new SlashCommandBuilder()
    .setName('find')
    .setDescription('Preview a list of all relevant AQW items')
    .addStringOption(option =>
      option.setName('gender')
        .setDescription('Filter the items by gender: male or female')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('category')
        .setDescription('Filter the items by category')
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName('tags')
        .setDescription('Filter the items with tags')
        .setRequired(false)
    )
].map(command => command.toJSON());

async function handleInteraction(interaction) {
  if (!interaction.isCommand()) return;
  const { commandName, options } = interaction;
  if (commandName !== 'find') return;
  await interaction.reply('Loading...');

  let gender = options.getString('gender') || 'male';
  if (!['male', 'female'].includes(gender)) gender = 'male';
  const category = options.getString('category') || '';
  const tags = options.getString('tags') || '';
  const session = new ItemsSession(gender, category, tags);
  await session.init();

  const message = await getMessage(session);
  await interaction.editReply(message);

  async function onNext(i) {
    try {
      session.increaseCurrentItemIndex(1);
      const message = await getMessage(session);
      await i.update(message);
    } catch (e) {
      console.log('error occured');
    }
  }

  async function onNextJump(i) {
    try {
      session.increaseCurrentItemIndex(10);
      const message = await getMessage(session);
      await i.update(message);
    } catch (e) {
      console.log('error occured');
    }
  }

  async function onPrevious(i) {
    try {
      session.increaseCurrentItemIndex(-1);
      const message = await getMessage(session);
      await i.update(message);
    } catch (e) {
      console.log('error occured');
    }
  }

  async function onPreviousJump(i) {
    try {
      session.increaseCurrentItemIndex(-10);
      const message = await getMessage(session);
      await i.update(message);
    } catch (e) {
      console.log('error occured');
    }
  }

  initInteraction(interaction, session, onNext, onPrevious, onNextJump, onPreviousJump);
}


client.once('ready', () => {
  console.log(`${client.user.tag} is Online`);
});

client.on('interactionCreate', async interaction => {
  await handleInteraction(interaction);
});


module.exports = async function () {
  try {
    client.login(process.env.DISCORD_BOT_TOKEN);
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID),
      { body: commands },
    );
  } catch (error) {
    return { error: error.message };
  }
  return {};
}
