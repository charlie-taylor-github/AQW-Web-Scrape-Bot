const { EmbedBuilder } = require('discord.js');
const servers = require('../database/servers.js');
const config = require('../../config.js');


function getEmbed() {
  return new EmbedBuilder()
    .setTitle(config.setupHelperRoleEmbed.title)
    .setDescription(config.setupHelperRoleEmbed.description)
    .setColor(config.embedColor);
}

async function validateToggleHelperRole(reaction, user) {
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (e) { return { error: e.message } }
  }
  if (user.bot) return { valid: false };
  const botId = process.env.DISCORD_APPLICATION_ID;
  const isBotMessage = reaction.message.author.id == botId;
  const messageEmbed = reaction.message.embeds[0];
  const getRoleEmbed = config.setupHelperRoleEmbed
  const isGetRoleMessage = (
    messageEmbed.title == getRoleEmbed.title
    && messageEmbed.description == getRoleEmbed.description
  );

  if (!(isBotMessage && isGetRoleMessage)) return { valid: false };
  return { valid: true };
}

async function handleInteraction(interaction) {
  const embed = getEmbed();
  const message = await interaction.channel.send({ embeds: [embed] });
  await interaction.reply({ content: 'the helper role message has been sent!', ephemeral: true });
  message.react(config.setupHelperRoleEmbed.reactEmoji);
};

function init(client) {
  client.on('messageReactionAdd', async (reaction, user) => {
    const { error, valid } = await validateToggleHelperRole(reaction, user);
    if (error || !valid) return;
    const member = reaction.message.guild.members.cache.find(m => m.id == user.id);
    const { error: dbError, roleId } = await servers.getServerHelperRoleId(
      reaction.message.guild.id
    );
    if (dbError || !roleId) return;
    member.roles.add(roleId);
  });

  client.on('messageReactionRemove', async (reaction, user) => {
    const { error, valid } = await validateToggleHelperRole(reaction, user);
    if (error || !valid) return;
    const member = reaction.message.guild.members.cache.find(m => m.id == user.id);
    const { error: dbError, roleId } = await servers.getServerHelperRoleId(
      reaction.message.guild.id
    );
    if (dbError || !roleId) return;
    member.roles.remove(roleId);
  });
}


module.exports = { init, handleInteraction };
