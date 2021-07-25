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
  InputAdornment,
  Checkbox
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
  inputProps: {
    '& .MuiAutocomplete-input': {
      fontSize: 'small'
    }
  }
}));

interface ShipmentItemInnerProps {
  item: any;
  index: any;
  sites: FromSite[];
  OpenOrderEdit: (event: React.MouseEvent<unknown>, orderNo: string) => void;
  handleClickPopover: (event: React.MouseEvent<HTMLButtonElement>) => void;
  setLotDialog: any;
  inventories: Inventory[];
}

const ShipmentItemInner: FC<ShipmentItemInnerProps> = ({
  item,
  index,
  sites,
  OpenOrderEdit,
  handleClickPopover,
  setLotDialog,
  inventories,
  ...rest }) => {
  console.log('ShipmentItemInner.item', item);
  const classes = useStyles();
  const { control, register } = useFormContext(); // retrieve all hook methods
  const itemAssignMethods = useFieldArray(
    {
      control: control,
      name: `lots.${index}.itemAssigns`,
      keyName: "_id"
    }
  );

  const createSiteList = () => {
    const arr = sites.map(a => a.site)
    const siteList = ([].concat(...arr))
    return (
      siteList
    )
  };

  const siteOption = createSiteList()

  return (
    <React.Fragment>
      <TableRow className={classes.inputProps}>
        <TableCell align="center">
          <Checkbox size="small"/>
        </TableCell>
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
          <input type="hidden" ref={register()} name={`lots[${index}].weight`} defaultValue={item.weight} />
          <Button
            color='primary'
            size="small"
            onClick={(event) => OpenOrderEdit(event, item.salesOrderNo)} >
            <Typography variant="caption" color="textPrimary" noWrap style={{ textDecoration: 'underline', fontWeight: 'lighter' }}>
              {item.salesOrderNo}
            </Typography>
          </Button>
        </TableCell>

        <TableCell style={{ maxWidth: 170, textOverflow: "ellipsis", overflow: "hidden" }}>
          <Typography variant="caption" color="textSecondary" noWrap>
            {item.customerNo}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="caption" color="textSecondary" noWrap>
            {item.specNo}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="caption" color="textSecondary" noWrap>
            {item.attributeNo}
          </Typography>
        </TableCell>

        <Tooltip
          arrow
          placement="left"
          title={item.siteDescription ?? ''}
        >
          <TableCell align="center">
            <Typography variant="caption" color="textSecondary" noWrap>
              {item.from}
            </Typography>
          </TableCell>
        </Tooltip>

        <TableCell style={{ width: 120 }} className={classes.inputProps}>
          <Controller
            name={`lots[${index}].to`}
            control={control}
            defaultValue={item.to}
            margin="dense"
            render={(props) => (
              <Autocomplete
                {...props}
                autoHighlight
                options={siteOption}
                getOptionLabel={(option) => option}
                onChange={(e, value) => props.onChange(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                  />
                )}
              />
            )}
          />
        </TableCell>

        <TableCell style={{ width: 200 }} >
          <Controller
            name={`lots[${index}].etd`}
            control={control}
            defaultValue={item.etd}
            margin="dense"
            render={({ onChange, value }) => (
              <KeyboardDatePicker
                autoComplete="off"
                variant="inline"
                format="MM/DD/yyyy"
                onChange={(v) => onChange(v)}
                inputProps={{ style: { textAlign: 'right', fontSize: 'small' } }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                  size: "small"
                }}
                value={value}
              />
            )}
          />
        </TableCell>
        <TableCell style={{ width: 200 }}>
          <Controller
            name={`lots[${index}].eta`}
            control={control}
            defaultValue={item.eta}
            margin="dense"
            render={({ onChange, value }) => (
              <KeyboardDatePicker
                autoComplete="off"
                disableToolbar
                variant="inline"
                format="MM/DD/yyyy"
                onChange={(v) => onChange(v)}
                inputProps={{ style: { textAlign: 'right', fontSize: 'small' } }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                  size: "small"
                }}
                value={value}
              />
            )}
          />
        </TableCell>

        <TableCell>
          <Typography variant="body2" align="right" >
            {numeral(item.weight).format('0,0')}
          </Typography>
        </TableCell>

        <TableCell >
          <Typography variant="body2" align="right" noWrap>
            {numeral(item.itemAssigns.reduce((a, b) => {
              //console.log('item.itemAssigns.reduce', a, numeral(b.item.weight)._value);
              return a + numeral(b.item.weight)._value;
            }
              , 0)).format('0,0')}
          </Typography>
        </TableCell>

        <TableCell>
          <Controller
            name={`lots[${index}].releaseNo`}
            control={control}
            defaultValue={item.releaseNo ?? ''}
            autoComplete="off"
            inputProps={{ style: { fontSize: 'small' } }}
            as={TextField}
          />
        </TableCell>

        <TableCell style={{ width: 90 }}>
          <Grid container justify="flex-end">
            <Grid item>
              <Tooltip
                title="Assign Item"
              >
                <IconButton
                  size="small"
                  onClick={() => {
                    //alert('click');
                    //AddAllocation(index);
                    itemAssignMethods.append({
                      id: uuidv4(),
                      item: {
                        weight: 0
                      }
                    });
                  }}
                >
                  <AddShoppingCartOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Grid>

            <Grid item>
              <Tooltip title="Delete">
                <IconButton
                  /* onClick={() => itemMethods.remove(index)}
                  size="small" 
                  aria-describedby={id}
                  */
                  size="small"
                  onClick={(event) => {
                    setLotDialog({
                      isOpen: true,
                      index: index
                    });
                    handleClickPopover(event);
                  }}
                >
                  <SvgIcon>
                    <DeleteIcon />
                  </SvgIcon>
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>

        </TableCell>
      </TableRow>
      {
        inventories &&
        itemAssignMethods.fields && itemAssignMethods.fields.map((itemAssign, index2) => {
          return (
            <ShipmentAssignedItem key={itemAssign._id} itemAssignMethods={itemAssignMethods} itemAssign={itemAssign} index={index} index2={index2} inventories={inventories} from={item.from} />
          )
        })
      }
    </React.Fragment>
  );
}

export default ShipmentItemInner;
