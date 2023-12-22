const { EmbedBuilder, ButtonStyle } = require('discord.js');
const { ButtonBuilder, ActionRowBuilder } = require('@discordjs/builders');
const config = require('../config.js');

function getActionRow(session) {
  const nextButton = new ButtonBuilder()
    .setCustomId(`${session.id}.next`)
    .setStyle(ButtonStyle.Secondary)
    .setEmoji({ name: '▶️' });

  const previousButton = new ButtonBuilder()
    .setCustomId(`${session.id}.prev`)
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(session.itemIndex <= 0)
    .setEmoji({ name: '◀️' });

  return new ActionRowBuilder()
    .addComponents([previousButton, nextButton]);
}

function getEmbed(item) {
  return new EmbedBuilder()
    .setTitle(item.name)
    .setImage(item.img)
    .setColor(config.embedColor);
}

async function getMessage(session) {
  const item = await session.getCurrentItem();
  const embed = getEmbed(item);
  const row = getActionRow(session);
  return {
    embeds: [embed], components: [row]
  }
}

function initInteraction(interaction, session, onNext, onPrevious) {
  let filter = i =>
    i.customId === `${session.id}.next`
    && i.user.id === interaction.user.id;
  let collector = interaction.channel.createMessageComponentCollector({ filter, time: 120 * 1000 });
  collector.on('collect', onNext);

  filter = i =>
    i.customId === `${session.id}.prev`
    && i.user.id === interaction.user.id;
  collector = interaction.channel.createMessageComponentCollector({ filter, time: 120 * 1000 });
  collector.on('collect', onPrevious);
}

module.exports = { initInteraction, getMessage };
