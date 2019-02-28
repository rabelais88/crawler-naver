const Crawler = require('./src/crawler');
const Preserver = require('./src/preserver');
const line = require('./src/util/line');
const { keywords, maxTab, maxPost, headless } = require('./options')
 
const scrap = new Crawler(headless, maxTab, maxPost)
scrap.crawl(...keywords)
  .then(async(res) => {
    const isSuccess = await Preserver.save(res);
    console.log(`${line(20)}all done`);
  })
  .catch(err => {
    console.error(err)
  })
  .finally(() => {
    scrap.shut();
  })