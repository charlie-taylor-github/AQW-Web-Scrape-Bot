const { Client, PermissionFlagsBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
const findItemsController = require('./find-items-controller.js');
const helperRoleSetup = require('./helper-role-setup.js');
const config = require('../../config.js');


const client = new Client({
  intents: config.discordClientIntents,
  partials: config.discordClientPartials
});

const rest = new REST({ version: '9' })
  .setToken(process.env.DISCORD_BOT_TOKEN);

const commands = [
  new SlashCommandBuilder()
    .setName('find')
    .setDescription('Preview a list of all relevant AQW items')
    .setDMPermission(false)
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
    ),
  new SlashCommandBuilder()
    .setName('admin')
    .setDescription('Commands only available to admins')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
      option.setName('action')
        .setDescription('The command you would like to execute')
        .setRequired(true)
        .addChoices(
          { name: 'setup helper role', value: 'setup-helper-role' }
        )
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

  if (interaction.commandName === 'admin') {
    const options = interaction.options;
    let action = options.getString('action');

    if (action === 'setup-helper-role') {
      await helperRoleSetup.handleInteraction(interaction);
    }
  }
});


module.exports = async function () {
  try {
    helperRoleSetup.init(client);
    client.login(process.env.DISCORD_BOT_TOKEN);

    // await rest.put(
    //   Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID),
    //   { body: commands },
    // );
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID, '977220046017396737'),
      { body: commands },
    );

  } catch (error) {
    return { error: error.message };
  }
  return {};
}
