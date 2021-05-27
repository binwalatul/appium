const webdriverio = require('webdriverio');
const assert = require('assert');

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

const recieve = async function () {
    let client = await webdriverio.remote(androidOptions);
    try {
        if (await client.isLocked()) {
            await client.unlock();
        }
        let res = await client.waitUntil(
            async () => await client.$('//android.widget.TextView[@content-desc="1 unread message"]'),
            {
                timeout: 10000,
                timeoutMsg: 'expected text to be different after 5s',
                interval: 100
            }
        );
        if (res.error) {
            throw Error("Message not recieved!!")
        } else {
            let messageRecieveTime = new Date();
            console.log('Message Recieved at:', messageRecieveTime);
            const readMsg = await client.$('//android.widget.TextView[@text="My Airtel"]')
            await readMsg.touchAction('tap');
            const back = await client.$('//*[@resource-id="com.whatsapp:id/whatsapp_toolbar_home"]')
            await back.touchAction('tap');
            const name = await client.$('//android.widget.TextView[@text="My Airtel"]');
            assert.strictEqual(await name.getText(), 'My Airtel', 'Sender name does not matches')
            // check alert for unread message
            await client.$("//*[@resource-id='com.whatsapp:id/conversations_row_message_count']");
            const remove = await client.$('//android.widget.TextView[@text="My Airtel"]')
            await remove.touchAction('longPress');
            const del = await client.$('//android.widget.TextView[@content-desc="Delete chat"]');
            await del.click();
            await client.$('//*[@resource-id="com.whatsapp:id/parentPanel"]');
            const delbtn = await client.$('//android.widget.Button[@content-desc="Delete"]');
            await delbtn.click();
            await client.closeApp();
        }
    } catch (error) {
        console.log(error)
        await client.closeApp();
    }
};

module.exports = {
    recieve
}
