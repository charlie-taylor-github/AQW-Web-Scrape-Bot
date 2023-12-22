const axios = require('axios');
const cheerio = require('cheerio');
const config = require('../config.js');

function getUrl(category, tags, pageIndex) {
  return `http://aqwwiki.wikidot.com/search-items-by-tag/parent/`
    + `${category?.replace(' ', '%20') || '-='}`
    + `/tags/${(tags + ' ').replace(' ', '%20').replace('+', '%2B') || ''}-_index%20-_redirect`
    + `/perPage/${config.itemsPerPage}/p/${pageIndex + 1}`;
}

class ItemsSession {
  constructor(category, tags) {
    this.category = category;
    this.tags = tags;
    this.itemIndex = 0;
    this.loadedPageIndex = 0;
    this.loadedPageItems = [];
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
    const url = getUrl(this.category, this.tags, this.loadedPageIndex);
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const listItems = $('.list-pages-item');
    const items = [];

    listItems.each((i, listItem) => {
      const name = $(listItem).find('p strong a').text();
      let img = $(listItem).find('.m-content').find('img').last().attr('src');
      if (config.invalidImageUrls.includes(img)) img = null;
      items.push({ name, img });
    });

    this.loadedPageItems = items;
  }
}

module.exports = ItemsSession;
