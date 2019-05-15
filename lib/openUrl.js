const { exec } = require('child_process');

module.exports = url => {
    switch (process.platform) {
        // mac
        case 'darwin': 
            exec(`open ${url}`);
            break;
        // windows
        case 'win32': 
            exec(`start ${url}`);
            break;
        default: 
            break;
    }
}