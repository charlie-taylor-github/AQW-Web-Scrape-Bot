const { EmbedBuilder } = require('discord.js');
const servers = require('../database/servers.js');
const itemRequests = require('../database/item-requests.js');
const balances = require('../database/balances.js');
const config = require('../../config.js');


const invalidLinkMessage = {
  content: 'Invalid suggestion message link!',
  ephemeral: true
};
const errorMessage = {
  content: 'An error occurred.',
  ephemeral: true
};
const invalidRaterMessage = {
  content: 'You can only rate a suggestion for your request.',
  ephemeral: true
};
const noHelperRoleMessage = {
  content: 'The person that made the suggestion doesn\'t have the right role.',
  ephemeral: true
};
const existingRatingMessage = {
  content: 'You can only rate one suggestion from any particular person.',
  ephemeral: true
};

async function extractValidMessage(messageLink, channel) {
  const validLink = messageLink.match(/https:\/\/discord.com\/channels\/\d+\/\d+\/(\d+)/);
  if (!validLink) return;
  const [, messageId] = validLink;
  if (!messageId) return;
  const message = await channel.messages.fetch(messageId);
  if (!message) return;
  return message;
}

async function getSuggestUserWithValidRole(guild, suggestMessage) {
  const { error: fetchRoleError, roleId
  } = await servers.getServerHelperRoleId(guild.id);
  if (fetchRoleError || !roleId) return { error: 'fetch role error' };

  const { userId: suggesterId, error: fetchSuggesterError
  } = await itemRequests.getSuggestUserIdBySuggestMessageId(suggestMessage.id);
  if (fetchSuggesterError || !suggesterId) return { error: 'fetch suggester error' };

  const suggestUser = await guild.members.cache.get(suggesterId);
  if (!suggestUser) return { error: 'suggest user not found' };

  const hasRole = suggestUser.roles.cache.some(r => r.id === roleId);
  return { suggestUser, hasRole };
}

async function ensureRatingIsValid(interaction) {
  // valid message link
  const suggestMessageLink = interaction.options.getString('suggestion-message');
  const suggestMessage = await extractValidMessage(
    suggestMessageLink, interaction.channel
  );
  if (!suggestMessage) return { errorMessage: invalidLinkMessage };

  // message link is to a valid suggestion
  const { error: fetchRequestError, request
  } = await itemRequests.getBySuggestionMessageId(suggestMessage.id);
  if (fetchRequestError) return { errorMessage };
  if (!request) return { errorMessage: invalidLinkMessage };

  // interaction user is the original request sender
  if (!suggestMessage.reference) return { errorMessage };
  const requestMessage = await interaction.channel.messages.fetch(suggestMessage.reference.messageId);
  if (!requestMessage) return { errorMessage };
  const isOriginalSender = requestMessage.interaction.user.id === interaction.member.id
  if (!isOriginalSender) return { errorMessage: invalidRaterMessage };

  // the suggester has the right role
  const { error, suggestUser, hasRole
  } = await getSuggestUserWithValidRole(interaction.guild, suggestMessage);
  if (error || !suggestUser) return { errorMessage };
  if (!hasRole) return { errorMessage: noHelperRoleMessage };

  // the suggester hasnt been rated for the same request
  const { error: fetchRatingError, existingRating
  } = await itemRequests.getExistingRating(requestMessage.id, suggestUser.id);
  if (fetchRatingError) return { errorMessage };
  if (existingRating) return { errorMessage: existingRatingMessage };
  return {
    requestMessage, suggestMessage,
    suggestUser: suggestUser.user, requestUser: requestMessage.interaction.user
  };
}

async function handleInteraction(interaction) {
  const { errorMessage, requestMessage,
    suggestMessage, suggestUser, requestUser
  } = await ensureRatingIsValid(interaction);
  if (errorMessage) return interaction.reply(errorMessage);

  const rating = interaction.options.getInteger('rating');

  const { error: rateError
  } = await itemRequests.rateSuggestion(
    requestMessage.id, suggestMessage.id, rating
  );
  if (rateError) return interaction.reply(errorMessage);

  const currency = config.currencyAwardedForRating[rating];

  const { error: balanceError, balance: newBalance } = await balances.addToBalance(
    suggestUser.id, currency
  );
  if (balanceError || newBalance == null) return interaction.reply(errorMessage);

  const embed = new EmbedBuilder()
    .setTitle(`${requestUser.username} gave ${suggestUser.username} a ${rating} star rating!\n`)
    .setDescription(`${suggestUser.username} recieved ${currency} ${config.currencyName}`)
    .setColor(config.embedColor);
  interaction.reply({ embeds: [embed] });
}


module.exports = { handleInteraction };
