const webdriverio = require('webdriverio');
const { screenshot } = require('./screenshot');
// session details that we will POST using /session
const androidOptions = {
    capabilities: {
        platformName: 'Android',
        automationName: 'UiAutomator2',
        deviceName: 'Atul Binwal',
        platformVersion: '6.0.1',
        noReset: true,
        appPackage: "com.whatsapp",
        appActivity: "com.whatsapp.HomeActivity",
        "unlockType": "pin",
        "unlockKey": "1234"
    },
    path: '/wd/hub',
    host: process.env.APPIUM_HOST || 'localhost',
    port: process.env.APPIUM_PORT || 4723,
    logLevel: 'warn'
};

const sent = async function () {
    let client = await webdriverio.remote(androidOptions);
    try {
        await client.unlock();
        // Start new conversation
        const start_chat = await client.$("//*[@resource-id='com.whatsapp:id/fab']");
        await start_chat.click();
        // wait for the contact page to load
        await client.$("//*[@resource-id='android:id/list']");
        // click on search button
        const search = await client.$("//*[@resource-id='com.whatsapp:id/menuitem_search']");
        await search.click();
        // search for contact
        const searchName = await client.$("//*[@resource-id='com.whatsapp:id/search_src_text']")
        await searchName.addValue('My Airtel');
        // select the contact
        const name = await client.$("//*[@resource-id='com.whatsapp:id/contactpicker_row_name']")
        await name.click();
        // wait for chat window
        await client.$("//*[@resource-id='android:id/list']");
        // write the text message
        const message = await client.$("//*[@resource-id='com.whatsapp:id/entry']");
        await message.addValue('Hi there');
        let sentTime = new Date();
        // send the message
        const send = await client.$("//*[@resource-id='com.whatsapp:id/send']");
        await send.click();
        // test screenshot
        await screenshot(client);
        await client.closeApp();
        return sentTime;
    } catch (error) {
        console.log(error)
        await client.closeApp();
        return error;
    }
};

module.exports = {
    sent
}