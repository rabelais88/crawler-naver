const Crawler = require('./src/crawler');
const fs = require('fs');
const path = require('path');
const line = require('./src/util/line');
const { saveLocation, keywords, maxTab, maxPost, headless } = require('./options')
 
const scrap = new Crawler(headless, maxTab, maxPost)
scrap.crawl(...keywords)
  .then(res => {
    fs.writeFile(path.join(__dirname, saveLocation), JSON.stringify(res), (err) => {
      if (err) return console.error(`${line(10)}there was an error while writing a file`);
      console.log(`${line(10)}successfully finished. check ${saveLocation}`);
    })
  })
  .catch(err => {
    console.error(err)
  })
  .finally(() => {
    scrap.shut();
  })