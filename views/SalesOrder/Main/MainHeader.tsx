import React from 'react';
import type {
  FC,
} from 'react';
import {
  Box,
  Checkbox,
  SvgIcon,
  makeStyles,
  Button,
  TextField,
  FormControlLabel,
  Grid,
} from '@material-ui/core';
import {
  Edit as EditIcon,
  X as XIcon,
} from 'react-feather';
import type { Theme } from 'src/theme';
import Autocomplete from '@material-ui/lab/Autocomplete';
// import type { Filters, Order } from 'src/types/simpleorder';
import useFilters from './useFilters';
//import { id } from 'date-fns/locale';

interface MainHeaderProps {
  className?: string;
  OpenOrderEdit: (event: React.MouseEvent<unknown>, orderNo: string) => void;
}

/* const sortOptions = [
  {
    value: 'updatedAt|desc',
    label: 'Last update (newest first)'
  },
  {
    value: 'updatedAt|asc',
    label: 'Last update (oldest first)'
  },
  {
    value: 'createdAt|desc',
    label: 'Creation date (newest first)'
  },
  {
    value: 'createdAt|asc',
    label: 'Creation date (oldest first)'
  }
]; */

// Status filter option list
const statusOptions = [
  'Draft',
  'Open',
  'Completed',
  'Canceled',
  'Hold',
  'Rejected'
];

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
}));

const MainHeader: FC<MainHeaderProps> = ({ OpenOrderEdit }) => {

  const classes = useStyles();

  const { currentFilters, handleAutocomplete, handleCheckbox, handleClear, orders } = useFilters();

  // Customer filter option list
  const createCustomerList = () => {
    const customerArr = orders.map(a => a.customerNo)
    return (
      Array.from(new Set(customerArr))  // extract unique
    )
  };

  // Tag filter option list
  const createTagList = () => {
    const tagArr = orders.map(a => a.tags)
    const tagList = ([].concat(...tagArr))
    return (
      tagList
    )
  };

  // Product filter option list
  const createProductList = () => {
    return orders.flatMap(a => a.productNoFull)
  };

  const customerOption = createCustomerList()
  const tagOption = createTagList()
  const productOption = createProductList()

  return (
    <div className={classes.root}>
      <Grid container spacing={1} justify="space-evenly" style={{ paddingTop: 5 }}>
        <Grid item xs={12} sm={2}>
          <Box>
            <Autocomplete
              id='status'
              size='small'
              options={statusOptions}
              getOptionLabel={(option) => option}
              value={currentFilters.status}
              autoHighlight
              multiple
              limitTags={1}
              onChange={(event, value) => handleAutocomplete(event, value, 'status')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id='status2'
                  rowsMax='1'
                  variant="outlined"
                  label="Status"
                  placeholder="Status"
                />
              )}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Box>
            <Autocomplete
              id="customer"
              size='small'
              fullWidth
              autoHighlight
              multiple
              limitTags={1}
              options={customerOption}
              getOptionLabel={(option) => option}
              onChange={(event, value) => handleAutocomplete(event, value, 'customer')}
              value={currentFilters.customer}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Customer"
                  placeholder="Customer"
                />
              )}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Box>
            <Autocomplete
              id="product"
              size='small'
              fullWidth
              autoHighlight
              multiple
              limitTags={1}
              options={productOption}
              getOptionLabel={(option) => option}
              onChange={(event, value) => handleAutocomplete(event, value, 'product')}
              value={currentFilters.product}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Product"
                  placeholder="Product"
                />
              )}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Box>
            <Autocomplete
              id="tag"
              size='small'
              fullWidth
              autoHighlight
              multiple
              limitTags={1}
              options={tagOption}
              getOptionLabel={(option) => option}
              onChange={(event, value) => handleAutocomplete(event, value, 'tag')}
              value={currentFilters.tag}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Tag"
                  placeholder="Tag"
                />
              )}
            />
          </Box>
        </Grid>

        <Grid item>
          <Box>
            <Button
              color="secondary"
              variant="contained"
              fullWidth
              onClick={(event) => OpenOrderEdit(event, null)}
              startIcon={
                <SvgIcon>
                  <EditIcon />
                </SvgIcon>
              }
            >
              New SO
            </Button>
          </Box>
        </Grid>
      </Grid>



      <Grid container spacing={1} justify="space-between" alignItems="center" justify-items="stretch">
        <Grid item >
          <Box m={1} bgcolor="rgba(255, 255, 255, 0.09)" border={1} borderColor="rgba(255, 255, 255, 0.26)" borderRadius="borderRadius" style={{ marginLeft: 10, paddingLeft: 15, paddingRight: 10 }}>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={currentFilters.salesRep.includes('CS')}
                  onChange={handleCheckbox}
                  name="salesRep"
                  value='CS'
                />
              )}
              label="Curtis"
            />
            <FormControlLabel
              control={(
                <Checkbox
                  checked={currentFilters.salesRep.includes('JJ')}
                  onChange={handleCheckbox}
                  name="salesRep"
                  value='JJ'
                />
              )}
              label="Jerry"
            />
          </Box>
        </Grid>

        <Grid item >
          <Box m={1} bgcolor="rgba(255, 255, 255, 0.09)" border={1} borderColor="rgba(255, 255, 255, 0.26)" borderRadius="borderRadius" style={{ paddingLeft: 15, paddingRight: 10 }}>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={currentFilters.orderClass.includes('B')}
                  onChange={handleCheckbox}
                  name="orderClass"
                  value='B'
                />
              )}
              label="Back To Back"
            />
            <FormControlLabel
              control={(
                <Checkbox
                  checked={currentFilters.orderClass.includes('S')}
                  onChange={handleCheckbox}
                  name="orderClass"
                  value='S'
                />
              )}
              label="Stock"
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={7}>
          <Box m={1}>
            {/* <FormControlLabel
              control={(
                <Checkbox
                  checked={currentFilters.checkList.includes('MTC')}
                  onChange={handleCheckbox}
                  name="checkList"
                  value='MTC'
                />
              )}
              label="MTC"
            /> */}
          </Box>
        </Grid>

        {/* <TextField
          label="Sort By"
          name="sort"
          onChange={handleSortChange}
          select
          SelectProps={{ native: true }}
          value={sort}
          variant="outlined"
        >
          {sortOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </TextField> */}

        <Grid item >
          <Box m={1}>
            <Button
              onClick={handleClear}
              startIcon={
                <SvgIcon fontSize="small">
                  <XIcon />
                </SvgIcon>
              }
            >
              Clear Filter
        </Button>
          </Box>
        </Grid>
      </Grid>
    </div >
  )
};

export default MainHeader;
