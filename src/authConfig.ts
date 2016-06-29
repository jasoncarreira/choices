export class AuthConfig {
  configForDevelopment = {
    httpInterceptor: true,
    loginOnSignup: true,
    baseUrl: 'http://localhost:8080/',
    loginRedirect: '#/profile',
    logoutRedirect: '#/',
    signupRedirect: '#/profile',
    loginUrl: '/auth/login',
    signupUrl: '/auth/signup',
    profileUrl: '/auth/me',
    loginRoute: 'profile',
    signupRoute: 'profile',
    tokenRoot: false,
    tokenName: 'token',
    tokenPrefix: 'aurelia',
    responseTokenProp: 'access_token',
    unlinkUrl: '/auth/unlink/',
    unlinkMethod: 'get',
    authHeader: 'Authorization',
    authToken: 'Bearer',
    withCredentials: true,
    platform: 'browser',
    storage: 'localStorage'
  };

  configForProduction = {
    providers: {
      google: {
        clientId: '239531826023-3ludu3934rmcra3oqscc1gid3l9o497i.apps.googleusercontent.com'
      }
      ,
      linkedin: {
        clientId: '7561959vdub4x1'
      },
      facebook: {
        clientId: '1653908914832509'
      }

    }
  };

  config;

  constructor() {
    if (window.location.hostname === 'localhost') {
      this.config = this.configForDevelopment;
    } else {
      this.config = this.configForProduction;
    }
  }
}


