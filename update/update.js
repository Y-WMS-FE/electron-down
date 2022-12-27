const https = require('https');
const packageJSON = require('../package.json');

const feedUrl = 'https://raw.githubusercontent.com/Y-WMS-FE/electron-down/master/update/latest.json';


https.get(feedUrl, function (res) {
    if (res.statusCode !== 200) {
        return console.log('请求失败!');
    }
    console.log(res);
})
