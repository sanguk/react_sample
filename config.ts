export const msalConfig = {
  //appId: '9c1f434e-2d0e-4dde-825c-a1997ef3dc1f', // Single-Tenent sanguk
  //appId: '4bd066b1-1310-4167-8979-6958677322b2', // Multi-Tenent sanguk

  //appId: '52af69fc-9d94-455d-91ca-c4357764e8f1', //ad-single-tenant
  //appId: 'b1eaf899-3b9f-49a3-b4c4-ecae22972f83', //ad-multi-tenant
  appId: process.env.REACT_APP_MSAL_APP_ID,
  redirectUri: process.env.REACT_APP_MSAL_REDIRECT_URL,
  scopes: [
    'user.read', //'calendars.read',
    //'api://dfbbb318-72d9-406b-bde8-3913d383cfc1/Read', 'api://dfbbb318-72d9-406b-bde8-3913d383cfc1/Write' // Sanguk
    'api://f775d8b6-b53a-4b68-bedb-0ea9334bf728/Read', 'api://f775d8b6-b53a-4b68-bedb-0ea9334bf728/Write' // USP
  ],
  apiScopes: [
    //'api://dfbbb318-72d9-406b-bde8-3913d383cfc1/Read', 'api://dfbbb318-72d9-406b-bde8-3913d383cfc1/Write' // Sanguk
    'api://f775d8b6-b53a-4b68-bedb-0ea9334bf728/Read', 'api://f775d8b6-b53a-4b68-bedb-0ea9334bf728/Write' // USP
  ]
};

export const auth0Config = {
  client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
  domain: process.env.REACT_APP_AUTH0_DOMAIN
};

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
};
