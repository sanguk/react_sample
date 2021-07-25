import React from 'react';
import type { FC } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { create } from 'jss';
import rtl from 'jss-rtl';
import MomentUtils from '@date-io/moment';
import { SnackbarProvider } from 'notistack';
import {
  jssPreset,
  StylesProvider,
  ThemeProvider
} from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import GlobalStyles from 'src/components/GlobalStyles';
import ScrollReset from 'src/components/ScrollReset';
import CookiesNotification from 'src/components/CookiesNotification';
import GoogleAnalytics from 'src/components/GoogleAnalytics';
import SettingsNotification from 'src/components/SettingsNotification';
import { AuthProvider } from 'src/contexts/MsalContext';
import useSettings from 'src/hooks/useSettings';
import { createTheme } from 'src/theme';
import routes, { renderRoutes } from 'src/routes';
import { useClearCacheCtx } from 'src/utils/useClearCache';

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const history = createBrowserHistory();

const App: FC = () => {
  const { settings } = useSettings();
  const { isLatestVersion, emptyCacheStorage } = useClearCacheCtx();

  const theme = createTheme({
    direction: settings.direction,
    responsiveFontSizes: settings.responsiveFontSizes,
    theme: settings.theme
  });

  return (
    <ThemeProvider theme={theme}>
      {!isLatestVersion && (
        <p>
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              emptyCacheStorage();
            }}
          >
            Update version
          </a>
        </p>
      )}

      {isLatestVersion && (
        <StylesProvider jss={jss}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <SnackbarProvider
              dense
              maxSnack={3}
            >
              <Router history={history}>
                <AuthProvider>
                  <GlobalStyles />
                  <ScrollReset />
                  <GoogleAnalytics />
                  <CookiesNotification />
                  <SettingsNotification />
                  {renderRoutes(routes)}
                </AuthProvider>
              </Router>
            </SnackbarProvider>
          </MuiPickersUtilsProvider>
        </StylesProvider>  
      )}
    </ThemeProvider>
  );
};

export default App;
