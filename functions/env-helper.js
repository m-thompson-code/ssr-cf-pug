/**
 * This helper js script is used to set environment for cloud functions
 * This project runs in two seperate firebase projects (prod and staging)
 * Each project requires its own certs, and this js script manages these differences
 * 
 * It is important to note that the cert files involved should exist in the private-certs/public-certs folder found at the root of this node project (./functions/private-certs, ./functions/public-certs)
 * The following array map is to seperate the prod and staging file names found in certs
 * 
 * These files involved are expected to be json files
 * 
 * The certs involved will be stored in an export found at ./src/config/config.ts
 */

const _c = [
    {
        prop: 'adminCerts',
        prod: 'ssr-test-moo-firebase-adminsdk-a8xyn-013005c942.json',// TODO: setup with actual prod project admin cert
        staging: 'ssr-test-moo-firebase-adminsdk-a8xyn-013005c942.json',
    },
    {
        prop: 'firebaseSDKConfig',
        prod: 'firebase-sdk-staging-config.json',// TODO: setup with actual prod project admin cert
        staging: 'firebase-sdk-staging-config.json',
    },
];

// source: https://stackoverflow.com/questions/51388921/pass-command-line-args-to-npm-scripts-in-package-json
const execSync = require('child_process').execSync;
execSync;

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '.');
const root = path.join.bind(path, ROOT);

const mkdirp = require('mkdirp');

console.log("\n ~ env-helper: START\n");

const env = process.argv[2];

if (env !== 'prod' && env !== 'staging') {
    const message = " ! Unexpected env argument";
    console.error(" ! Unexpected env argument", env);

    throw {
        message: message,
        env: env
    };
}

// envConfig will be populated with each object's prop attribute found in _c array initalized above
const envConfig = {
    env: env,
};

try {
    for (const __c of _c) {
        const filename = __c[env];

        const _private_path = path.join(root('./private-certs', filename));
        const _public_path = path.join(root('./public-certs', filename));

        try {
            const certJsonStr = fs.readFileSync(_private_path, "utf8");
            envConfig[__c.prop] = JSON.parse(certJsonStr);
        } catch(error) {
            if (error.code !== 'ENOENT') {
                console.error(error);
            }

            const certJsonStr = fs.readFileSync(_public_path, "utf8");
            envConfig[__c.prop] = JSON.parse(certJsonStr);
        }
    }
}catch(error) {
    console.error(error && error.message || error);
    console.warn("Unexpected issue generating functions config. Most common issue is the expected files are missing since these files are expected to be excluded in git repo. Please request for these files and put them in ./certs");
    throw error;
}

console.log(" ~ env-helper: setting config to use env:", env);

const configPath = root('./src/config');
const outputPath = path.join(configPath, 'config.ts');

mkdirp(configPath);
fs.writeFileSync(outputPath, `/* eslint import/no-unresolved: 0 */  // --> OFF\nimport { ProjectConfig } from './config-types';\n\n/* eslint comma-dangle: 0 */  // --> OFF\nexport const envConfig: ProjectConfig = ${JSON.stringify(envConfig, null, 4)};`);

console.log(`\n ~ env-helper: END\n`);

return 1;
