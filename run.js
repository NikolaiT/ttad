const { extract_from_url } = require('./index');

(async() => {

    const urls = [
        'https://www.newyorker.com/magazine/2018/01/08/making-china-great-again',
        'https://www.theatlantic.com/international/archive/2017/12/the-battle-for-iran/549446/',
        'https://www.theguardian.com/commentisfree/2017/dec/31/isis-dreams-of-caliphate-gone-now-deadly-new-strategy',
        'https://www.haaretz.com/st/c/prod/eng/2017/12/isis/#page6',
        'https://www.economist.com/news/christmas-specials/21732704-nationalism-not-fading-away-it-not-clear-where-it-heading-whither',
        'https://www.politico.eu/article/6-elections-to-watch-in-2018/',
    ];

    config = {
        evadeDetection: false,
        headless: true,
        // ['stylesheet', 'font', 'image', 'media'];
        interceptRequests: [],
    };

    console.log(await extract_from_url(urls, config));

})();