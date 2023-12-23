const config = require('../config.js');
const { v4: uuid } = require('uuid');
const { getPageItems, getTotalSearchResults } = require('./controllers/items_controller.js');


class ItemsSession {
  constructor(gender, category, tags) {
    this.gender = gender;
    this.category = category;
    this.tags = tags;
    this.itemIndex = 0;
    this.loadedPageIndex = 0;
    this.loadedPageItems = [];
    this.totalResults = 0;
    this.id = uuid();
  }

  async init() {
    await this.#loadPageItems();
  }

  async getCurrentItem() {
    const lowestLoadedItemIndex = this.loadedPageIndex * config.itemsPerPage;
    const highestLoadedItemIndex = ((this.loadedPageIndex + 1) * config.itemsPerPage) - 1;
    const itemLoaded = (
      this.itemIndex >= lowestLoadedItemIndex
      && this.itemIndex <= highestLoadedItemIndex
    );

    if (!itemLoaded) {
      this.loadedPageIndex = Math.floor(this.itemIndex / config.itemsPerPage);
      await this.#loadPageItems();
    }

    const pageItemIndex = this.itemIndex % config.itemsPerPage;
    return this.loadedPageItems[pageItemIndex];
  }

  increaseCurrentItemIndex(addend) {
    this.itemIndex += addend;
  }

  async #loadPageItems() {
    const { items, totalResults } = await getPageItems(
      this.gender, this.category, this.tags, this.loadedPageIndex
    );
    this.loadedPageItems = items;
    this.totalResults = totalResults;
  }
}


module.exports = ItemsSession;
