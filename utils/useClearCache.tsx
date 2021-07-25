﻿// https://www.npmjs.com/package/react-clear-cache
// OwnProps type does't have 'export'. I modify this npm.
import * as React from 'react';
import createPersistedState from 'use-persisted-state';

const STORAGE_KEY = 'APP_VERSION';

const defaultProps = {
  duration: 60 * 1000,
  auto: false,
  storageKey: STORAGE_KEY,
  baseUrl: 'https://uspapi20201221103518.azurewebsites.net/ReactVersion' // modified
  //basePath: '', // modified
  //filename: 'meta.json', // modified
};

type OwnProps = {
  duration?: number;
  auto?: boolean;
  storageKey?: string;
  baseUrl?: string; // modified
  //basePath?: string; // modified
  //filename?: string; // modified
  children?: any;
};

type Result = {
  loading: boolean,
  isLatestVersion: boolean;
  emptyCacheStorage: (version?:string | undefined) => Promise<void>
}

const ClearCacheContext = React.createContext<Result>({} as Result);

export const ClearCacheProvider: React.FC<OwnProps> = props => {
  const { children, ...otherProps } = props;
  const result = useClearCache(otherProps);
  return (
    <ClearCacheContext.Provider value={result}>
      {children}
    </ClearCacheContext.Provider>
  );
};

export const useClearCacheCtx = () => React.useContext(ClearCacheContext);

let fetchCacheTimeout: any;

export const useClearCache = (props?: OwnProps) => {
  const { duration, auto, storageKey, baseUrl /*basePath, filename*/ } = { // modified
    ...defaultProps,
    ...props
  };
  const [loading, setLoading] = React.useState(true);
  const useAppVersionState = createPersistedState(storageKey);
  const [appVersion, setAppVersion] = useAppVersionState('');
  const [isLatestVersion, setIsLatestVersion] = React.useState(true);
  const [latestVersion, setLatestVersion] = React.useState(appVersion);

  async function setVersion(version: string) {
    await setAppVersion(version);
  }

  const emptyCacheStorage = async (version?: string) => {
    if ('caches' in window) {
      // Service worker cache should be cleared with caches.delete()
      const cacheKeys = await window.caches.keys();
      await Promise.all(cacheKeys.map(key => {
        window.caches.delete(key)
      }));
    }

    // clear browser cache and reload page
    await setVersion(version || latestVersion);
    window.location.replace(window.location.href);
  };

  // Replace any last slash with an empty space
  //const baseUrl = basePath.replace(/\/+$/, '') + '/' + filename; // modified
  //const baseUrl = 'https://uspapi20201221103518.azurewebsites.net/ReactVersion'
  function fetchMeta() {
    try {
      console.log('useClearCache.fetchMeta baseUrl: ', baseUrl); // modified

      fetch(baseUrl, {
        cache: 'no-store'
      })
        .then(response => response.json())
        .then(meta => {
          const newVersion = meta.version;
          const currentVersion = appVersion;
          const isUpdated = newVersion === currentVersion;
          if (!isUpdated && !auto) {
            setLatestVersion(newVersion);
            setLoading(false);
            if (appVersion) {
              setIsLatestVersion(false);
            } else {
              setVersion(newVersion);
            }
          } else if (!isUpdated && auto) {
            emptyCacheStorage(newVersion);
          } else {
            setIsLatestVersion(true);
            setLoading(false);
          }
        });
    } catch (err) {
      console.error(err);
    }
  }

  React.useEffect(() => {
    fetchCacheTimeout = setInterval(() => fetchMeta(), duration);
    return () => {
      clearInterval(fetchCacheTimeout);
    };
  }, [loading]);

  const startVersionCheck = React.useRef(() => {});
  const stopVersionCheck = React.useRef(() => {});

  startVersionCheck.current = () => {
    if (window.navigator.onLine) {
      fetchCacheTimeout = setInterval(() => fetchMeta(), duration);
    }
  };

  stopVersionCheck.current = () => {
    clearInterval(fetchCacheTimeout);
  };

  React.useEffect(() => {
    window.addEventListener('focus', startVersionCheck.current);
    window.addEventListener('blur', stopVersionCheck.current);
    return () => { // modified
      window.removeEventListener('focus', startVersionCheck.current);
      window.removeEventListener('blur', stopVersionCheck.current);
    };
  }, []);

  React.useEffect(() => {
    fetchMeta();
  }, []);

  return {
    loading,
    isLatestVersion,
    emptyCacheStorage,
    latestVersion
  };
};

const ClearCache: React.FC<OwnProps> = props => {
  const { loading, isLatestVersion, emptyCacheStorage } = useClearCache(props);

  const { children } = props;

  return children({
    loading,
    isLatestVersion,
    emptyCacheStorage
  });
};

export default ClearCache;
