const { Client } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
const findItemsController = require('./find-items-controller.js');
const config = require('../../config.js');


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
        .addChoices(
          { name: 'male', value: 'male' },
          { name: 'female', value: 'female' }
        )
    )
    .addStringOption(option =>
      option.setName('category')
        .setDescription('Filter the items by category')
        .setRequired(false)
        .addChoices(...config.validCategories.map(c => ({
          name: c, value: c
        })))
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

  if (interaction.commandName === 'find') {
    await findItemsController.handleInteraction(interaction);
  }
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