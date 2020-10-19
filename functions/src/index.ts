import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import * as express from 'express';
import * as path from 'path';

// TODO: figure out how to avoid these warnings
/* eslint comma-dangle: 0 */  // --> OFF
/* eslint import/no-unresolved: 0 */  // --> OFF
import { envConfig } from './config/config';
import { FirebaseSDKConfig } from './config/config-types';

const SSR_PREFIX = '__ssr__';

admin.initializeApp({
    // ServiceAccount has conflicting attributes (project_id vs projectID, etc)
    // To get around this, let's cast for now (TODO: find source explaining this workaround)
    credential: admin.credential.cert(envConfig.adminCerts as admin.ServiceAccount),
    storageBucket: `${envConfig.adminCerts.project_id}.appspot.com`,
});

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", {structuredData: true});
    response.send("Hello from Firebase!");
});

const getStaticUrl = (subPath: string): string => {
    let _p = subPath;

    if (_p.charAt(0) !== '/') {
        _p = '/' + _p;
    }

    console.log(functions.config());

    if (functions.config().local_styles?.server === 'on') {
        return 'http://localhost:3000' + _p;
    }

    return _p;
}

const getPugTemplateBindings = (obj: {[attr: string]: any}): {[attr: string]: any, getStaticUrl: (subPath: string) => string, firebaseSDKConfig: FirebaseSDKConfig, firebaseSDKConfigSerialized: string} => {
    const _o: {[attr: string]: any, getStaticUrl: (subPath: string) => string, firebaseSDKConfig: FirebaseSDKConfig, firebaseSDKConfigSerialized: string} = {
        ...obj, // Create shallow clone of obj
        getStaticUrl: getStaticUrl, // add getStaticUrl
        firebaseSDKConfig: envConfig.firebaseSDKConfig, // add firebaseSDKConfig for passing json to template
        firebaseSDKConfigSerialized: JSON.stringify(envConfig.firebaseSDKConfig, null, 4), // Pass serialized json so it can be used in <script> for initalizing firebase
    };

    return _o;
}

const pug_app = express();

pug_app.set('views', path.join(__dirname,'../views'));

// pug_app.use(express.static(path.join(__dirname, '../assets')));

pug_app.set('view engine', 'pug');

// pug_app.get('/', (req, res, next) => {
// 	res.render('index');
// });

// Rewrite Firebase hosting requests: /${SSR_PREFIX)/:path => /:path
pug_app.use((req, res, next) => {
    // console.log(req.url);
    if (req.url.indexOf(`/${SSR_PREFIX}/`) === 0) {
        req.url = req.url.substring(SSR_PREFIX.length + 1);
    }
    // console.log(req.url);
    next();
});

pug_app.get(`/:id`, (req, res) => {
	// const memberDetails = {
	// 	member: req.params.name,
	// 	planet: req.params.home
    // }

    return admin.firestore().collection('metatags').doc(req.params.id || 'test').get().then(_d => {
    // return admin.database().ref('meta').once('value').then(_s => {
        // const data: any = _s.val();

        // if (!data) {
        //     console.error("errors");
        //     debugger;
        //     return;
        // }

        const data = _d.data();

        if (!data) {
            // console.error("missing data from metatags/test");
            // debugger;

            // res.send("missing data from metatags/test");
            // return;
        }

        const now = Date.now();

        const title = data?.title || ('Michael Jordan ' + now);
        const imageUrl = data?.imageUrl || 'https://www.biography.com/.image/c_fill%2Ccs_srgb%2Cfl_progressive%2Ch_400%2Cq_auto:good%2Cw_620/MTY2Njc5NDYzOTQ4NDYxNDA4/michael-jordan.jpg';

        const templateValues = {
            imageUrl: imageUrl,
            title: title,
        };

        console.log(templateValues);

        res.render('index', getPugTemplateBindings(templateValues));
    });
});

export const test = functions.https.onRequest(pug_app);
