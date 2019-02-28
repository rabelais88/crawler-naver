const puppeteer = require('puppeteer');
const { rejected } = require('../options');

class Crawler {
  constructor(_headless = false, maxtab = 5, maxpost = 50) {
    this._headless = _headless;
    this._maxtab = maxtab;
    this._maxpost = maxpost;
    if (this.maxpage < 11) throw Error('maxpage must be larger than 10')
    this._tabs = [];
  }
  async setRequest(tab) {
    await tab.setRequestInterception(true) // this disables page caching
    tab.on('request', req => {
      if (new RegExp(rejected).test(req.url())) req.abort();
      else req.continue();
    })
    return true;
  }
  async getWord(_keyword, page) {
    console.log('get word!', _keyword);
    const tab = await this._browser.newPage();
    await this.setRequest(tab);
    await tab.goto(`https://search.naver.com/search.naver?query=${_keyword}&where=post&=start=${page}`);
    const lnkBlogArticle = '.sh_blog_top > dl > dt > a';
    const res = await tab.evaluate(query => {
      const anchors = Array.from(document.querySelectorAll(query));
      return anchors.map(anchor => {
        return ({ title: anchor.textContent, href: anchor.href })
      })
    }, lnkBlogArticle);
    await tab.close();
    return res;
  }
  async crawl(...args) {
    this._browser = await puppeteer.launch({
      headless: this._headless,
    });
    if (!args || args.length <= 0) throw Error('must provide keyword')
    let targets = args;
    console.log('start crawling, total of - ', targets.length);
    let newTargets = [];
    for(let word of targets) {
      newTargets = newTargets
        .concat(new Array(Math.round(this._maxpost / 10))
        .fill({})
        .map((_, idx) => ({ word, index: idx === 0 ? 0 : idx * 10 + 1 }) ))
    }
    let resultsFinal = [];
    for (;newTargets.length >= 1;) {
      const newTabs = newTargets.splice(0, this._maxtab);
      const res = await Promise.all(newTabs.map(target => this.getWord(target.word, target.index)));
      resultsFinal = resultsFinal.concat(res)
      console.log('all finished!, next!');
    }
    return resultsFinal;
  }
  shut() {
    this._browser.close();
  }
}

module.exports = Crawler;