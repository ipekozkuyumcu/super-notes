// the file contents for the current environment will overwrite these during build.
// the build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// the list of which env maps to which file can be found in `.angular-cli.json`.

/** configuration values of development environment */
export const environment = {
    production: false,
    protocol: '',
    host: '',
    defaultData: {
        defaultTitle: '',
        defaultDescription: '',
        'twitter:site': undefined,
        'twitter:creator': undefined,
        'fb:app_id': undefined,
        'fb:admins': undefined
    },
    Angulartics2: {},
    firebase: {
        apiKey: 'AIzaSyDeJI35tUfAPy97m0SI69oQ7Y6zTnxqbMU',
        authDomain: 'super-notes-beta.firebaseapp.com',
        projectId: 'super-notes-beta',
        storageBucket: 'super-notes-beta.appspot.com',
        messagingSenderId: '631012890211',
        appId: '1:631012890211:web:1ff24244468b1e1865ca56',
        measurementId: 'G-PNC5FYB5SV'
    }
};
