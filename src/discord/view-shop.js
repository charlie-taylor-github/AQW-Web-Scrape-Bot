const { EmbedBuilder } = require('discord.js');
const config = require('../../config.js');


async function handleInteraction(interaction) {
  const shopItems = config.shopItems;

  const embed = new EmbedBuilder()
    .setTitle('Shop')
    .setColor(config.embedColor)
    .setImage(config.shopImage)
    .setDescription('Here are all the items available for purchase');

  for (const shopItem of shopItems) {
    embed.addFields({
      name: `${shopItem.name} - ${shopItem.price} ${config.currencyName}`,
      value: shopItem.description
    });
  }

  interaction.reply({ embeds: [embed] });
};


module.exports = { handleInteraction };
