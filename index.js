const ItemsQuery = require('./ItemsQuery.js');

const itemsQuery = new ItemsQuery('Armors', '+freeplayer');
itemsQuery.getPageItems().then(items => {
  console.log(items);
}).catch();
