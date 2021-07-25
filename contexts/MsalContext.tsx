import React, {
  createContext,
  useEffect,
  useCallback,
  useReducer
} from 'react';
import type { FC, ReactNode } from 'react';
import { UserAgentApplication, InteractionRequiredAuthError } from 'msal';
import type { User } from 'src/types/user';
import SplashScreen from 'src/components/SplashScreen';
import { msalConfig } from 'src/config';
import { getUserDetails } from './GraphService';
import jwtDecode from 'jwt-decode';
import axios2 from 'src/utils/axios2';

let userAgentApplication: UserAgentApplication | null = null;

interface AuthState {
  isInitialised: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

export interface AuthContextValue extends AuthState {
  method: 'Msal',
  loginPopup: (options?: any) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

type InitialiseAction = {
  type: 'INITIALISE';
  payload: {
    isAuthenticated: boolean;
    user: User | null;
  };
};

type LoginAction = {
  type: 'LOGIN';
  payload: {
    user: User;
  };
};

type LogoutAction = {
  type: 'LOGOUT';
};

type RegisterAction = {
  type: 'REGISTER';
};

type Action =
  | InitialiseAction
  | LoginAction
  | LogoutAction
  | RegisterAction;

const initialAuthState: AuthState = {
  isAuthenticated: false,
  isInitialised: false,
  user: null
};

const reducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case 'INITIALISE': {
      const { isAuthenticated, user } = action.payload;

      return {
        ...state,
        isAuthenticated,
        isInitialised: true,
        user
      };
    }
    case 'LOGIN': {
      const { user } = action.payload;

      return {
        ...state,
        isAuthenticated: true,
        user
      };
    }
    case 'LOGOUT': {
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
    }
    default: {
      return { ...state };
    }
  }
};

const AuthContext = createContext<AuthContextValue>({
  ...initialAuthState,
  method: 'Msal',
  loginPopup: () => Promise.resolve(),
  logout: () => { }
});

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  const loginPopup = async (options) => {
    console.log('loginPopup', options);

    try {
      var aa = await userAgentApplication.loginPopup(options);
      console.log('loginPopup Response', aa);
      //debugger;

      console.log('getAccessToken', msalConfig.apiScopes);
      //console.log('msalConfig.Scopes', await getAccessToken(msalConfig.scopes));
      const accessToken = await getAccessToken(msalConfig.apiScopes);
      //console.log('getAccessToken',  accessToken);
      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        var user = await getUserProfile(); // need to set isAuthenticated

        dispatch({
          type: 'LOGIN',
          payload: {
            user: {
              id: user.id,
              avatar: user.picture,
              email: user.userPrincipalName,
              name: user.displayName,
              tier: 'Premium'
            }
          }
        });
      }
      else {
        //debugger;
        dispatch({
          type: 'INITIALISE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    } catch (err) //InteractionRequiredAuthError
    {
      //debugger;
      console.error(err);

      if (err instanceof InteractionRequiredAuthError) {
        // statements to handle TypeError exceptions
        console.error(err.errorCode); // consent_required
        console.error(err.message);
        console.error(err.errorMessage);

        userAgentApplication.logout();
      }

      dispatch({
        type: 'INITIALISE',
        payload: {
          isAuthenticated: false,
          user: null
        }
      });
    }
  };

  const logout = () => {
    console.log('MsalContext logout');
    userAgentApplication.logout();

    dispatch({
      type: 'LOGOUT'
    });
  };

  const isInteractionRequired = useCallback((error: Error): boolean => {
    if (!error.message || error.message.length <= 0) {
      return false;
    }

    return (
      error.message.indexOf('consent_required') > -1 ||
      error.message.indexOf('interaction_required') > -1 ||
      error.message.indexOf('login_required') > -1
    );
  }, []);

  //const getAccessToken = async (scopes: string[]): Promise<string> => {
  const getAccessToken = useCallback(async (scopes: string[]): Promise<string> => {
    try {
      //console.log('getAccessToken');

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
      // If a silent request fails, it may be because the user needs
      // to login or grant consent to one or more of the requested scopes
      if (isInteractionRequired(err)) {
        var interactiveResult = await userAgentApplication.acquireTokenPopup({
          scopes: scopes
        });

        //console.log('interactiveResult.accessToken');
        //console.log('interactiveResult.accessToken', interactiveResult.accessToken);
        return interactiveResult.accessToken;
      } else {
        throw err;
      }
    }
  }, [isInteractionRequired])

  const getUserProfile = useCallback(async () => {
    try {
      //console.log('MsalContext getUserProfile');
      var accessToken = await getAccessToken(msalConfig.scopes);
      //console.log('MsalContext getUserProfile', accessToken);
      if (accessToken) {
        // Get the user's profile from Graph
        var user = await getUserDetails(accessToken);
        //console.log(user);
        //this.setState({
        //    isAuthenticated: true,
        //    user: {
        //        displayName: user.displayName,
        //        email: user.mail || user.userPrincipalName
        //    },
        //    error: null
        //});

        return user;
      }
    }
    catch (err) {
      console.log(err);
      //this.setState({
      //    isAuthenticated: false,
      //    user: {},
      //    error: this.normalizeError(err)
      //});
    }
  }, [getAccessToken])

  useEffect(() => {
    const initialise = async () => {

      //console.log(msalConfig);

      try {
        userAgentApplication = new UserAgentApplication({
          auth: {
            clientId: msalConfig.appId,
            redirectUri: msalConfig.redirectUri
          },
          cache: {
            cacheLocation: "sessionStorage",
            storeAuthStateInCookie: true
          }
        });

        // If MSAL already has an account, the user
        // is already logged in
        var account = userAgentApplication.getAccount();
        //console.log(account);
        if (account) {
          // Enhance user object with data from Graph
          var user = await getUserProfile(); // or ErrorMsg (isAuthenticated?)
          //console.log('useEffect user: ' + user);

          //debugger;
          // Here you should extract the complete user profile to make it available in your entire app.
          // The auth state only provides basic information.

          if (user === undefined) {
            debugger;
            dispatch({
              type: 'INITIALISE',
              payload: {
                isAuthenticated: false,
                user: null
              }
            });
          }
          else {
            const accessToken = await getAccessToken(msalConfig.apiScopes);
            if (accessToken && isValidToken(accessToken)) {
              setSession(accessToken);
              
              //console.log(axios2.getUri);
              //debugger;
              //const response2 = await axios2.get('/SayHelloFunction?name=ewgewgewhewh');
              //console.log(response2);
              //const response = await axios2.get<{ response1: string; }>('/SayHelloFunction?name=ewgewgewhewh');
              //console.log(response);
              //const { response1 } = response.data;
              //console.log(response1);

              //console.log('MsalContext useEffect INITIALISE with user', user);
              dispatch({
                type: 'INITIALISE',
                payload: {
                  isAuthenticated: true,
                  user: {
                    id: user.id,
                    avatar: user.picture,
                    email: user.userPrincipalName,
                    name: user.displayName,
                    tier: 'Premium'
                  }
                }
              });
            }
            else {
              //debugger;
              dispatch({
                type: 'INITIALISE',
                payload: {
                  isAuthenticated: false,
                  user: null
                }
              });
            }
          }
        }
        else {
          dispatch({
            type: 'INITIALISE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error('err', err);
        dispatch({
          type: 'INITIALISE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialise();
  }, [getAccessToken, getUserProfile]);


  

  // JWT Tokekn
  const isValidToken = (accessToken: string): boolean => {
    if (!accessToken) {
      return false;
    }

    const decoded: any = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  };

  // JWT Tokekn
  const setSession = (accessToken: string | null): void => {
    if (accessToken) {
      console.log('accessToken', accessToken);
      localStorage.setItem('accessToken', accessToken);

      // for test
      //accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiJhcGk6Ly9mNzc1ZDhiNi1iNTNhLTRiNjgtYmVkYi0wZWE5MzM0YmY3MjgiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82YTcwM2NlOC04MmY4LTRlYzQtYmYwZi1iZWYwNjhlMDZkM2QvIiwiaWF0IjoxNjExNTkyNDc0LCJuYmYiOjE2MTE1OTI0NzQsImV4cCI6MTYxMTU5NjM3NCwiYWNyIjoiMSIsImFpbyI6IkFUUUF5LzhTQUFBQU9lRU9XUkZSakdJSlE1MC9JZ2l5ZUxiSmtZMUh2cE9ibEowTmN6VEJ1UzRCNUQyT0JqYVBYalhYU1BFN1pSUTQiLCJhbXIiOlsicHdkIl0sImFwcGlkIjoiYjFlYWY4OTktM2I5Zi00OWEzLWI0YzQtZWNhZTIyOTcyZjgzIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJKdSIsImdpdmVuX25hbWUiOiJTYW0iLCJpcGFkZHIiOiIxMDguMzUuMTE4LjE2MiIsIm5hbWUiOiJTYW0gSnUiLCJvaWQiOiI3OTI2YjNkMi0zODZiLTQzODAtOWY1Yi03ZjQ1MDZkOWU1NTMiLCJyaCI6IjAuQUFBQTZEeHdhdmlDeEU2X0Q3N3dhT0J0UFpuNDZyR2ZPNk5KdE1Uc3JpS1hMNE51QUZZLiIsInNjcCI6IlJlYWQgV3JpdGUiLCJzdWIiOiJocnhmMDVKaGI5WlNJTEJQcDV5VkR3MmNPSVd5QUN2YThDRFJrR2EzWG40IiwidGlkIjoiNmE3MDNjZTgtODJmOC00ZWM0LWJmMGYtYmVmMDY4ZTA2ZDNkIiwidW5pcXVlX25hbWUiOiJzYW0uanVAdW5pdmVyc2FsLXN0ZWVsLmNvbSIsInVwbiI6InNhbS5qdUB1bml2ZXJzYWwtc3RlZWwuY29tIiwidXRpIjoiR21YWm53c3U4a3k5dlRPNVlKdEFBQSIsInZlciI6IjEuMCJ9.SEKRMjECbpWtadzn4n5bE_CRbWj10sMGThP-7oybTorD2GZAW9Mg8dihfjzU3lYWoiWlXjENzMqGk-z2UokuemLRQUoTmZ0m47aABKPHqh-2QFuiZymhqmbYckL7uWDMzXBR5HpjZpsDv1I0MgXktFr93nDtoaOCJN3Pz_6DpsvlJHA2cZlyQbOa3qUJTHSyBfTX0ZzAXU5Qf0MqoK0HhPicNCIy910olWGnuBoohLoOlEyzmjx4Zg3yezSw1vt6HZEaKKxdB-nU3WviViPPFaj8bMNycl4AUj5ScXLv-l19u2726ZfKa70ycnY7YTLZo6bennNSZLX-PHZZ1Rz_iw';

      axios2.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
      localStorage.removeItem('accessToken');
      delete axios2.defaults.headers.common.Authorization;
    }
  };

  if (!state.isInitialised) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'Msal',
        loginPopup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;