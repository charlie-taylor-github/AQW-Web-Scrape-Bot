const { IntentsBitField, Partials } = require('discord.js');

module.exports = {

  // Client Setup
  discordClientIntents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessageReactions
  ],
  discordClientPartials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.User
  ],

  // User Interface
  embedColor: '#E4A023',
  setupHelperRoleEmbed: {
    title: 'Become a Helper!',
    description: 'React to this message to get the special helper role.',
    reactEmoji: '✅'
  },
  noHelperRoleMessage: `You don't have the right role to earn currency from your item suggestion`,

  // Find Items
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
  ],

  // Currency
  currencyAwardedForRating: {
    1: 10,
    2: 20,
    3: 30,
    4: 40,
    5: 50
  },
  currencyName: 'points',
  shopItems: [
    {
      name: '1mo Discord Nitro',
      description: 'we will send you a link for a month of Nitro',
      price: 100
    },
    {
      name: 'In-Game Code',
      description: 'we will send you a code to unlock AQW items',
      price: 300
    }
  ],
  shopImage: 'https://www.jumblebee.co.uk/site/wp-content/uploads/2014/06/JB-FE-Shop_10.png',

  // Server Setup
  servers: {
    '1196157712703168553': {
      helperRoleId: '1198659113501073549',
      itemRequestsChannelId: '1201633666602897559'
    }
  }
};
