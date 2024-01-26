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
  )

module.exports = [
  findCommand, adminCommand, requestItemCommand
].map(command => command.toJSON());
