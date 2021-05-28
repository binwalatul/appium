const webdriverio = require('webdriverio');
const assert = require('assert');

// session details that we will POST using /session
const androidOptions = {
    // capabilities: {
    //     platformName: 'Android',
    //     automationName: 'UiAutomator2',
    //     deviceName: 'Atul Binwal',
    //     platformVersion: '10',
    //     noReset: true,
    //     appPackage: "com.whatsapp",
    //     appActivity: "com.whatsapp.HomeActivity",
    //     "unlockType": "password",
    //     "unlockKey": "030693"
    // },
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
let senderName = "My Airtel"
const recieve = async function () {
    let client = await webdriverio.remote(androidOptions);
    try {
        if (await client.isLocked()) {
            await client.unlock();
        }
        await client.waitUntil(
            async () => {
                let sender = await client.$(`//android.widget.TextView[@text="${senderName}"]`);
                console.log('Inside wait until', await sender.getText());
                if (await sender.getText() === senderName) {
                    console.log('Inside if', await sender.getText());
                    return true;
                }
            },
            {
                timeout: 60000,
                timeoutMsg: 'Unable to get sender details',
                interval: 100
            }
        );
        let res = await client.waitUntil(
            async () => {
                let unreadMsg = await client.$('//android.widget.TextView[@content-desc="1 unread message"]');
                if (await unreadMsg.getText() === '1') {
                    return true;
                }
            },
            {
                timeout: 60000,
                timeoutMsg: 'expected message to be recieved within 1 min',
                interval: 100
            }
        );
        if (res.error) {
            throw Error("Message not recieved!!")
        } else {
            let messageRecieveTime = new Date();
            console.log('Message Recieved at:', messageRecieveTime);
            const readMsg = await client.$(`//android.widget.TextView[@text="${senderName}"]`)
            await readMsg.touchAction('tap');
            const back = await client.$('//*[@resource-id="com.whatsapp:id/whatsapp_toolbar_home"]')
            await back.touchAction('tap');
            const name = await client.$(`//android.widget.TextView[@text="${senderName}"]`);
            assert.strictEqual(await name.getText(), senderName, 'Sender name does not matches')
            // check alert for unread message
            await client.$("//*[@resource-id='com.whatsapp:id/conversations_row_message_count']");
            const remove = await client.$(`//android.widget.TextView[@text="${senderName}"]`)
            await remove.touchAction('longPress');
            const del = await client.$('//android.widget.TextView[@content-desc="Delete chat"]');
            await del.click();
            await client.$('//*[@resource-id="com.whatsapp:id/parentPanel"]');
            const delbtn = await client.$('//android.widget.Button[@content-desc="Delete"]');
            await delbtn.click();
            await client.closeApp();
            return messageRecieveTime;
        }
    } catch (error) {
        console.log(error)
        await client.closeApp();
        return error;
    }
};

module.exports = {
    recieve
}
