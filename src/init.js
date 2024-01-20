const initialiseDiscord = require('./discord/init.js');

module.exports = async function () {

  const { error } = await initialiseDiscord();
  if (error) console.error(error);

};
