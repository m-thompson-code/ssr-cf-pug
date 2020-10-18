const express = require('express');
const path = require('path');

const hostLocalStyles = (port) => {
    const _port = port || process.env.PORT || 3000;

    const local_styles = express();

    local_styles.use('/assets', express.static(path.join(__dirname, 'assets')));
    // local_styles.use('/assets/server', express.static(path.join(__dirname, 'assets/server')));
    // local_styles.use('/assets/server/css', express.static(path.join(__dirname, 'assets/server/css')));

    console.log(` ~ local-styles.js - Serving static assets...`);

    process.env['MOO_USE_LOCAL_STATIC_URLS'] = true;

    // Host local static assets (you should use a different PORT than the occupied ports used by the frameworks of this project: 4000 firebase serve debugger, 4200 (angular) 5000 (firebase serve) 5001 (firebase cloud functions serve))
    local_styles.listen(_port, () => {
        console.log(`~ local-styles.js - Node Express styles server listening on http://localhost:${_port}/assets/*`);
    });
}

hostLocalStyles(3000);
