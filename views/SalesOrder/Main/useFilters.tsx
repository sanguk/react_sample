import { useContext } from 'react';
import FiltersContext from './FiltersContext';
import type { FiltersContextValue } from './FiltersContext';

const useFilters = (): FiltersContextValue => useContext(FiltersContext);

export default useFilters;
