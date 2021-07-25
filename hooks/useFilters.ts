import { useContext } from 'react'; 
import FiltersContext from 'src/contexts/FiltersContext';
import type { FiltersContextValue } from 'src/contexts/FiltersContext';

const useFilters = (): FiltersContextValue => useContext(FiltersContext);

export default useFilters;
