require('dotenv').config();
const initialiseDiscord = require('./src/initialiseDiscord.js');


initialiseDiscord()
  .then()
  .catch(error => {
    console.error(error);
  });
