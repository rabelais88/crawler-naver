const { rejected } = require('../options');
const path = require('path')

test('testing regex', () => {
  console.log(rejected);
  const regex = new RegExp(rejected);
  expect(regex.test('testing.jpg')).toBe(true);
  expect(regex.test('testing.html')).toBe(false);
  expect(regex.test('sjkdlfjkl#34902Dkekddk<dlf>')).toBe(false);
})

test('getting root directory', () => {
  console.log(path.resolve(path.join(__dirname, '..', 'data')))
})