import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';

import { AlertsService } from './alerts.service';
import { OAuthSettings } from '../_interfaces/oauth';
import { User } from '../_interfaces/user';

import { Client } from '@microsoft/microsoft-graph-client';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { couldStartTrivia } from 'typescript';
import { resolve } from 'dns';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  public authenticated: boolean;
  public user?: User;

  public graphClient?: Client;

  constructor(
    private msalService: MsalService,
    private alertsService: AlertsService) {

    const accounts = this.msalService.instance.getAllAccounts();
    this.authenticated = accounts.length > 0;
    if (this.authenticated) {
      this.msalService.instance.setActiveAccount(accounts[0]);
    }
    this.getUser().then((user) => {this.user = user});
  }

  async signIn(): Promise<void> {
    const result = await this.msalService
      .loginPopup(OAuthSettings)
      .toPromise()
      .catch((reason) => {
        this.alertsService.addError('Login failed',
          JSON.stringify(reason, null, 2));
      });

    console.log(result)

    if (result) {
      this.msalService.instance.setActiveAccount(result.account);
      this.authenticated = true;
      this.user = await this.getUser();
    }
  }

  async signOut(): Promise<void> {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    await this.msalService.logout().toPromise();
    this.user = undefined;
    this.authenticated = false;
  }

  private async getUser(): Promise<User | undefined> {
    if (!this.authenticated) return undefined;

    const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(
      this.msalService.instance as PublicClientApplication,
      {
        account: this.msalService.instance.getActiveAccount()!,
        scopes: OAuthSettings.scopes,
        interactionType: InteractionType.Popup
      }
    );
    try {
      this.graphClient = Client.initWithMiddleware({
        authProvider: authProvider
      });
      const graphUser: MicrosoftGraph.User = await this.graphClient
      .api('/me')
      .select('displayName,mail,mailboxSettings,userPrincipalName')
      .get();
      const user = new User();
      user.displayName = graphUser.displayName ?? '';
      user.email = graphUser.mail ?? graphUser.userPrincipalName ?? '';
      user.timeZone = graphUser.mailboxSettings?.timeZone ?? 'UTC';
      // user.avatar = "https://graph.microsoft.com/v1.0/users("+graphUser.id+")/photo"
      user.id = graphUser.id!;
      user.username = graphUser.userPrincipalName!.split("@", 1).toString()
  
      // const graphtoken = await this.msalService.acquireTokenSilent({
      //   scopes: [ "User.Read" ]
      // })
      // graphtoken.subscribe(val=>console.log(val.accessToken))
      return user;
    }
    catch(error) {
      localStorage.clear();
      window.location.reload();
      return undefined;
    }
  }
}
