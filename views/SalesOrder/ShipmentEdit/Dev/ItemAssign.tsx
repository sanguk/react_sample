import React, { useCallback, useState, useEffect, Attributes, forwardRef, useRef, useImperativeHandle } from 'react';
//import { FieldArray, FastField } from "formik";
import type { FC } from 'react';
import PropTypes from 'prop-types';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import axios2 from 'src/utils/axios2';
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
import type { Order, Lot, OrderStatus, Allocation, FromSite } from 'src/types/simpleorder';
import { useForm, Controller, SubmitHandler, useFieldArray, FormProvider, UseFormMethods, useFormContext } from "react-hook-form";
import type { Spec, Attribute, Category } from 'src/types/spec';
import { Autocomplete } from '@material-ui/lab';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import InputAdornment from '@material-ui/core/InputAdornment';
import { AlignRight } from 'react-feather';
import { Theme } from '@fullcalendar/core';
import NumberFormat from 'react-number-format';

interface ItemAssignProps {
  // allocationMethods: any;
  // allocation: any;
  // index;
  // index2;
}

const useStyles = makeStyles(() => ({
  inputProps: {
    '& .MuiOutlinedInput-root': {
      fontSize: 'small'
    }
  }
}))

const ItemAssign: FC<ItemAssignProps> = ({


}) => {
  const isMountedRef = useIsMountedRef('OrderItemProps');
  const classes = useStyles();
  const { control, register } = useFormContext(); // retrieve all hook methods

  //const allocationMethods = useFieldArray(
  //  {
  //    control: control,
  //    name: `lots.${index}.allocations`,
  //    //keyName: "id"
  //  }
  //);

  const [allocationDialog, setAllocationDialog] = React.useState({
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

  const [fromSites, setFromSites] = useState<FromSite[]>([]);
  const getFromSites = useCallback(async () => {
    try {
      const response = await axios2.get<FromSite[]>('/fromSite/list');
      //console.log('response.data', response.data);

      if (isMountedRef.current) {
        setFromSites(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getFromSites();
  }, [getFromSites]);

  return (
    // <TableRow>
    //   <TableCell colSpan={2} />
    //   <TableCell colSpan={2}>
    //     <Grid container justify="flex-end" className={classes.inputProps}>
    //       <Grid item xs={12} sm={3} style={{ marginLeft: 10 }}>
    //         <Controller
    //           name={`lots.${index}.allocations.${index2}.source`}
    //           control={control}
    //           defaultValue={allocation.source ?? 'Order'}
    //           render={(props) => (
    //             <TextField
    //               select
    //               fullWidth
    //               label="source"
    //               onChange={(value) => {
    //                 props.onChange(value);
    //               }}
    //               value={props.value}
    //               variant="outlined"
    //               size="small"
    //               margin="dense"
    //               style={{ backgroundColor: 'rgba(66, 26, 126, 0.0818)' }}
    //             >
    //               <MenuItem value={'Order'}>ORDER</MenuItem>
    //               <MenuItem value={'Inv'}>INV</MenuItem>
    //             </TextField>
    //           )}
    //         />
    //       </Grid>

    //       <Grid item xs={12} sm={3} style={{ marginLeft: 10 }}>
    //         <Controller
    //           name={`lots.${index}.allocations.${index2}.relatedOrder`}
    //           control={control}
    //           as={TextField}
    //           defaultValue={allocation.relatedOrder ?? ''}
    //           autoComplete="off"
    //           label="related orders"
    //           variant="outlined"
    //           fullWidth
    //           size="small"
    //           margin="dense"
    //           style={{ backgroundColor: 'rgba(66, 26, 126, 0.0818)' }} //'rgba(255, 152, 0, 0.1818)'
    //         />
    //       </Grid>

    //       <Grid item xs={12} sm={3} style={{ marginLeft: 10 }}>
    //         <Controller
    //           name={`lots.${index}.allocations.${index2}.fromSite`}
    //           control={control}
    //           defaultValue={allocation.fromSite ?? ''}
    //           render={(props) => (
    //             <Autocomplete
    //               {...props}
    //               size='small'
    //               autoHighlight
    //               options={fromSites.map(u => u.site)}
    //               getOptionLabel={(option) => option}
    //               onChange={(e, value) => props.onChange(value)}
    //               renderInput={(params) =>
    //                 <TextField
    //                   {...params}
    //                   label="from"
    //                   variant="outlined"
    //                   margin="dense"
    //                   style={{ backgroundColor: 'rgba(66, 26, 126, 0.0818)' }}
    //                   //autoFocus
    //                   InputProps={{
    //                     ...params.InputProps,
    //                     endAdornment: (
    //                       <React.Fragment>
    //                         {params.InputProps.endAdornment}
    //                       </React.Fragment>
    //                     ),
    //                   }}
    //                 />}
    //             />
    //           )}
    //         />
    //       </Grid>
    //     </Grid>

    //   </TableCell>

    //   <TableCell>
    //     <Grid container>
    //       <Grid item>
    //         <Controller
    //           name={`lots.${index}.allocations.${index2}.weight`}
    //           control={control}
    //           defaultValue={allocation.weight ?? 0}
    //           as={
    //             <NumberFormat
    //               autoComplete="off"
    //               //fullWidth
    //               thousandSeparator
    //               isNumericString
    //               customInput={TextField}
    //             >
    //             </NumberFormat>
    //           }

    //           size="small"
    //           margin="dense"
    //           variant="outlined"
    //           style={{ backgroundColor: 'rgba(66, 26, 126, 0.0818)' }}
    //           inputProps={{ style: { textAlign: 'right', fontSize: 'small' } }}
    //         />
    //       </Grid>
    //     </Grid>

    //   </TableCell>

    //   <TableCell colSpan={4} />

    //   <TableCell align="right">
    //     <Tooltip
    //       title="Delete"
    //     >
    //       <IconButton size="small"
    //         aria-describedby={id}
    //         onClick={(event) => {
    //           setAllocationDialog({
    //             isOpen: true,
    //             arrayHelpers: allocationMethods,
    //             index2: index2
    //           });
    //           handleClick(event);
    //         }}
    //       >
    //         <SvgIcon>
    //           <DeleteIcon />
    //         </SvgIcon>
    //       </IconButton>
    //     </Tooltip>

    //   </TableCell>

    //   <Popover
    //     id={id}
    //     anchorEl={anchorEl}
    //     open={allocationDialog.isOpen}
    //     anchorOrigin={{
    //       vertical: 'center',
    //       horizontal: 'right',
    //     }}
    //     transformOrigin={{
    //       vertical: 'center',
    //       horizontal: 'right',
    //     }}
    //   >
    //     <Box m={2}>
    //       <Typography variant="h5" align="center">
    //         Delete Item?
    //               </Typography>
    //     </Box>
    //     <Box m={1}>
    //       <Button color="primary" size="small"
    //         onClick={() => {
    //           allocationDialog.arrayHelpers.remove(allocationDialog.index2);

    //           setAllocationDialog({
    //             isOpen: false,
    //             arrayHelpers: null,
    //             index2: null
    //           });
    //         }}>
    //         Delete
    //               </Button>
    //       <Button color="primary" size="small"
    //         onClick={() => {
    //           setAllocationDialog({
    //             isOpen: false,
    //             arrayHelpers: null,
    //             index2: null
    //           });
    //         }} >
    //         CANCEL
    //             </Button>
    //     </Box>
    //   </Popover>
    // </TableRow>

    <TableRow>
      <TableCell align="center">Sales Order</TableCell>
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




  )
}

export default ItemAssign