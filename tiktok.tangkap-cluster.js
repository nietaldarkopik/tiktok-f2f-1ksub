const ptc = require('puppeteer-core');
const pte = require('puppeteer-extra');
const puppeteer = require('puppeteer');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const PUPPETEER_EXECUTABLE_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const { Cluster } = require('puppeteer-cluster');

let loop = 0;
let profile_id = 'Profile 3';
let urlTiktok = [
    'https://www.tiktok.com/@upfollowers.gacor/live',
    'https://www.tiktok.com/@upfollowers01/live',
    'https://www.tiktok.com/@leaderjue/live',
    //'https://www.tiktok.com/@upfollowers.gacor_84/live'
    //'https://www.tiktok.com/@upfollowers.88/live',
    //'https://www.tiktok.com/@rosemaryzah/live',
    //'https://www.tiktok.com/@up_1k_followers/live'

];
let main_page = [];
let main_browser = [];
let nicknames = [];

pte.use(StealthPlugin());

async function doFollow(browser, page, videoUrl, indexpage) {
    //await page.waitForTarget({ timeout: 6000000 });
    const el = await page.waitForSelector('[data-e2e="chat-message"]', { timeout: 6000000 });
    const elcr = await page.waitForSelector('[data-e2e="chat-room"]', { timeout: 6000000 });
    const elmsg = await page.$('[data-e2e="chat-message"]:last-child [data-e2e="message-owner-name"] span');
    //const elmsg = await page.$$('[data-e2e="message-owner-name"] span');
    //const player = await page.$('[data-e2e="live-player"]');

    //const lastIndex = el.lastIndexOf()
    //javascript:document.getElementsByClassName("tiktok-101i1gy-SpanNickName")[5].click();void(0);
    // Login to TikTok
    //await page.click('.tiktok-101i1gy-SpanNickName:last-child');
    //console.log(elmsgs);
    //console.log(elmsg.length);
    //await el[el.length - 1].click({clickCount: 1});
    //await elmsg.click({clickCount: 1});
    //await page.waitForTimeout(4000);
    let status = 1;

    status = await page.evaluate(async (el) => {
        if (!el) {
            return 0;
        } else {
            await el.click();
            return 1;
        }
    }, elmsg);

    if (!status) {
        page.close();
        await initTiktok(profile_id, browser, page, indexpage);
    } else {

        await page.waitForSelector('[data-e2e="user-card"]', { timeout: 6000000 });
        let close = await page.$('[data-e2e="user-card"] [role="user-card-nickname"] + div');
        let nickname = await page.$('[data-e2e="user-card"] [role="user-card-nickname"]');
        let button = await page.$('[data-e2e="user-card"] [data-e2e="user-card-operator-button"] button:first-child');
        let text_button = await page.evaluate(el => {
            return (!el) ? '' : el.textContent;
        }, button);

        if (typeof text_button == 'undefined') {
            text_button = await page.evaluate(async el => {
                console.log(el);
                return el.textContent ?? '';
            }, button);
        }
        nickname = await page.evaluate(async (el) => { return el.getAttribute("href"); }, nickname);
        nickname = nickname.replace('/', '');
        nicknames[indexpage].push(nickname);
        console.log('================================');
        console.log('===========' + indexpage + '=========');
        console.log(nickname);
        console.log(text_button);
        console.log('===========' + indexpage + '=========');
        console.log('================================');

        /* 
        await page.evaluate(async (el) =>{
            if(!el)
            {}else{
                await el.remove();
            }
        },player); */

        if (text_button == 'Ikuti' || text_button == 'Follow') {
            if (!button) { } else {
                await button.click();
                //await page.focus('[data-e2e="comment-input"] [data-e2e="comment-text"] div');
                await page.type('[data-e2e="comment-input"] [data-e2e="comment-text"] div', nickname + ' Bantu Fallback ya kakak !!');
                await page.keyboard.press('Enter');
            }
        }
        //await page.waitForTimeout(4000);
        await page.evaluate(async (el) => {
            if (!el) { }
            else {
                await el.click();
            }
        }, close);

        let foundnicnames = nicknames[indexpage].filter((element, index) => (index >= (nicknames[indexpage].length - 5)));
        await page.type('[data-e2e="comment-input"] [data-e2e="comment-text"] div', foundnicnames.join(' , ') + ' Bantu Follback ya kakak !!');
        await page.keyboard.press('Enter');

        //await page.waitForTimeout(4000);
        await doFollow(browser, page, videoUrl, indexpage);
    }
}

async function initTiktok(profile, the_browser, the_page, indexpage) {
    //const browser = await puppeteer.launch({ headless: false }); // Set headless to false for visual testing
    
    if (the_browser == null) {
        browser = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_CONTEXT, //Cluster.CONCURRENCY_BROWSER,
            maxConcurrency: urlTiktok.length, // Maximum number of concurrent browsers
            puppeteer: pte,
            puppeteerOptions: {
                executablePath: PUPPETEER_EXECUTABLE_PATH, //'C:/Program Files/Google/Chrome/Application/chrome.exe', // Ganti dengan jalur lokasi instalasi Google Chrome di sistem Anda
                headless: false,
                //userDataDir: 'C:\\Users\\ExistCode.co.id\\AppData\\Local\\Google\\Chrome\\User Data',
                userDataDir: 'C:\\wamp\\nodejs\\tiktok\\User_Data0',
                args: [
                    '--user-data-dir=C:\\wamp\\nodejs\\tiktok\\User_Data0',
                    //'--user-data-dir=C:\\Users\\ExistCode.co.id\\AppData\\Local\\Google\\Chrome\\User Data',
                    '--profile-directory=' + profile,
                ],
                ignoreDefaultArgs: ["--enable-automation", '--disable-extensions'],
                defaultViewport: null,
                devtools: false,
                ignoreHTTPSErrors: true,
                timeout: 30000000,
                protocolTimeout: 30000000,
                //ignoreDefaultArgs: ['--disable-extensions']
            }
        });
    } else {
        browser = the_browser;
    }

    await browser.task(async ({ page, data }) => {
        let i = await data.index;
        await page.goto(data.url);

        await page.setDefaultNavigationTimeout(0);
        await page.waitForSelector('[data-e2e="live-player"]', { timeout: 6000000 });
        let player = await page.$('[data-e2e="live-player"]');

        await page.evaluate(async (el) => {
            if (!el) { } else {
                await el.remove();
            }
        }, player);
        
        await page.exposeFunction("doFollow", doFollow);
        doFollow(browser, page, urlTiktok[i], i);
    });

    // Add URLs to scrape
    
    if (indexpage == null) {
        for (var i = 0; i < urlTiktok.length; i++) {
            browser.queue({ url: urlTiktok[i], index: i });
            nicknames[i] = [];
        }
    } else {
        //await main_page[indexpage].exposeFunction("doFollow", doFollow);
        doFollow(browser, the_page, urlTiktok[indexpage], indexpage);
    }
}

initTiktok(profile_id, null, null, null);