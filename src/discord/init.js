const { Client } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const findItemController = require('./find-items.js');
const helperRoleController = require('./helper-role.js');
const itemRequestController = require('./item-requests.js');
const itemSuggestionController = require('./item-suggestions.js');
const commands = require('./commands.js');
const config = require('../../config.js');

const client = new Client({
  intents: config.discordClientIntents,
  partials: config.discordClientPartials
});

const rest = new REST({ version: '9' })
  .setToken(process.env.DISCORD_BOT_TOKEN);

client.once('ready', () => {
  console.log(`${client.user.tag} is Online`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'find') {
    await findItemController.handleInteraction(interaction);
  }

  if (interaction.commandName === 'admin') {
    const options = interaction.options;
    let action = options.getString('action');

    if (action === 'setup-helper-role') {
      await helperRoleController.handleInteraction(interaction);
    }
  }

  if (interaction.commandName === 'request-item') {
    await itemRequestController.handleInteraction(interaction);
  }
});

module.exports = async function () {
  try {
    helperRoleController.init(client);
    itemSuggestionController.init(client);
    client.login(process.env.DISCORD_BOT_TOKEN);

    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID, '977220046017396737'),
      { body: commands },
    );

  } catch (error) {
    return { error: error.message };
  }
  return {};
}
