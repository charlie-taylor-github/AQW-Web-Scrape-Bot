const { IntentsBitField } = require('discord.js');

module.exports = {
  invalidImageUrls: [
    'http://aqwwiki.wdfiles.com/local--files/image-tags/acsmall.png',
    'http://aqwwiki.wdfiles.com/local--files/image-tags/aclarge.png',

    'http://aqwwiki.wdfiles.com/local--files/image-tags/raresmall.png',
    'http://aqwwiki.wdfiles.com/local--files/image-tags/rarelarge.png',

    'http://aqwwiki.wdfiles.com/local--files/image-tags/legendsmall.png',
    'http://aqwwiki.wdfiles.com/local--files/image-tags/legendlarge.png',

    'http://aqwwiki.wdfiles.com/local--files/image-tags/Sword_Table.png',
    'http://aqwwiki.wdfiles.com/local--files/image-tags/Helmet_table.png',
    'http://aqwwiki.wdfiles.com/local--files/image-tags/membersmall.png'
  ],
  itemsPerPage: 50,
  discordClientIntents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
  ],
  embedColor: '#E4A023',
  validCategories: [
    'Armors',
    'Capes & Back Items',
    'Classes',
    'Enhancements',
    'Grounds',
    'Helmets & Hoods',
    'Houses',
    'Floor Items',
    'Wall Items',
    'Misc. Items',
    'Use Items',
    'Necklaces',
    'Pets'
  ]
};
