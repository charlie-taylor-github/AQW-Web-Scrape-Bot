const dotenv = require('dotenv');
dotenv.config();

const { init } = require('./controllers/discord_controller.js');
init().then();

