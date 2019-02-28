const fs = require('fs');
const { saveLocation } = require('../options')
const path = require('path');
const line = require('./util/line');

module.exports = class Preserver {
  static save(ctx) {
    return new Promise((resolve, reject) => {
      // flag: 'w' stands for creating new file if it doesn't exist
      fs.writeFile(path.resolve(path.join(__dirname, '..', saveLocation)), JSON.stringify(ctx), { flag: 'w' }, (err) => {
        if (err) {
          console.error(`${line(10)}there was an error while writing a file`);
          console.error(err);
          return resolve(false)
        }
        console.log(`${line(10)}successfully finished. check ${saveLocation}`);
        return resolve(true)
      })
    })
  }
}