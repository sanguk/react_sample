import React from 'react';
//import { FieldArray, FastField } from "formik";
import type { FC } from 'react';
//import PropTypes from 'prop-types';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
//import axios2 from 'src/utils/axios2';
//import numeral from 'numeral';
import {
  Box,
  //Table,
  //TableBody,
  TableCell,
  //TableHead,
  TableRow,
  Typography,
  makeStyles,
  Button,
  TextField,
  Grid,
  SvgIcon,
  //Checkbox,
  //TableContainer,
  IconButton,
  //Dialog,
  //DialogActions,
  //DialogTitle,
  //MenuItem,
  Popover,
  Tooltip,
  //createMuiTheme,
} from '@material-ui/core';
import type { Inventory } from 'src/types/simpleorder';
import { Controller, useFormContext } from "react-hook-form";
//import type { Spec, Attribute, Category } from 'src/types/spec';
import { Autocomplete } from '@material-ui/lab';
//import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
//import InputAdornment from '@material-ui/core/InputAdornment';
//import { AlignRight } from 'react-feather';
//import { Theme } from '@fullcalendar/core';
//import NumberFormat from 'react-number-format';

interface ShipmentAssignedItemProps {
  itemAssignMethods: any;
  itemAssign: any;
  index;
  index2;
  inventories: Inventory[];
  from: string;
}

const useStyles = makeStyles(() => ({
  inputProps: {
    '& .MuiOutlinedInput-root': {
      fontSize: 'small'
    }
  }
}))

const ShipmentAssignedItem: FC<ShipmentAssignedItemProps> = ({ itemAssignMethods, itemAssign, index, index2, inventories, from, ...rest }) => {
  const isMountedRef = useIsMountedRef('OrderItemProps');
  const classes = useStyles();
  const { control, register, getValues } = useFormContext(); // retrieve all hook methods

  //console.log('itemAssign?.item', itemAssign?.item, inventories);
  //console.log('shipmentAssignedItem from', from)
  //console.log('shipmentAssignedItem inventories', inventories)

  const shipment = getValues();

  //const allocationMethods = useFieldArray(
  //  {
  //    control: control,
  //    name: `lots.${index}.allocations`,
  //    //keyName: "id"
  //  }
  //);

  const [itemAssignDialog, setItemAssignDialog] = React.useState({
    isOpen: false,
    arrayHelpers: null,
    index2: null
  });

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <TableRow>
      <TableCell colSpan={3}>
        {/*<input type="hidden" ref={register()} name={`lots.${index}.itemAssigns.${index2}.id`} defaultValue={itemAssign.id} />*/}
      </TableCell>

      <TableCell colSpan={3} className={classes.inputProps}>
        <Grid item>
          <input type="hidden" ref={register()} name={`lots[${index}].itemAssigns.${index2}.id`} defaultValue={itemAssign.id} />
          <Controller
            name={`lots.${index}.itemAssigns.${index2}.item`}
            control={control}
            defaultValue={itemAssign.item}
            render={(props) => (
              <Autocomplete
                {...props}
                //id={name}
                //style={{ width: 570 }}

                options={inventories.filter(a => a.currentLocation == from && (a.shNo == null || a.shNo == shipment.no))}

                getOptionSelected={(option, value) => value.itemNo === option.itemNo}
                getOptionLabel={(option) => option.itemNo + ' | ' + option.weight + ' | ' + option.length + ' | ' + option.currentLocation + (option.shlaNo == null ? '' : (' | ' + option.shNo)) }

                renderInput={(params) =>
                  <TextField
                    {...params}
                    label="ItemNo | LB | FT"
                    variant="outlined"
                    margin="dense"
                    style={{ backgroundColor: 'rgba(66, 26, 126, 0.0818)' }}
                    size="small"
                    //autoFocus
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />}

                renderOption={(option) => {
                  return (
                    <Grid container alignItems="center">
                      <Grid item>
                        {option.itemNo} | {option.weight} | {option.length} | {option.currentLocation + (option.shlaNo == null ? '' : (' | ' + option.shNo))}
                      </Grid>
                    </Grid>
                  );
                }}

                onChange={(e, value) => props.onChange(value)}

                filterOptions={(options, state) => {
                  if (state.inputValue == '')
                    return options;

                  var result: Inventory[] = [];
                  var splitted = state.inputValue.toLowerCase().split(" ", 5);
                  //console.log(splitted);

                  options.forEach(function (value) {
                    var isMatch = true;
                    splitted.forEach(function (u) {
                      if (value.itemNo.toLowerCase().indexOf(u) == -1
                        && value.weight.toLowerCase().indexOf(u) == -1
                        && value.length.toLowerCase().indexOf(u) == -1) {
                        isMatch = false;
                      }
                    });

                    if (isMatch) {
                      result.push(value);
                    }
                  });

                  return result;
                }}
              />
            )}
          />
          {/*  {index} {index2} */}
        </Grid>
      </TableCell>

      <TableCell colSpan={6} />

      <TableCell align="right">
        <Grid item>
          <Tooltip
            title="Delete"
          >
            <IconButton size="small"
              aria-describedby={id}
              onClick={(event) => {
                setItemAssignDialog({
                  isOpen: true,
                  arrayHelpers: itemAssignMethods,
                  index2: index2
                });
                handleClick(event);
              }}
            >
              <SvgIcon>
                <DeleteIcon />
              </SvgIcon>
            </IconButton>
          </Tooltip>

          <Popover
            id={id}
            anchorEl={anchorEl}
            open={itemAssignDialog.isOpen}
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
                Delete Item?
                </Typography>
            </Box>
            <Box >
              <Button color="primary" size="small" variant="outlined" style={{ margin: 10 }}
                onClick={() => {
                  setItemAssignDialog({
                    isOpen: false,
                    arrayHelpers: null,
                    index2: null
                  });
                }} >
                CANCEL
                    </Button>
              <Button color="primary" size="small" variant="contained" style={{ margin: 10 }}
                onClick={() => {
                  itemAssignDialog.arrayHelpers.remove(itemAssignDialog.index2);
                  setItemAssignDialog({
                    isOpen: false,
                    arrayHelpers: null,
                    index2: null
                  });
                }}>
                Delete
                  </Button>
            </Box>
          </Popover>
        </Grid>
      </TableCell>
    </TableRow>
  )
}

export default ShipmentAssignedItem