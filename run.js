const { extract_from_url } = require('./index');

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