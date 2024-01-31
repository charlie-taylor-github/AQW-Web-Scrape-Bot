const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const config = require('../../config.js');

const findCommand = new SlashCommandBuilder()
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
  );

const adminCommand = new SlashCommandBuilder()
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
  );

const adjustBalanceCommand = new SlashCommandBuilder()
  .setName('adjust-balance')
  .setDescription('Adjust the balance of a user')
  .setDMPermission(false)
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addUserOption(option =>
    option.setName('user')
      .setDescription('The user who\'s balance will be adjusted')
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option.setName('amount')
      .setDescription('The amount to adjust the balance by (+tive or -tive')
      .setRequired(true)
  );

const requestItemCommand = new SlashCommandBuilder()
  .setName('request-item')
  .setDescription('Request item recommendations')
  .setDMPermission(false)
  .addAttachmentOption(option =>
    option.setName('image')
      .setDescription('An image that may be useful for making a recommendation')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('description')
      .setDescription('Optional description to further explain what kind of item you are looking for')
      .setRequired(false)
  );

const rateSuggestionCommand = new SlashCommandBuilder()
  .setName('rate-suggestion')
  .setDescription('Rate an item suggestion that someone made for you')
  .setDMPermission(false)
  .addStringOption(option =>
    option.setName('suggestion-message')
      .setDescription(
        'a Message Link to the suggestion that you would like to rate'
      )
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option.setName('rating')
      .setDescription('A number from 1 (low) to 5 (high)')
      .setRequired(true)
      .addChoices(
        { name: '1', value: 1 },
        { name: '2', value: 2 },
        { name: '3', value: 3 },
        { name: '4', value: 4 },
        { name: '5', value: 5 }
      )
  );

const balanceCommand = new SlashCommandBuilder()
  .setName('balance')
  .setDescription('View your balance')
  .setDMPermission(false);

const viewShopCommand = new SlashCommandBuilder()
  .setName('view-shop')
  .setDescription('View the shop')
  .setDMPermission(false);


module.exports = [
  findCommand, adminCommand, requestItemCommand,
  rateSuggestionCommand, balanceCommand, adjustBalanceCommand,
  viewShopCommand
].map(command => command.toJSON());
