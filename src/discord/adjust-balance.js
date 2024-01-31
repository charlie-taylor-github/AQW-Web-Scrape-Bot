const balances = require('../database/balances.js');


const errorMessage = {
  content: 'An error occured.',
  embeds: [],
  ephemeral: true
};
const insufficientBalanceMessage = {
  content: 'The user\'s balance is not high enough.',
  embeds: [],
  ephemeral: true
};
const successMessage = {
  content: 'Balance was successfully adjusted.',
  embeds: [],
  ephemeral: true
};


async function handleInteraction(interaction) {
  const adjustUser = interaction.options.getUser('user');
  const amount = interaction.options.getInteger('amount');

  const { error: fetchError, balance
  } = await balances.getBalance(adjustUser.id);
  if (fetchError || balance == null) return interaction.reply(errorMessage);

  if (balance + amount < 0) return interaction.reply(insufficientBalanceMessage);

  const { error: adjustError, balance: newBalance
  } = await balances.addToBalance(adjustUser.id, amount);

  if (adjustError || newBalance == null) return interaction.reply(errorMessage);

  interaction.reply(successMessage);
}


module.exports = { handleInteraction };
