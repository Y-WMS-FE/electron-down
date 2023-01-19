const https = require('https');
const { gt } = require('semver');
const fs = require('fs');
const path = require('path');
const { app } = require('electron');
const { execSync } = require('child_process');
const packageJSON = require('../package.json');
const { info } = require('../modules/modal');
const deffer = require('../modules/deffer');

const feedUrl = 'https://raw.githubusercontent.com/Y-WMS-FE/electron-down/master/update/latest.json';
const updateTmpPath = path.join(app.getPath('appData'), `./e-markdown/tmp`)
if (!fs.existsSync(updateTmpPath)) {
    fs.mkdirSync(updateTmpPath);
}
console.log(updateTmpPath);

console.log(app.getAppPath(), 112233)
exports.checkUpdates = async function checkUpdates() {
    const p = deffer();
    const p2 = deffer();
    let latestJSON = null;
    https.get(feedUrl, function (res) {
        if (res.statusCode !== 200) {
            p.resolve(0);
            return console.log('请求失败!');
        }
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (d) => {
            rawData += d;
        });
        res.on('end', (d) => {
            let newVersion = false;
            try {
                latestJSON = JSON.parse(rawData);
                newVersion = gt(latestJSON.version, packageJSON.version);
                console.log(newVersion, 22222)
                if (newVersion) {
                    const r = info({
                        message: `检查到新版本v${latestJSON.version}，是否要更新？`,
                        detail: `当前版本为v${packageJSON.version}！`,
                        buttons: ['是', '否'],
                        cancelId: 1,
                        defaultId: 0,
                        noLink: true
                    });
                    if (r === 0) {
                        console.log('开始下载新版本!');
                        p.resolve(1);
                    } else {
                        p.resolve(0);
                    }
                }
            } catch (e) {
                console.error(e);
                p.resolve(0);
            }
        });
    });
    const r = await p.promise;
    if (r === 1 && latestJSON) {
        const { darwin: { url } } = latestJSON;
        https.get(url, function (res) {
            const { statusCode, headers: { location } } = res;
            if (statusCode === 302) {
                try {
                    https.get(location, function (response) {
                        const { statusCode } = response;
                        if (statusCode !== 200) {
                            p2.resolve(0);
                            return console.log('请求失败!');
                        }
                        const filePath = path.join(updateTmpPath, 'e-markdown.dmg')
                        response.pipe(fs.createWriteStream(filePath));
                        response.on('end', function () {
                            execSync(`hdiutil attach "${filePath}"`, { encoding: 'utf-8' });
                            // execSync('cp -rf /Volumes/e-markdown/e-markdown.app /Applications');
                            execSync(`rm -rf ${updateTmpPath}`);
                            execSync('open /Volumes/e-markdown')
                            console.log('success');
                            p2.resolve(1);
                        })
                    });
                } catch (e) {
                    p2.resolve(0);
                    console.log(e);
                }
            } else {
                p2.resolve(0);
            }
        });
        const d = await p2.promise;
    }
}



