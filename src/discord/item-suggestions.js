const { EmbedBuilder } = require('discord.js');
const config = require('../../config.js');
const servers = require('../database/servers.js');
const itemRequests = require('../database/item-requests.js')


const errorMessage = {
  content: 'An error occured',
  embeds: []
};


async function getIsItemSuggestion(message, client) {
  if (message.author.bot) return false;
  if (!message.reference) return false;
  const channel = client?.channels?.cache?.get(message.reference.channelId);
  const messageReference = channel?.messages?.cache?.get(
    message.reference.messageId
  );
  if (!messageReference) return false;

  const { request, error
  } = await itemRequests.getByMessageId(messageReference.id);

  if (error || !request) return false;
  return messageReference;
}

function getFormattedSuggestionMessage(
  suggestUser, requestUser, content, attachment
) {
  const embed = new EmbedBuilder()
    .setTitle(`${suggestUser.username} Has Suggested an Item!`)
    .setDescription(`<@${suggestUser.id}> <@${requestUser.id}>`)
    .setColor(config.embedColor);

  if (content) {
    embed.addFields({
      name: 'Suggestion',
      value: content
    });
  }

  if (attachment) {
    embed.setImage(attachment);
  }

  return { embeds: [embed] };
}

function init(client) {
  client.on('messageCreate', async suggestMessage => {
    const requestMessage = await getIsItemSuggestion(suggestMessage, client);
    if (!requestMessage) return;

    if (requestMessage.interaction.user.id === suggestMessage.author.id) return;

    const { error, roleId } = await servers.getServerHelperRoleId(suggestMessage.guild.id);
    if (error | !roleId) return;

    suggestMessage.delete();

    const [attachmentObject] = suggestMessage.attachments.values();
    const attachment = attachmentObject?.attachment;

    const formattedMessage = getFormattedSuggestionMessage(
      suggestMessage.author, requestMessage.interaction.user,
      suggestMessage.content, attachment
    )

    const sentMessage = await requestMessage.reply(formattedMessage);
    const { error: dbError } = await itemRequests.addSuggestion(
      requestMessage.id, sentMessage.id, suggestMessage.author.id,
      attachment, suggestMessage.content
    );

    if (dbError) {
      sentMessage.delete();
      requestMessage.reply(errorMessage);
      return;
    }

    const hasRole = suggestMessage.member.roles.cache.some(role => role.id === roleId);
    if (!hasRole) {
      suggestMessage.author.send(config.noHelperRoleMessage);
    }
  })
}

module.exports = { init };
