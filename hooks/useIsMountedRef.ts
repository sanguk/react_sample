//https://dev.to/max_frolov_/react-hook-that-helps-understand-whether-component-mounted-3k3f

import { useRef, useEffect } from 'react';
import type { MutableRefObject } from 'react';

const useIsMountedRef = (caller: string = null): MutableRefObject<boolean> => {
  const _caller = caller;
  const isMounted = useRef(true);
  //console.log('useIsMountedRef caller', caller, isMounted);

  //useEffect(() => {
  //  //console.log('useIsMountedRef useEffect 1', caller, isMounted);
  //}, []);

  useEffect(() => {
    //console.log('useIsMountedRef useEffect 3', _caller, isMounted);
    return () => {
      //console.log('useIsMountedRef useEffect 2', _caller, isMounted);
      isMounted.current = false;
      //console.log('useIsMountedRef useEffect 2', _caller, isMounted);
    };
  }, []);

  return isMounted;
};

export default useIsMountedRef;
