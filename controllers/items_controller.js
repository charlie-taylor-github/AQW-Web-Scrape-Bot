const axios = require('axios');
const cheerio = require('cheerio');
const config = require('../config.js');
const { v4: uuid } = require('uuid');

function getUrl(gender, category, tags, pageIndex) {
  console.log(gender)
  return `http://aqwwiki.wikidot.com/search-items-by-tag${gender == 'male' ? '' : '-f'}/parent/`
    + `${category?.replace(' ', '%20') || '-='}`
    + `/tags/${(tags + ' ').replace(' ', '%20').replace('+', '%2B') || ''}-_index%20-_redirect`
    + `/perPage/${config.itemsPerPage}/p/${pageIndex + 1}`;
}

class ItemsSession {
  constructor(gender, category, tags) {
    this.gender = gender;
    this.category = category;
    this.tags = tags;
    this.itemIndex = 0;
    this.loadedPageIndex = 0;
    this.loadedPageItems = [];
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
    const url = this.#getUrl(this.gender, this.category, this.tags, this.loadedPageIndex);
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const listItems = $('.list-pages-item');
    const items = [];

    listItems.each((i, listItem) => {
      const name = $(listItem).find('p strong a').text();
      let img = $(listItem).find('.m-content').find('img').last().attr('src');
      if (!img) img = $(listItem).find('.f-content').find('img').last().attr('src');
      if (config.invalidImageUrls.includes(img)) img = null;
      items.push({ name, img });
    });

    this.loadedPageItems = items;
  }

  #getUrl() {
    return `http://aqwwiki.wikidot.com/search-items-by-tag${this.gender == 'male' ? '' : '-f'}/parent/`
      + `${this.category?.replace(' ', '%20') || '-='}`
      + `/tags/${(this.tags + ' ').replace(' ', '%20').replace('+', '%2B') || ''}-_index%20-_redirect`
      + `/perPage/${config.itemsPerPage}/p/${this.pageIndex + 1}`;
  }
}

module.exports = ItemsSession;
