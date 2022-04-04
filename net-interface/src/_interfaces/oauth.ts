export const OAuthSettings = {
  appId: 'a3a1423c-deca-4367-b276-55d42b0d120b',
  // redirectUri: 'http://localhost:4200',
  redirectUri: 'https://palguin.htl-vil.local:4200/',
  authority: 'https://login.microsoftonline.com/2b197efa-8e1b-4680-b263-8e237889b5b3',
  scopes: [
    "user.read",
    "mailboxsettings.read",
    "calendars.readwrite"
  ]
};
