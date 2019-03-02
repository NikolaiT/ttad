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


