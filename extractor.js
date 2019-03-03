unfluff = require('unfluff');
const { Readability }= require('./readability/index');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports = {
    extractContentFromUrl: extractContentFromUrl,
    extractFromStr: extractFromStr,
};

async function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

async function set_input_value(page, selector, value) {
    await page.waitFor(selector);
    await page.evaluate((value, selector) => {
        return document.querySelector(selector).value = value;
    }, value, selector);
}

function extractFromStr(s) {
    let resultObj = {
        text: '',
        title: '',
        author: '',
        date: '',
    };
    try {
        let data = unfluff(html_data);
        resultObj.text = data.text;
        resultObj.title = data.title;
        resultObj.date = data.date;
        resultObj.author = data.author;
        resultObj.parsed_by = 'unfluff';
        if (resultObj.text.length > minTextLength) {
            successParsing = true;
        }
    } catch (e) {
        console.error(`[unfluff] failed to extract with reason ${e.message}`)
    }
    return resultObj;
}

async function extractContentFromUrl(page, url, debug=true) {
    let resultObj = {
        text: '',
        title: '',
        author: '',
        date: '',
        url: url,
    };

    if (debug) console.log(`\tTrying to extract content from url ${url}`);

    try {
        await page.goto(url, {waitUntil: 'networkidle2', timeout: 30000});
        if (debug) console.log(`\tPage loaded.`);
    } catch (e) {
        console.error(`\tcould not load url ${url}. Trying nevertheless to grab contents: ${e.message}`);
    }

    try {
        var html_data = await page.content();
        if (debug) console.log(`\tFetched page content.`);
    } catch(e) {
        console.error('cannot fetch html contents. abort.');
        return resultObj;
    }

    var successParsing = false;
    const minTextLength = 100; // how many parsed characters indicate success?

    // first try our luck with https://www.npmjs.com/package/unfluff
    try {
        let data = unfluff(html_data);
        resultObj.text = data.text;
        resultObj.title = data.title;
        resultObj.date = data.date;
        resultObj.author = data.author;
        resultObj.parsed_by = 'unfluff';
        if (resultObj.text.length > minTextLength) {
            successParsing = true;
        }
    } catch (e) {
        console.error(`[unfluff] failed at url ${url} with reason ${e.message}`)
    }

    // when unfluff did not work, try our luck with
    // https://github.com/mozilla/readability
    if (!successParsing) {
        try {
            const body = await page.evaluate(() => {
                return document.querySelector('body').innerHTML;
            });

            var doc = new JSDOM(body, {
                url: url,
            });

            let reader = new Readability(doc.window.document);
            let article = reader.parse();
            if (article) {
                resultObj.author = article.byline;
                resultObj.text = article.textContent;
                resultObj.title = article.title;
                resultObj.parsed_by = 'readability';
                if (resultObj.text.length > minTextLength) {
                    successParsing = true;
                }
            }
        } catch (e) {
            console.error(`[readability] failed at url ${url} with reason ${e.message}`);
        }
    }

    if (!successParsing) {
        // if unfluff and readability fail, just take the body as text
        if (!resultObj.text || resultObj.text.length < 50) {
            try {
                const text = await page.evaluate(
                    () => document.querySelector('body').innerText
                );
                resultObj.text = text.trim();
                resultObj.title = await page.title();
                resultObj.parsed_by = 'body';
                if (resultObj.text.length > minTextLength) {
                    successParsing = true;
                }
            } catch(e) {
                console.error(`<body> failed at url ${url} with reason ${e.message}`);
            }
        }
    }

    if (resultObj.text.length > 0) {
        resultObj.banned = resultObj.text.includes('banned your access based on your browser\'s signature');
    }

    if (resultObj.title.length > 0) {
        resultObj.banned = resultObj.title.includes('Are you a robot?');
    }

    return resultObj;
}