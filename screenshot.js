const fs = require('fs');

// Utility to take and store the screen shot.
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
