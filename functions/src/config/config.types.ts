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
    },
    // databasePollingUrls: string[],
    // sendGrid: {
    //     "apiKey": string;
    //     "old_apiKey": string;
    //     "new_apiKey": string;
    // },
    // emailUnsubscribe: {
    //     "secret": string;
    // }
}
