import React, { useCallback, useState, useEffect } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
  Button,
  TextField,
  Grid,
  SvgIcon,
  TableContainer,
  IconButton,
  Popover,
  Tooltip,
} from '@material-ui/core';
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
//import type { Spec, Attribute, Category } from 'src/types/spec';
//import NumberFormat from 'react-number-format';
//import { Theme } from '@fullcalendar/core';
import { Autocomplete } from '@material-ui/lab';
//import InputAdornment from '@material-ui/core/InputAdornment';
import DeleteIcon from '@material-ui/icons/Delete';
import { KeyboardDatePicker } from '@material-ui/pickers';
import AddShoppingCartOutlinedIcon from '@material-ui/icons/AddShoppingCartOutlined';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import axios2 from 'src/utils/axios2';
import type { Order, Allocation, Inventory, FromSite, ShipmentTableType } from 'src/types/simpleorder';
import useFilters from 'src/views/dev/SalesOrder/Main/useFilters';
//import FormikSelectFromSite from 'src/components/FormikSelect/FormikSelectFromSite';
import ShipmentAssignedItem from './ShipmentAssignedItem';
import { v4 as uuidv4 } from 'uuid';
import ShipmentItemInner from 'src/views/dev/SalesOrder/ShipmentEdit/Dev/ShipmentItemInner';

interface ShipmentItemProps {
  className?: string;
  OpenOrderEdit: (event: React.MouseEvent<unknown>, orderNo: string) => void
};

const useStyles = makeStyles(() => ({
  autocomplete: {
    flexGrow: 1,
    '& pre': { color: 'white' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#FF9800',
      },
    },
  },
  cell: {
    // maxHeight: 900,
    // minHeight: 900,
    '& th.MuiTableCell-sizeSmall': {
      padding: '0 5px 0 10px',
    },
    '& td.MuiTableCell-sizeSmall': {
      padding: '0 5px 0 5px',
    },
    '& tr.MuiTableCell-sizeSmall': {
      padding: '0 5px 0 5px',
    },
  },
  container: {
    height: 705,
    '&::-webkit-scrollbar': {
      width: '0.5em',
    },
    '&::-webkit-scrollbar-track': {
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,0.00)',
    },
    '&:hover::-webkit-scrollbar-thumb': {
      backgroundColor: 'gray'
    },
  },
  inputProps: {
    '& .MuiAutocomplete-input': {
      fontSize: 'small'
    }
  }
}));

// const Transition = React.forwardRef(function Transition(
//   props: TransitionProps & { children?: React.ReactElement },
//   ref: React.Ref<unknown>,
// ) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

//const createLotFromOrder = (orders: Order[]) => {
//  const lotArr = orders.map(order => order.lots)
//  const lots = ([].concat(...lotArr))
//  return lots
//};

const createAllocationFromOrder = (orders: Order[]) => {
  const lotArr = orders.map(order => order.lots)
  const lots = ([].concat(...lotArr))

  const allocationArr = lots.map(lot => lot.allocations)
  const allocations: Allocation[] = ([].concat(...allocationArr))

  return allocations
};

//let renderCount = 0;

const ShipmentItem: FC<ShipmentItemProps> = ({ className, OpenOrderEdit, ...rest }) => {
  const classes = useStyles();
  //renderCount++;
  //console.log('Shipment item Render...' + renderCount);

  const isMountedRef = useIsMountedRef();
  const [sites, setSites] = useState<FromSite[]>([]);
  //const [openDetail, setOpenDetail] = useState(false);
  const [allocation, setAllocation] = useState<Allocation>(null);
  const [inventories, setInventories] = useState<Inventory[]>([]);

  const { control, getValues, watch } = useFormContext(); // retrieve all hook methods
  const { orders } = useFilters();
  const shipment = getValues();
  //console.log('methods.getValues()' + order);

  const [lotDialog, setLotDialog] = React.useState({
    isOpen: false,
    index: null
  });

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const handleClickPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const popoverId = Boolean(anchorEl) ? 'simple-popover' : undefined;

  const itemMethods = useFieldArray(
    {
      control: control,
      name: "lots",
      keyName: "_id"
    }
  );

  const getSites = useCallback(async () => {
    try {
      const response = await axios2.get<FromSite[]>('/fromSite/list');
      //console.log('FiltersProvider /sos', response);

      if (isMountedRef.current) {
        setSites(response.data);
      }
      else {
        debugger;
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getSites();
  }, [getSites]);

  const getInventories = useCallback(async () => {
    try {
      //console.log('getInventories', itemMethods.fields.map(a => a.from))
      const response = await axios2.post<Inventory[]>('/Inventory/listByFroms/', itemMethods.fields.map(a => a.from));
      console.log('shipmentItem /listByFroms', response);

      if (isMountedRef.current) {
        setInventories(response.data);
      }
      else {
        debugger;
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef, itemMethods.fields]);

  useEffect(() => {
    getInventories();
  }, [getInventories]);

  const allocaions = createAllocationFromOrder(orders)

  const allocationOptions = allocaions.map((option) => {
    const firstLetter = option.customerNo[0].toUpperCase();

    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      label: option.orderNo + ' | ' + option.fromSite + '  ' + option.specId + ' | ' + option.weight,
      value: option,
      ...option,
    };
  });

  const watchAllFields = watch(['no']);

  return (
    <Box style={{ paddingTop: 13 }}>
      <Grid container spacing={2} justify="space-between" className={classes.autocomplete}>
        <Grid item xs={12} sm={12} md={5}>
          <Autocomplete
            autoComplete={false}
            autoHighlight
            options={allocationOptions.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
            groupBy={(option) => option.customerNo}
            getOptionLabel={(option) => option.label}
            //style={{ width: 600 }}
            renderInput={(params) => <TextField {...params} label="Search Allocations" variant="outlined" />}
            onChange={(event: any, newValue: any | null) => {
              console.log('Autocomplete Allocation onChange', newValue);
              setAllocation(newValue.value);
              //setAttribute(null);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={2}>
          <Box mt={2} textAlign="right">
            <Button
              color="secondary"
              size="large"
              variant="contained"
              onClick={(event) => {
                if (!allocation) {
                  alert('select allocation');
                  return;
                }

                //console.log('Autocomplete Allocation onChange', allocation);
                axios2.post(`/sh/itemDraft`, { no: watchAllFields.no, allocationId: allocation.id }).then((response) => {
                  console.log('/sh/itemDraft', response.data);

                  // 1 Allocation이 Multi To를 가질 수 있으므로 Allocation 중복이 발생하는 것을 허용
                  //console.log('shipment.lots', shipment.lots);
                  //console.log('response.data', response.data);
                  //if (shipment.lots.some(a => a.id == response.data.id)) {
                  //  alert('allocation dup');
                  //}
                  //else {
                  //  itemMethods.append(response.data);
                  //}
                  itemMethods.append(response.data);
                });
              }}
            >
              Add Lot
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Box mt={2}>
        <TableContainer className={classes.container}>
          <Table size="small" stickyHeader className={classes.cell}>
            <TableHead>
              <TableRow>
                <TableCell align="center">Skid</TableCell>
                <TableCell align="center">Sales Order</TableCell>
                <TableCell align="center">Customer</TableCell>
                <TableCell align="center">Spec</TableCell>
                <TableCell align="center">Attribute</TableCell>
                <TableCell align="center">From Site</TableCell>
                <TableCell align="center">Ship To</TableCell>
                <TableCell align="center">ETD</TableCell>
                <TableCell align="center">ETA</TableCell>
                <TableCell align="center">Allocated</TableCell>
                <TableCell align="center">Weight (lb)</TableCell>
                <TableCell align="center">Release No</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>

            </TableHead>
            <TableBody>
              {itemMethods.fields.map((item, index) => {
                console.log('shipmentItem index', index)
                return (
                  <ShipmentItemInner key={item._id}
                    item={item}
                    index={index}
                    sites={sites}
                    OpenOrderEdit={OpenOrderEdit}
                    setLotDialog={setLotDialog}
                    handleClickPopover={handleClickPopover}
                    inventories={inventories}
                  />
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Popover
          id={popoverId}
          anchorEl={anchorEl}
          open={lotDialog.isOpen}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
        >
          <Box style={{ marginTop: 10 }}>
            <Typography variant="h5" align="center">Delete Lot?</Typography>
          </Box>
          <Box>
            <Button color="primary" size="small" variant="outlined" style={{ margin: 10 }}
              onClick={() => {
                setLotDialog({
                  isOpen: false,
                  index: null
                })
              }}>CANCEL</Button>
            <Button color="primary" size="small" variant="contained" style={{ margin: 10 }}
              onClick={() => {
                itemMethods.remove(lotDialog.index);
                setLotDialog({
                  isOpen: false,
                  index: null
                });
              }}
            >Delete</Button>
          </Box>
        </Popover>
      </Box>
    </Box>

  );
};

ShipmentItem.propTypes = {
  // @ts-ignore
  // card: PropTypes.object.isRequired,
  className: PropTypes.string,
  // @ts-ignore
  // list: PropTypes.object.isRequired,
  //onClose: PropTypes.func,
  //open: PropTypes.bool.isRequired
};

ShipmentItem.defaultProps = {
  //open: false,
  //onClose: () => { }
};

export default ShipmentItem;

