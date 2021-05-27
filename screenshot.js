const fs = require('fs');

const screenshot = async (client) => {
    let image = await client.takeScreenshot();
    console.log('Taking screenshot!!');
    fs.writeFile(`screenshot.png`, image, 'base64', (err) => {
        if (err)
            console.log(err);
    })
}

module.exports = {
    screenshot
};
