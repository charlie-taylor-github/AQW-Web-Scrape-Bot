const axios = require('axios');
const cheerio = require('cheerio');
const config = require('../../config.js');


function getUrl(gender, category, tags, pageIndex) {
  return `http://aqwwiki.wikidot.com`
    + `/search-items-by-tag${gender == 'male' ? '' : '-f'}/parent/`
    + `${category?.split(' ').join('%20') || '-='}`
    + `/tags/${(tags + ' ').split(' ').join('%20').split('+').join('%2B') || ''}`
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

    let img = null;
    if (gender == 'male') {
      const maleDiv = $(listItem).find('#wiki-tab-0-0');
      img = maleDiv.find('img').attr('src');
    } else {
      const femaleDiv = $(listItem).find('#wiki-tab-0-1');
      img = femaleDiv.find('img').attr('src');
    }

    if (!img) img = $(listItem).find('img').last().attr('src');
    if (config.invalidImageUrls.includes(img)) img = null;
    items.push({ name, img, url });
  });

  const resultsText = $('.list-pages-box > p > span').text();
  const totalResults = Number(resultsText.split(' ')[0]);

  return { items, totalResults };
}


module.exports = { getUrl, getPageItems };
