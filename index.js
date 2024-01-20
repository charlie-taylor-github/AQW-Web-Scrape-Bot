require('dotenv').config();

require('./src/init.js')().then().catch(err => {
  console.error(err);
});
