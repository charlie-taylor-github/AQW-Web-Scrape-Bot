const { EmbedBuilder } = require('discord.js');
const servers = require('../database/servers.js');
const config = require('../../config.js');

async function getMessage(guildId, user, image, description = null) {
  const { error, roleId } = await servers.getServerHelperRoleId(guildId);
  if (error || !roleId) return { content: 'An error occured.', ephemeral: true };

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

async function handleInteraction(interaction) {
  const { error, channelId } = await servers.getServerItemRequestsChannelId(
    interaction.guild.id
  );
  if (error) return interaction.reply(
    { content: 'An error occured.', ephemeral: true }
  );

  if (channelId != interaction.channel.id) return interaction.reply(
    {
      content: `Sorry, but this isn't the right channel for item requests.`,
      ephemeral: true
    }
  );

  const guildId = interaction.guild.id;
  const user = interaction.user;
  const image = interaction.options.getAttachment('image').url;
  const description = interaction.options.getString('description');

  const message = await getMessage(guildId, user, image, description);
  await interaction.reply(message);
}

module.exports = { handleInteraction };
