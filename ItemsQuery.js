const axios = require('axios');
const cheerio = require('cheerio');

const ITEMS_PER_PAGE = 50;

const INVALID_IMAGES = [
  'http://aqwwiki.wdfiles.com/local--files/image-tags/acsmall.png',
  'http://aqwwiki.wdfiles.com/local--files/image-tags/rarelarge.png',
  'http://aqwwiki.wdfiles.com/local--files/image-tags/aclarge.png',
  'http://aqwwiki.wdfiles.com/local--files/image-tags/Sword_Table.png',
  'http://aqwwiki.wdfiles.com/local--files/image-tags/Helmet_table.png'
];

class ItemsQuery {
  constructor(category, tags) {
    this.category = category;
    this.tags = tags;
    this.currentPageIndex = 1;
  }

  async getPageItems() {
    const url = this.#getUrl();
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const listItems = $('.list-pages-item');
    const items = [];

    listItems.each((i, listItem) => {
      const name = $(listItem).find('p strong a').text();
      let img = $(listItem).find('.m-content').find('img').last().attr('src');
      if (INVALID_IMAGES.includes(img)) img = null;
      items.push({ name, img });
    });

    return items;
  }

  #getUrl() {
    return `http://aqwwiki.wikidot.com/search-items-by-tag/parent/`
      + `${this.category?.replace(' ', '%20') || '-='}`
      + `/tags/${(this.tags + ' ').replace(' ', '%20').replace('+', '%2B') || ''}-_index%20-_redirect`
      + `/perPage/${ITEMS_PER_PAGE}/p/${this.currentPageIndex}`;
  }
}

module.exports = ItemsQuery;
