import React, { useState } from 'react';
import type { FC } from 'react';
//import PropTypes from 'prop-types';
//import numeral from 'numeral';
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
  //TextField,
  Grid,
  //SvgIcon,
  TableContainer,
  //IconButton,
  Popover,
  //Tooltip,
} from '@material-ui/core';
//import { Theme } from '@fullcalendar/core';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
//import axios2 from 'src/utils/axios2';
import type { Order, Allocation, Inventory, Shipment } from 'src/types/simpleorder';
import useFilters from 'src/views/dev/SalesOrder/Main/useFilters';
import { useFieldArray, useFormContext } from 'react-hook-form';
import OrderShipmentItem from './OrderShipmentItem';

interface OrderShipmentProps {
  className?: string;
  OpenOrderEdit: (event: React.MouseEvent<unknown>, orderNo: string) => void
};

const useStyles = makeStyles(() => ({
  cell: {
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
    height: 785,
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
  }
}));

const createAllocationFromOrder = (orders: Order[]) => {
  const lotArr = orders.map(order => order.lots)
  const lots = ([].concat(...lotArr))

  const allocationArr = lots.map(lot => lot.allocations)
  const allocations: Allocation[] = ([].concat(...allocationArr))

  return allocations
};

const ShipmentAssignedItem = (shipment: Shipment[]) => {
  const lotArr = shipment.map(shipment => shipment.lots)
  const lots = ([].concat(...lotArr))

  const shipmentArr = lots.map(lot => lot.allocations)
  const shipments: Shipment[] = ([].concat(...shipmentArr))

  return shipments
}

let renderCount = 0;

const OrderShipment: FC<OrderShipmentProps> = ({ className, OpenOrderEdit, ...rest }) => {
  const classes = useStyles();

  renderCount++;
  //console.log('Shipment item Render...' + renderCount);

  const isMountedRef = useIsMountedRef();
  //const [sites, setSites] = useState<FromSite[]>([]);
  const [openDetail, setOpenDetail] = useState(false);
  const [allocation, setAllocation] = useState<Allocation>(null);
  const [inventories, setInventories] = useState<Inventory[]>([]);

  //const { control, getValues, register, watch } = useFormContext(); // retrieve all hook methods
  const { orders } = useFilters();
  //const { shipments } = useFilters();
  //const shipment = getValues();
  //console.log('methods.getValues()' + order);

  const [lotDialog, setLotDialog] = React.useState({
    isOpen: false,
    index: null
  });

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const { control, getValues, register, watch } = useFormContext();

  const itemMethods = useFieldArray(
    {
      control: control,
      name: "lots",
      keyName: "_id"
    }
  );

  /* const getSites = useCallback(async () => {
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
  }, [getSites]); */

  /* const getInventories = useCallback(async () => {
    try {
      //console.log('getInventories', itemMethods.fields.map(a => a.from))
      const response = await axios2.post<Inventory[]>('/Inventory/listByFroms/', itemMethods.fields.map(a => a.from));
      //console.log('FiltersProvider /sos', response);

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
  }, [getInventories]); */

  const allocaions = createAllocationFromOrder(orders)
  //const shipments = ShipmentAssignedItem(shipments)

  const allocationOptions = allocaions.map((option) => {
    const firstLetter = option.customerNo[0].toUpperCase();

    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      label: option.orderNo + ' | ' + option.fromSite + '  ' + option.specId + ' | ' + option.weight,
      value: option,
      ...option,
    };
  });

  //const watchAllFields = watch(['no']);

  return (
    <Box style={{ paddingTop: 13 }}>
      <Grid container spacing={2} justify="space-between">
        <Grid item xs={12} sm={12} md={5}>
          {/* <Autocomplete
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
          /> */}
        </Grid>
        <Grid item xs={12} sm={12} md={2}>
          <Box mt={2} textAlign="right">
            {/* <Button
              color="secondary"
              size="large"
              variant="contained"
              onClick={(event) => {
                //console.log('Autocomplete Allocation onChange', allocation);
                axios2.post(`/sh/itemDraft`, { no: watchAllFields.no, allocationId: allocation.id }).then((response) => {
                  //console.log('/sh/itemDraft', response.data);

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
            </Button> */}
          </Box>
        </Grid>
      </Grid>

      <Box mt={2}>
        <TableContainer className={classes.container}>
          <Table size="small" stickyHeader className={classes.cell}>
            <TableHead>
              <TableRow>
                <TableCell align="center">Shipment Order</TableCell>
                <TableCell align="center">Vendor</TableCell>
                <TableCell align="center">Spec</TableCell>
                <TableCell align="center">Attribute</TableCell>
                <TableCell align="center">From Site</TableCell>
                <TableCell align="center">Ship To</TableCell>
                <TableCell align="center">ETD</TableCell>
                <TableCell align="center">ETA</TableCell>
                <TableCell align="center">Weight (lb)</TableCell>
                <TableCell align="center">Release No</TableCell>
              </TableRow>

            </TableHead>
            <TableBody>
              {itemMethods.fields.map((item, index) => {
                return (
                  <ShipmentItemInner key={item._id}
                    item={item} index={index} itemMethods={itemMethods}
                    OpenOrderEdit={OpenOrderEdit}
                    setLotDialog={setLotDialog}
                    handleClick={handleClick}
                    inventories={inventories}
                  />
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Popover
          id={id}
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
            <Typography variant="h5" align="center">
              Delete Lot?
                  </Typography>
          </Box>
          <Box>
            <Button color="primary" size="small" variant="outlined" style={{ margin: 10 }}
              onClick={() => {
                setLotDialog({
                  isOpen: false,
                  index: null
                })
              }}>
              CANCEL
                </Button>
            {/* <Button color="primary" size="small" variant="contained" style={{ margin: 10 }}
              onClick={() => {
                itemMethods.remove(lotDialog.index);
                setLotDialog({
                  isOpen: false,
                  index: null
                });
              }}
            >
              Delete
            </Button> */}
          </Box>
        </Popover>

      </Box>
    </Box>
  );
}

export default OrderShipment;

interface ShipmentItemInnerProps {
  item: any;
  index: any;
  itemMethods: any;
  OpenOrderEdit: (event: React.MouseEvent<unknown>, orderNo: string) => void;
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  setLotDialog: any;
  inventories: Inventory[];
}

const ShipmentItemInner: FC<ShipmentItemInnerProps> = ({
  item,
  index,
  itemMethods,
  OpenOrderEdit,
  handleClick,
  setLotDialog,
  inventories,
  ...rest
}) => {

  const classes = useStyles();
  const { control, getValues, watch, reset, register } = useFormContext();
  const itemAssignMethods = useFieldArray(
    {
      control: control,
      name: `lots.${index}.itemAssigns`,
      keyName: "_id"
    }
  );

  return (
    <React.Fragment>
      <TableRow>
        <TableCell align="center">
          <input type="hidden" ref={register()} name={`lots[${index}].id`} defaultValue={item.id} />
          <input type="hidden" ref={register()} name={`lots[${index}].salesOrderNo`} defaultValue={item.salesOrderNo} />
          <input type="hidden" ref={register()} name={`lots[${index}].salesOrderLot`} defaultValue={item.salesOrderLot} />
          <input type="hidden" ref={register()} name={`lots[${index}].allocationId`} defaultValue={item.allocationId} />
          <input type="hidden" ref={register()} name={`lots[${index}].customerNo`} defaultValue={item.customerNo} />
          <input type="hidden" ref={register()} name={`lots[${index}].from`} defaultValue={item.from} />
          <input type="hidden" ref={register()} name={`lots[${index}].categoryId`} defaultValue={item.categoryId} />
          <input type="hidden" ref={register()} name={`lots[${index}].specId`} defaultValue={item.specId} />
          <input type="hidden" ref={register()} name={`lots[${index}].attributeId`} defaultValue={item.attributeId} />
          <input type="hidden" ref={register()} name={`lots[${index}].qtyUnit`} defaultValue={item.qtyUnit} />
          <Button color="primary" size="small" onClick={(event) => OpenOrderEdit(event, item.salesOrderNo)} >
            <Typography variant="body2" color="textPrimary" noWrap style={{ textDecoration: 'underline', fontWeight: 'lighter' }}>
              {item.shipmentLotNo}
            </Typography>
          </Button>
        </TableCell>

        <TableCell>
          <Typography variant="body2" color="textSecondary" noWrap>
            {item.vendor}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" color="textSecondary" noWrap>
            {item.specNo}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" color="textSecondary" noWrap>
            {item.attributeNo}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" color="textSecondary" noWrap>
            {item.from}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" color="textSecondary" noWrap>
            {item.shipToCity}, {item.shipToState}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" color="textSecondary" noWrap>
            {item.etd}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" color="textSecondary" noWrap>
            {item.eta}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" color="textSecondary" noWrap>
            {item.weight}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" color="textSecondary" noWrap>
            {item.releaseNo}
          </Typography>
        </TableCell>

      </TableRow>
      {/* {
        inventories && 
        itemAssignMethods.fields && itemAssignMethods.fields.map((itemAssign, index2) => {
          return ( */}
            <OrderShipmentItem 
              /* key={itemAssign._id} itemAssignMethods={itemAssignMethods} itemAssign={itemAssign} index={index} index2={index2} inventories={inventories} from={item.from}  */
              />
          {/* )
        })
      } */}
    </React.Fragment>
  );
}