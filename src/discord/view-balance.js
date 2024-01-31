const { EmbedBuilder } = require('discord.js');
const servers = require('../database/servers.js');
const balances = require('../database/balances.js');
const config = require('../../config.js');


const errorMessage = {
  content: 'An error occured.',
  embeds: [],
  ephemeral: true
};

const noRoleMessage = {
  content: 'You don\'t have the required role.',
  embeds: [],
  ephemeral: true
};


function getMessage(balance, username, image) {
  const embed = new EmbedBuilder()
    .setTitle(`${balance} ${config.currencyName}`)
    .setDescription('Your current balance')
    .setFooter({ iconURL: image, text: username })
    .setColor(config.embedColor)

  return { embeds: [embed] };
}

async function handleInteraction(interaction) {
  const { error: getRoleError, roleId
  } = await servers.getServerHelperRoleId(interaction.guild.id);
  if (getRoleError || !roleId) interaction.reply(errorMessage);

  const hasRole = interaction.member.roles.cache.some(role => role.id === roleId);
  if (!hasRole) return interaction.reply(noRoleMessage);

  const { error: getBalanceError, balance
  } = await balances.getBalance(interaction.user.id);
  if (getBalanceError || balance == null) return interaction.reply(errorMessage);

  const username = interaction.user.username;
  const image = interaction.user.displayAvatarURL();

  interaction.reply(getMessage(balance, username, image));
}


module.exports = { handleInteraction };
