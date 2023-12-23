const { EmbedBuilder, ButtonStyle } = require('discord.js');
const { ButtonBuilder, ActionRowBuilder } = require('@discordjs/builders');
const config = require('../../config.js');


function getActionRow(session) {
  const nextButton = new ButtonBuilder()
    .setCustomId(`${session.id}.next`)
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(session.itemIndex + 1 >= session.totalResults)
    .setEmoji({ name: '▶️' });

  const nextJumpButton = new ButtonBuilder()
    .setCustomId(`${session.id}.nextjump`)
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(session.itemIndex + 10 >= session.totalResults)
    .setEmoji({ name: '⏩' });

  const previousButton = new ButtonBuilder()
    .setCustomId(`${session.id}.prev`)
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(session.itemIndex <= 0)
    .setEmoji({ name: '◀️' });

  const previousJumpButton = new ButtonBuilder()
    .setCustomId(`${session.id}.prevjump`)
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(session.itemIndex + 1 <= 10)
    .setEmoji({ name: '⏪' });

  return new ActionRowBuilder()
    .addComponents([previousJumpButton, previousButton, nextButton, nextJumpButton]);
}

async function getEmbed(session) {
  const item = await session.getCurrentItem();
  if (!item) {
    return new EmbedBuilder()
      .setTitle('No results found')
      .setColor(config.embedColor);
  }

  return new EmbedBuilder()
    .setTitle(item.name)
    .setDescription(`${session.itemIndex + 1} / ${session.totalResults}`)
    .setImage(item.img)
    .setColor(config.embedColor);
}

async function getMessage(session) {
  const embed = await getEmbed(session);
  const row = getActionRow(session);
  return {
    embeds: [embed], components: [row]
  }
}

function initInteraction(interaction, session, onNext, onPrevious, onNextJump, onPreviousJump) {
  let filter = i =>
    i.customId === `${session.id}.next`
    && i.user.id === interaction.user.id;
  let collector = interaction.channel.createMessageComponentCollector({ filter, time: 5 * 60 * 1000 });
  collector.on('collect', onNext);

  filter = i =>
    i.customId === `${session.id}.prev`
    && i.user.id === interaction.user.id;
  collector = interaction.channel.createMessageComponentCollector({ filter, time: 5 * 60 * 1000 });
  collector.on('collect', onPrevious);

  filter = i =>
    i.customId === `${session.id}.nextjump`
    && i.user.id === interaction.user.id;
  collector = interaction.channel.createMessageComponentCollector({ filter, time: 5 * 60 * 1000 });
  collector.on('collect', onNextJump);

  filter = i =>
    i.customId === `${session.id}.prevjump`
    && i.user.id === interaction.user.id;
  collector = interaction.channel.createMessageComponentCollector({ filter, time: 5 * 60 * 1000 });
  collector.on('collect', onPreviousJump);
}


module.exports = { initInteraction, getMessage };
