import { useContext } from 'react';
import AuthContext from 'src/contexts/MsalContext';

const useAuth = () => useContext(AuthContext);

export default useAuth;
