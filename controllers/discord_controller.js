const { Client } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
const ItemsSession = require('../controllers/items_controller.js');
const { initInteraction, getMessage } = require('../src/discord_utils.js');
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

client.once('ready', () => {
  console.log(`${client.user.tag} is Online`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  const { commandName, options } = interaction;
  if (commandName !== 'find') return;

  const category = options.getString('category') || '';
  const tags = options.getString('tags') || '';
  const session = new ItemsSession(category, tags);
  await session.init();

  const message = await getMessage(session);
  await interaction.reply(message);

  async function onNext(i) {
    session.increaseCurrentItemIndex(10);
    const message = await getMessage(session);
    await i.update(message);
  }

  async function onPrevious(i) {
    session.increaseCurrentItemIndex(-10);
    const message = await getMessage(session);
    await i.update(message);
  }

  initInteraction(interaction, onNext, onPrevious);
});

async function init() {
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

module.exports = { init };
