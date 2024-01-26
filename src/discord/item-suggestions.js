const { EmbedBuilder } = require('discord.js');
const config = require('../../config.js');
const servers = require('../database/servers.js');


function getValidItemRequestReference(msg, client) {
  if (msg.author.bot) return false;

  // ensure the message has a reference
  if (!msg.reference) return false;
  const channel = client.channels.cache.get(msg.reference.channelId);
  if (!channel) return false;
  const msgReference = channel.messages.cache.get(msg.reference.messageId);
  if (!msgReference) return false;

  // ensure it is referencing a item request
  if (msgReference.author.id != client.application.id) return false;
  const footerText = msgReference?.embeds[0]?.footer?.text;
  if (footerText != 'Reply to this message to make a suggestion') return false;
  return msgReference;
}

function getFormattedSuggestionMessage(msg, msgReference) {
  const embed = new EmbedBuilder()
    .setTitle(`${msg.author.username} Has Suggested an Item!`)
    .setDescription(`<@${msg.author.id}> <@${msgReference.interaction.user.id}>`)
    .setColor(config.embedColor);

  if (msg.content) {
    embed.addFields({
      name: 'Suggestion',
      value: msg.content
    });
  }

  const [attachment] = msg.attachments.values();

  if (attachment) {
    const attachmentUrl = attachment.attachment;
    embed.setImage(attachmentUrl);
  }

  return { embeds: [embed] };
}

function init(client) {
  client.on('messageCreate', async msg => {
    const msgReference = getValidItemRequestReference(msg, client);
    if (!msgReference) return;

    const { error, roleId } = await servers.getServerHelperRoleId(msg.guild.id);
    if (error | !roleId) return;

    msg.delete();
    const formattedMessage = getFormattedSuggestionMessage(msg, msgReference);
    msgReference.reply(formattedMessage);

    const hasRole = msg.member.roles.cache.some(role => role.id === roleId);
    if (hasRole) {
      console.log('user has the needed role');
    } else {
      msg.author.send(config.noHelperRoleMessage);
    }
  })
}

module.exports = { init };
