import React, { useCallback, useState, useEffect, Attributes, useRef, useImperativeHandle, forwardRef } from 'react';
//import { FieldArray, FastField } from "formik";
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
  Checkbox,
  TableContainer,
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle,
  MenuItem,
  Popover,
  Tooltip,
  createMuiTheme,
} from '@material-ui/core';
import { useForm, Controller, SubmitHandler, useFieldArray, FormProvider, UseFormMethods, useFormContext } from "react-hook-form";
import type { Spec, Attribute, Category } from 'src/types/spec';
import { AlignRight } from 'react-feather';
import NumberFormat from 'react-number-format';
import { Theme } from '@fullcalendar/core';
import { Autocomplete } from '@material-ui/lab';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import InputAdornment from '@material-ui/core/InputAdornment';
import DeleteIcon from '@material-ui/icons/Delete';
import { DatePicker, KeyboardDatePicker } from '@material-ui/pickers';

import useIsMountedRef from 'src/hooks/useIsMountedRef';
import axios2 from 'src/utils/axios2';
import type { Order, Lot, OrderStatus, Inventory, FromSite, ShipmentTableType } from 'src/types/simpleorder';
import useFilters from 'src/views/dev/SalesOrder/Main/useFilters';
//import FormikSelectFromSite from 'src/components/FormikSelect/FormikSelectFromSite';
//import OrderAllocation from './OrderAllocation';
import { v4 as uuidv4 } from 'uuid';

interface AssignedItemProps {
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
  },
  inputProps: {
    '& .MuiAutocomplete-input': {
      fontSize: 'small'
    }
  }
}));

let renderCount = 0;

const AssignedItem: FC<AssignedItemProps> = ({ className, OpenOrderEdit, ...rest }) => {
  const classes = useStyles();
  renderCount++;
  console.log('AssignedItem Render... ' + renderCount);

  const isMountedRef = useIsMountedRef();
  const [inventory, setInventory] = useState<Inventory[]>([]);

  const { control, getValues, register, watch } = useFormContext(); // retrieve all hook methods

  const shipment = getValues();

  const itemMethods = useFieldArray(
    {
      control: control,
      name: "lots",
      keyName: "_id"
    }
  );

  const getSite = useCallback(async () => {
    try {
      const response = await axios2.get<Inventory[]>('/Inventory/listBySH/' + shipment.no);
      console.log('/Inventory/listBySH/' + shipment.no, response);

      if (isMountedRef.current) {
        setInventory(response.data);
      }
      else {
        debugger;
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getSite();
  }, [getSite]);

  return (
    <Box style={{ paddingTop: 13 }}>
      <Box mt={2}>
        <TableContainer className={classes.container}>
          <Table size="small" stickyHeader className={classes.cell}>
            <TableHead>
              <TableRow>
                <TableCell align="center">Sales Order</TableCell>
                <TableCell align="center">Customer</TableCell>
                <TableCell align="center">Product</TableCell>
                <TableCell align="center">From Site</TableCell>
                <TableCell align="center">Ship To</TableCell>
                <TableCell align="center">ETD</TableCell>
                <TableCell align="center">ETA</TableCell>
                <TableCell align="center">Allocated</TableCell>
                <TableCell align="center">Weight</TableCell>
                <TableCell align="center">Release No</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {itemMethods.fields.map((item, index) => {
                return (
                  <TableRow key={item._id}>
                    <TableCell align="center">
                      <input type="hidden" ref={register()} name={`lots[${index}].id`} defaultValue={item.id} />
                      <input type="hidden" ref={register()} name={`lots[${index}].salesOrderNo`} defaultValue={item.salesOrderNo} />
                      <input type="hidden" ref={register()} name={`lots[${index}].salesOrderLot`} defaultValue={item.salesOrderLot} />
                      <input type="hidden" ref={register()} name={`lots[${index}].allocationId`} defaultValue={item.allocationId} />
                      <input type="hidden" ref={register()} name={`lots[${index}].customerNo`} defaultValue={item.customerNo} />
                      <input type="hidden" ref={register()} name={`lots[${index}].from`} defaultValue={item.from} />
                      {/*<input type="hidden" ref={register()} name={`lots[${index}].to`} defaultValue={item.to} />*/}
                      <input type="hidden" ref={register()} name={`lots[${index}].categoryId`} defaultValue={item.categoryId} />
                      <input type="hidden" ref={register()} name={`lots[${index}].specId`} defaultValue={item.specId} />
                      <input type="hidden" ref={register()} name={`lots[${index}].attributeId`} defaultValue={item.attributeId} />
                      <input type="hidden" ref={register()} name={`lots[${index}].qtyUnit`} defaultValue={item.qtyUnit} />
                      <Button
                        color='primary'
                        size="small"
                        onClick={(event) => OpenOrderEdit(event, item.salesOrderNo)} >
                        <Typography variant="body2" color="textPrimary" noWrap style={{ textDecoration: 'underline', fontWeight: 'lighter' }}>
                          {item.salesOrderNo}
                        </Typography>
                      </Button>
                    </TableCell>
                    <TableCell style={{ maxWidth: 200, textOverflow: "ellipsis", overflow: "hidden" }}>
                      <Typography variant="body2" color="textSecondary" noWrap>
                        {item.customerNo}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary" noWrap>
                        {item.specNo}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="textSecondary" noWrap>
                        {item.from}
                      </Typography>
                    </TableCell>
                    <TableCell style={{ width: 120 }} className={classes.inputProps}>
                      {item.to}
                    </TableCell>
                    <TableCell style={{ width: 170 }} >
                      {item.etd}
                    </TableCell>
                    <TableCell style={{ width: 170 }}>
                      {item.eta}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap>
                        {numeral(item.weight).format('0,0')}
                      </Typography>
                    </TableCell>
                    <TableCell style={{ width: 120 }}>
                      {item.weight}
                    </TableCell>
                    <TableCell>
                      {item.releaseNo}
                    </TableCell>
                    <TableCell align="center">
                      
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

AssignedItem.propTypes = {
  // @ts-ignore
  // card: PropTypes.object.isRequired,
  className: PropTypes.string,
  // @ts-ignore
  // list: PropTypes.object.isRequired,
  //onClose: PropTypes.func,
  //open: PropTypes.bool.isRequired
};

AssignedItem.defaultProps = {
  //open: false,
  //onClose: () => { }
};

export default AssignedItem;