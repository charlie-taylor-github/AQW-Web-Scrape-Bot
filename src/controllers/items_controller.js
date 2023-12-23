const axios = require('axios');
const cheerio = require('cheerio');
const config = require('../../config.js');


function getUrl(gender, category, tags, pageIndex) {
  return `http://aqwwiki.wikidot.com`
    + `/search-items-by-tag${gender == 'male' ? '' : '-f'}/parent/`
    + `${category?.replace(' ', '%20') || '-='}`
    + `/tags/${(tags + ' ').replace(' ', '%20').replace('+', '%2B') || ''}`
    + `-_index%20-_redirect/perPage/${config.itemsPerPage}/p/${pageIndex + 1}`;
}

async function getPageItems(gender, category, tags, pageIndex) {
  const url = getUrl(gender, category, tags, pageIndex);
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

  const resultsText = $('.list-pages-box > p > span').text();
  const totalResults = Number(resultsText.split(' ')[0]);

  return { items, totalResults };
}


module.exports = { getUrl, getPageItems };
