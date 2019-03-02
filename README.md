# ttad - Text Title Author Date Extractor

This Node module extracts a single piece of

1. Text - t
2. Title - t
3. Author - a
4. Date - d

from a given string or list of urls.

## API

Tries to extract ttad from a string: 

`ttad.extract_from_str(s)`

Extracts ttad from a list of urls via puppeteer:

`ttad.extract_from_urls(urls)`

Both functions either return a error or a object of the structure:

```js
let resultObj = {
    text: '',
    title: '',
    author: '',
    date: '',
};
```

## Installation

```bash
npm install ttad
```


## How it works

ttad makes use of 

* [unfluff](https://www.npmjs.com/package/unfluff)
* [readability](https://github.com/mozilla/readability)

If those libraries fail to extract content properly, we will just grab the 
whole `innerText` property of the `<body>` tag.

## Example

```js
const { extract_from_url } = require('ttad');

(async() => {

    const urls = [
        'https://www.politico.eu/article/6-elections-to-watch-in-2018/',
        'https://www.weeklystandard.com/elliott-abrams/the-real-palestinian-catastrophe',
        'https://www.bloomberg.com/view/articles/2018-05-18/venezuela-s-election-pits-dollars-against-bolivars',
    ];

    config = {
        evadeDetection: false,
        headless: true,
        // ['stylesheet', 'font', 'image', 'media'];
        interceptRequests: [],
    };

    console.log(await extract_from_url(urls, config));

})();
```
