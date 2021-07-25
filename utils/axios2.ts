import axios from 'axios';
import { UserAgentApplication, /*InteractionRequiredAuthError*/ } from 'msal';
import { msalConfig } from 'src/config';

const axiosInstance2 = axios.create({
  //baseURL: 'https://localhost:44324/',
  baseURL: 'https://uspapi20201221103518.azurewebsites.net/',

  //baseURL: 'http://localhost:7071/api/',
  // baseURL: 'https://universal-steel.azure-api.net/api/',

  headers: { 'Access-Control-Allow-Origin': '*' }
});

//header('Access-Control-Allow-Origin: *');
//header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
//header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

const getAccessToken = (async (scopes: string[]): Promise<string> => {
  try {

    //let userAgentApplication: UserAgentApplication | null = null;
    let userAgentApplication = new UserAgentApplication({
      auth: {
        clientId: msalConfig.appId,
        redirectUri: msalConfig.redirectUri
      },
      cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: true
      }
    });

    // Get the access token silently
    // If the cache contains a non-expired token, this function
    // will just return the cached token. Otherwise, it will
    // make a request to the Azure OAuth endpoint to get a token
    var silentResult = await userAgentApplication.acquireTokenSilent({
      scopes: scopes
    });

    console.log('silentResult.accessToken', silentResult);

    //var user = await getUserDetails(silentResult.accessToken);
    //console.log('MsalContext getAccessToken getUserDetails', user);

    return silentResult.accessToken;
  } catch (err) {
    throw err;
  }
});

axiosInstance2.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    var accessToken = localStorage.getItem("accessToken");
    if (
      accessToken &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      console.log('axiosInstance2.interceptors.response.use 401', accessToken, error.response.status);

      originalRequest._retry = true;

      return getAccessToken(msalConfig.apiScopes)
        .then((res) => {
          console.log('res', res);
          accessToken = res;
          if (accessToken) {
            console.log('accessToken', accessToken);
            localStorage.setItem('accessToken', accessToken);

            axiosInstance2.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            return axios(originalRequest);
          } else {
            localStorage.removeItem('accessToken');
            delete axiosInstance2.defaults.headers.common.Authorization;
          }
        });
    }
    else if (error.response.status === 500) {
      console.log('axiosInstance2.interceptors.response.use 500', error.response.status, error);
      alert('server error(' + error.response.status + ')');
    }
    else {
      alert('your request error(' + error.response.status + ')');
    }

    //return Promise.reject(error);
    return Promise.reject((error.response && error.response.data) || 'Something went wrong');
  }
);

export default axiosInstance2;
