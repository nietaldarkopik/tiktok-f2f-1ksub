const ptc = require('puppeteer-core');
const pte = require('puppeteer-extra');
const puppeteer = require('puppeteer');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const PUPPETEER_EXECUTABLE_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
let loop = 0;
let profile_id = 'Profile 3';

async function autoFollowTikTok(username, password, targetUsername) {
    const browser = await puppeteer.launch({ headless: false }); // Set headless to false for visual testing
    const page = await browser.newPage();
    //await page.goto('https://www.tiktok.com/login');

    // Login to TikTok
    //await page.type('input[name="email"]', username);
    //await page.type('input[name="password"]', password);
    //await page.click('button[type="submit"]');
    //await page.waitForNavigation();

    // Go to target user's profile
    //await page.goto(`https://www.tiktok.com/@${targetUsername}`);
    await page.goto(`https://www.tiktok.com/@upfollowers.gacor`);

    // Follow the user
    //await page.click('button.follow-button');

    // Close the browser
    //await browser.close();
}

pte.use(StealthPlugin());

async function doFollow(browser,page,videoUrl) {
    //await page.waitForTarget({ timeout: 600000 });
    const el = await page.waitForSelector('[data-e2e="chat-message"]', {timeout: 600000});
    const elcr = await page.waitForSelector('[data-e2e="chat-room"]', {timeout: 600000});
    const elmsg = await page.$('[data-e2e="chat-message"]:last-child [data-e2e="message-owner-name"] span');
    const player = await page.$('[data-e2e="live-player"]');
    
    //const lastIndex = el.lastIndexOf()
    //javascript:document.getElementsByClassName("tiktok-101i1gy-SpanNickName")[5].click();void(0);
    // Login to TikTok
    //await page.click('.tiktok-101i1gy-SpanNickName:last-child');
    console.log(elmsg);
    //console.log(elmsg.length);
    //await el[el.length - 1].click({clickCount: 1});
    //await elmsg.click({clickCount: 1});
    await page.waitForTimeout(4000);
    let status = 1;

    status = await page.evaluate(async (el) => {
        if(!el)
        {
            return 0;
        }else{
            await el.click();
            return 1;
        }
    }, elmsg);
    
    if(!status)
    {
        page.close();
        await autoCommentOnTikTok(profile_id, null, videoUrl, browser);
    }else{
            
        await page.waitForSelector('[data-e2e="user-card"]', {timeout: 600000});
        let close = await page.$('[data-e2e="user-card"] [role="user-card-nickname"] + div');
        let nickname = await page.$('[data-e2e="user-card"] [role="user-card-nickname"]');
        let button = await page.$('[data-e2e="user-card"] [data-e2e="user-card-operator-button"] button:first-child');
        let text_button = await page.evaluate(el =>{
            return (!el)?'':el.textContent;
        }, button);

        if(typeof text_button == 'undefined')
        {
            text_button = await page.evaluate(async el =>{
                console.log(el);
                return el.textContent ?? '';
            }, button);
        }
        nickname = await page.evaluate(async (el) => {return el.getAttribute("href");}, nickname);
        nickname = nickname.replace('/','');
        console.log(nickname);
        console.log(text_button);
        
        await page.evaluate((el) =>{
            (!el)?'':el.remove()
        },player);

        if(text_button == 'Ikuti' || text_button == 'Follow')
        {
            await button.click();
            //await page.focus('[data-e2e="comment-input"] [data-e2e="comment-text"] div');
            await page.type('[data-e2e="comment-input"] [data-e2e="comment-text"] div',nickname+' Bantu Fallback ya kakak !!');
            await page.keyboard.press('Enter');
        }
        //await page.waitForTimeout(4000);
        await page.evaluate(async (el) => {await el.click();}, close);
        //await close.click();
        await page.waitForTimeout(4000);
        // Dispose of handle
        //await el.dispose();

        //await page.waitForNavigation();
        //await page.goto(videoUrl);
        await console.log("re run do follow");
        loop++;
        if(loop > 4)
        {
            loop = 0;
            //await page.goto(videoUrl);
            //await page.waitForNavigation();
            //await page.waitForTimeout(4000);
        }

        await doFollow(browser,page,videoUrl);
    }
}

async function autoCommentOnTikTok(profile, new_page, videoUrl, browser) {
    //const browser = await puppeteer.launch({ headless: false }); // Set headless to false for visual testing

    if(browser == null)
    {
        browser = await pte.launch({
            executablePath: PUPPETEER_EXECUTABLE_PATH, //'C:/Program Files/Google/Chrome/Application/chrome.exe', // Ganti dengan jalur lokasi instalasi Google Chrome di sistem Anda
            headless: false,
            //userDataDir: 'C:\\Users\\ExistCode.co.id\\AppData\\Local\\Google\\Chrome\\User Data',
            userDataDir: 'C:\\wamp\\nodejs\\tiktok\\User_Data0',
            args: [
                '--user-data-dir=C:\\wamp\\nodejs\\tiktok\\User_Data0',
                //'--user-data-dir=C:\\Users\\ExistCode.co.id\\AppData\\Local\\Google\\Chrome\\User Data',
                '--profile-directory='+profile,
            ],
            ignoreDefaultArgs: ["--enable-automation",'--disable-extensions'],
            defaultViewport: null,
            devtools: false,
            ignoreHTTPSErrors: true,
            //ignoreDefaultArgs: ['--disable-extensions']
        });
    }

    const page = (new_page == null)?await browser.newPage():new_page;
    await page.goto(videoUrl);

    //await page.waitForNavigation()
    //await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.7.0.min.js'});

    //const el = await page.waitForSelector('[data-e2e="chat-message"]', {timeout: 600000});
    //const el2 = await page.waitForSelector('#tiktok-live-main-container-id', {timeout: 600000});
    //console.log(el);
    //console.log(el2);
    await page.exposeFunction("doFollow", doFollow);
    await doFollow(browser,page,videoUrl);
    //await page.waitForNavigation();
    
    //await page.waitForTarget({ timeout: 600000 });
    //page.waitForSelector('.tiktok-101i1gy-SpanNickName', {timeout: 600000});

    //javascript:document.getElementsByClassName("tiktok-101i1gy-SpanNickName")[5].click();void(0);
    // Login to TikTok
    //await page.click('.tiktok-101i1gy-SpanNickName');
    //await page.waitForNavigation();

    //await page.type('input[name="email"]', username);
    //await page.type('input[name="password"]', password);
    //await page.click('button[type="submit"]');
    //await page.waitForNavigation();

    // Go to the video URL
    //await page.goto(videoUrl);

    // Wait for the comment input field to load
    //await page.waitForSelector('textarea.comment-input');

    // Type and submit the comment
    //await page.type('textarea.comment-input', comment);
    //await page.click('button.comment-submit');

    // Close the browser
    //await browser.close();
}
/* 
puppeteer.launch({ headless: 'new' }).then(async browser => {
    //browser new page
    const p = await browser.newPage();
    //set viewpoint of browser page
    await p.setViewport({ width: 1000, height: 500 })
    //launch URL
    await p.goto('https://www.tutorialspoint.com/index.htm')
    //get browser
    const v = await p.browser().version();
    console.log("Browser: " + v)
    //browser close
    //await browser.close()
});
 */
// Usage: Replace the placeholders with your TikTok credentials, the video URL, and the comment text
//autoCommentOnTikTok(profile_id, 'your_password', 'https://www.tiktok.com/@upfollowers.gacor/live?enter_from_merge=others_homepage&enter_method=others_photo', 'Ayo Bantu Follback ya kakak!');
//autoCommentOnTikTok(profile_id, 'your_password', 'https://www.tiktok.com/@ayah_barbarr/live', 'Ayo Bantu Follback ya kakak!');
//autoCommentOnTikTok(profile_id, 'your_password', 'https://www.tiktok.com/@melisa.monalisa/live?search_type=live&search_id=20230710125106B3AEB323D1175701DEB0&search_keyword=follower&enter_from_merge=search_result&enter_method=live_cell&search_result_id=7254147773367454469', 'Ayo Bantu Follback ya kakak!');
//autoCommentOnTikTok(profile_id, 'your_password', 'https://www.tiktok.com/@followpemula/live?search_type=general&search_id=20230710130319FCCD84360F081E039694&search_result_id=14&search_keyword=tangkap%20tangkap&enter_from_merge=general_search&enter_method=live_cell', 'Ayo Bantu Follback ya kakak!');
//autoCommentOnTikTok(profile_id, 'your_password', 'https://www.tiktok.com/@gayaku69xxx/live?search_type=live&search_id=2023071013295812B724D81FD4EF066949&search_keyword=follower&enter_from_merge=search_result&enter_method=live_cell&search_result_id=7254172619510434566', 'Ayo Bantu Follback ya kakak!');
//autoCommentOnTikTok(profile_id, null, 'https://www.tiktok.com/@upfollowers.gacor_84/live?search_type=live&search_id=2023071013295812B724D81FD4EF066949&search_keyword=follower&enter_from_merge=search_result&enter_method=live_cell&search_result_id=7254179757562694406', null);
autoCommentOnTikTok(profile_id, null, 'https://www.tiktok.com/@upfollowers.gacor/live?enter_from_merge=general_search&enter_method=others_photo&search_id=20230712034633874FA75EEE2F300A9108&search_keyword=folower&search_result_id=6998316310838412289&search_type=general', null);
//autoCommentOnTikTok(profile_id, 'your_password', 'https://www.tiktok.com/@99tangkap_follower/live?search_type=general&search_id=20230710134802026541A00FC2580900D0&search_result_id=14&search_keyword=tangkap%20tangkap&enter_from_merge=general_search&enter_method=live_cell', 'Ayo Bantu Follback ya kakak!');
//autoFollowTikTok(false, false, 'target_username');
