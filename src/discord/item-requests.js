const { EmbedBuilder } = require('discord.js');
const servers = require('../database/servers.js');
const itemRequests = require('../database/item-requests.js');
const config = require('../../config.js');


const errorMessage = {
  content: 'An error occured.',
  ephemeral: true, embeds: []
};
const wrongChannelMessage = {
  content: `Sorry, but this isn't the right channel for item requests.`,
  ephemeral: true, embeds: []
}


async function getMessage(guildId, user, image, description = null) {
  const { error, roleId } = await servers.getServerHelperRoleId(guildId);
  if (error || !roleId) return errorMessage;

  const embed = new EmbedBuilder()
    .setTitle(`${user.username} Has Requested an Item!`)
    .setDescription(`<@${user.id}>, <@&${roleId}>`)
    .setImage(image)
    .setColor(config.embedColor)
    .setFooter({
      text: `Reply to this message to make a suggestion`
    });

  if (description) embed.addFields({
    name: 'Description',
    value: description
  });

  return { embeds: [embed] };
}

async function getCorrectChannel(interaction) {
  const { error, channelId } = await servers.getServerItemRequestsChannelId(
    interaction.guild.id
  );
  if (error || !channelId) return false;
  return channelId == interaction.channel.id;
}

async function handleInteraction(interaction) {
  const correctChannel = await getCorrectChannel(interaction);
  if (!correctChannel) return interaction.reply(wrongChannelMessage);

  const guildId = interaction.guild.id;
  const user = interaction.user;
  const image = interaction.options.getAttachment('image').url;
  const description = interaction.options.getString('description');

  const messageObject = await getMessage(guildId, user, image, description);
  await interaction.reply(messageObject);
  const message = await interaction.fetchReply();

  const { error: dbError } = await itemRequests.create(
    guildId, message.id, user.id, image, description);

  if (dbError) await interaction.editReply(errorMessage);
}

module.exports = { handleInteraction };
