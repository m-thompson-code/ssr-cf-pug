
const path = require('path');
const fs = require('fs');

// source: https://stackoverflow.com/questions/51388921/pass-command-line-args-to-npm-scripts-in-package-json
const execSync = require('child_process').execSync;
execSync;

let server = process.argv[2];

if (server !== 'on') {
    server = 'off';
}

const outputPath = path.join(__dirname, '.runtimeconfig.json');

fs.writeFileSync(outputPath, JSON.stringify({
    local_styles: {
        server: server,
    },
}, null, 4));
