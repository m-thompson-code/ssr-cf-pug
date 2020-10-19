export interface ProjectConfig {
    env: 'staging' | 'prod';
    adminCerts: {// DO NOT TYPE WITH SPECIFIC VALUES SINCE THESE VALUES ARE SUPPOSED TO BE PRIVATE. PLEASE KEEP AS 'string'
        "type": string;
        "project_id": string;
        "private_key_id": string;
        "private_key": string;
        "client_email": string;
        "client_id": string;
        "auth_uri": string;
        "token_uri": string;
        "auth_provider_x509_cert_url": string;
        "client_x509_cert_url": string;
    };
    firebaseSDKConfig: FirebaseSDKConfig;
    // databasePollingUrls: string[];
    // sendGrid: {
    //     "apiKey": string;
    //     "old_apiKey": string;
    //     "new_apiKey": string;
    // },
    // emailUnsubscribe: {
    //     "secret": string;
    // }
}

export interface FirebaseSDKConfig {
    apiKey: "AIzaSyDJdl0Y_uYLyjLLHzqjmSzQMZWOJiTsiag";
    authDomain: "ssr-test-moo.firebaseapp.com";
    databaseURL: "https://ssr-test-moo.firebaseio.com";
    projectId: "ssr-test-moo";
    storageBucket: "ssr-test-moo.appspot.com";
    messagingSenderId: "664404175228";
    appId: "1:664404175228:web:ca197e9ff5503d39489cf9";
    measurementId: "G-JF29D2TQLS";
}
