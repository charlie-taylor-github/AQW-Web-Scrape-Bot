const { EmbedBuilder } = require('discord.js');
const config = require('../../config.js');

function getEmbed() {
  return new EmbedBuilder()
    .setTitle(config.setupHelperRoleEmbed.title)
    .setDescription(config.setupHelperRoleEmbed.description)
    .setColor(config.embedColor);
}

async function handleInteraction(interaction) {
  const embed = getEmbed();
  await interaction.channel.send({ embeds: [embed] });
  await interaction.reply({ content: 'the helper role message has been sent!', ephemeral: true });
};


module.exports = { handleInteraction };
