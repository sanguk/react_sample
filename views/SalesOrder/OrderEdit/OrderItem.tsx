import React, { useCallback, useState, useEffect } from 'react';
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
  MenuItem,
  Popover,
  Tooltip,
} from '@material-ui/core';
//import type { Order, Lot, OrderStatus, Allocation, FromSite, OrderUseFormMethods, OrderLotUseFormMethods, OrderAllocationUseFormMethods } from 'src/types/simpleorder';
import {  Controller, useFieldArray, useFormContext } from "react-hook-form";
import type { Spec, Attribute, Category } from 'src/types/spec';
import { Autocomplete } from '@material-ui/lab';
//import FormikSelectFromSite from 'src/components/FormikSelect/FormikSelectFromSite';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import InputAdornment from '@material-ui/core/InputAdornment';
//import { AlignRight } from 'react-feather';
//import { Theme } from '@fullcalendar/core';
import NumberFormat from 'react-number-format';

import OrderAllocation from './OrderAllocation';
import { v4 as uuidv4 } from 'uuid';
//import { method } from 'lodash';
//import Child from './OrderAllocation';

interface OrderItemProps {
  className?: string;
  //methods: UseFormMethods<OrderUseFormMethods>;
  onClose?: () => void;
}

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
    }
  },
  inputProps: {
    '& .MuiSelect-selectMenu': {
      fontSize: 'small'
    },
    '& .MuiAutocomplete-input': {
      fontSize: 'small'
    }
  }
}));

let renderCount = 0;

const OrderItem: FC<OrderItemProps> = ({ className, onClose, ...rest }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef('OrderItemProps');
  const [category, setCategory] = React.useState<Category>(null);
  const [spec, setSpec] = React.useState<Spec>(null);
  const [attribute, setAttribute] = React.useState<Attribute>(null);
  const [lotDialog, setLotDialog] = React.useState({
    isOpen: false,
    index: null
  });
  /* const [fromSite, setFromSite] = React.useState<FromSite>(null); */

  renderCount++;
  //console.log('Order item Render...' + renderCount);

  const { control, watch } = useFormContext(); // retrieve all hook methods

  const watchAllFields = watch(['shipTo']);
  //const order = getValues();
  //console.log('methods.getValues()' + order);


  const itemMethods = useFieldArray(
    {
      control: control,
      name: "lots",
      keyName: "_id"
    }
  );

  //console.log('itemMethods.fields' + itemMethods.fields);

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

  const [categorys, setCategorys] = useState<Category[]>([]);
  const getCategorys = useCallback(async () => {
    try {
      const response = await axios2.get<Category[]>('/category/list');
      //console.log('response.data', response.data);

      if (isMountedRef.current) {
        setCategorys(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getCategorys();
  }, [getCategorys]);

  const [specs, setSpecs] = useState<Spec[]>([]);
  const getSpecs = useCallback(async () => {
    try {
      const response = await axios2.get<Spec[]>('/spec/list');
      //console.log('response.data', response.data);

      if (isMountedRef.current) {
        setSpecs(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getSpecs();
  }, [getSpecs]);

  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const getAttributes = useCallback(async () => {
    try {
      const response = await axios2.get<Attribute[]>('/attribute/list');
      //console.log('response.data', response.data);

      if (isMountedRef.current) {
        setAttributes(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getAttributes();
  }, [getAttributes]);

  useEffect(() => {
    if (spec == null) {
      setAttribute(null);
    }
  }, [spec]);


  //React.useEffect(() => {
  //  console.log('React.useEffect(() => { itemMethods.fields');
  //}, itemMethods.fields)
  //var index2222 = 1;
  //const allocationMethods = useFieldArray(
  //  {
  //    control: control,
  //    name: `lots.${index2222}.allocations`,
  //    //keyName: "id"
  //  }
  //);

  //const AddAllocation = (index: number) => {
  //  allocationMethods.append({} as Allocation);
  //}



  return (
    <Box style={{ paddingTop: 13 }}>
      {/*<Grid container spacing={2}>
              <Grid item>
                <FormLabel component="legend">Product Grade</FormLabel>
                <RadioGroup row name="Product Grade" value={value} onChange={handleChangeRadio}>
                  <FormControlLabel value="Prime" control={<Radio />} label="Prime" />
                  <FormControlLabel value="Secondary" control={<Radio />} label="Secondary" />
                  <FormControlLabel value="Reject" control={<Radio />} label="Reject" />
                </RadioGroup>
              </Grid>
            </Grid> */}

      <Grid container spacing={2} className={classes.autocomplete}>
        <Grid item xs={12} sm={12} md={3}>
          <Autocomplete
            id="select1"
            value={category}
            options={categorys}
            onChange={(event: any, newValue: Category | null) => {
              //console.log('onChange', newValue);
              setCategory(newValue);
              //setAttribute(null);
            }}
            filterOptions={(options, state) => {
              if (state.inputValue === '')
                return options;

              var result: Category[] = [];
              var splitted = state.inputValue.toLowerCase().split(" ", 5);
              //console.log(splitted);

              options.forEach(function (value) {
                var isMatch = true;
                splitted.forEach(function (u) {
                  if (value.categoryNo.toLowerCase().indexOf(u) === -1) // && value.categoryNo.toLowerCase().indexOf(u) == -1
                  {
                    isMatch = false;
                  }
                });

                if (isMatch) {
                  result.push(value);
                }
              });

              return result;
            }}
            getOptionLabel={(option) => option.categoryNo}
            style={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Products" variant="outlined" />}
            renderOption={(option) => {
              //console.log('renderOption', option);
              return (
                <Grid container alignItems="center">
                  <Grid item>
                    {option.categoryNo}
                  </Grid>
                </Grid>
              );
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <Autocomplete
            id="select2"
            value={spec}
            options={specs === undefined ? [] : specs}
            onChange={(event: any, newValue: Spec | null) => {
              setSpec(newValue);
            }}
            filterOptions={(options, state) => {
              if (state.inputValue === '')
                return options;

              var result: Spec[] = [];
              var splitted = state.inputValue.toLowerCase().split(" ", 5);
              //console.log(splitted);

              options.forEach(function (value) {
                var isMatch = true;
                splitted.forEach(function (u) {
                  if (value.specNo.toLowerCase().indexOf(u) === -1) {
                    isMatch = false;
                  }
                });

                if (isMatch) {
                  result.push(value);
                }
              });

              return result;
            }}
            getOptionLabel={(option) => option.specNo}
            style={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Specs" variant="outlined" />}
            noOptionsText='No selected spec'

            renderOption={(option) => {
              return (
                <Grid container alignItems="center">
                  <Grid item>
                    {option.specNo}
                  </Grid>
                </Grid>
              );
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Autocomplete
            id="select3"
            value={attribute}
            options={attributes === undefined ? [] : attributes}
            onChange={(event: any, newValue: Attribute | null) => {
              setAttribute(newValue);
            }}
            filterOptions={(options, state) => {
              if (state.inputValue === '')
                return options;

              var result: Attribute[] = [];
              var splitted = state.inputValue.toLowerCase().split(" ", 5);
              //console.log(splitted);

              options.forEach(function (value) {
                var isMatch = true;
                splitted.forEach(function (u) {
                  if (value.attributeNo.toLowerCase().toString().indexOf(u) === -1) {
                    isMatch = false;
                  }
                });

                if (isMatch) {
                  result.push(value);
                }
              });

              return result;
            }}
            getOptionLabel={(option) => option.attributeNo}
            style={{ width: 400 }}
            renderInput={(params) => <TextField {...params} label="Attributes" variant="outlined" />}
            noOptionsText='No selected spec'

            renderOption={(option) => {
              return (
                <Grid container alignItems="center">
                  <Grid item>
                    {option.paintBrand + ' | ' + option.paintType + ' | ' + option.paintCode + ' | ' + option.paintColor}
                  </Grid>
                </Grid>
              );
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={2}>
          <Box mt={2} textAlign="right">
            <Button
              color="secondary"
              size="large"
              variant="contained"
              onClick={() => {
                //console.log(watchAllFields.shipTo);
                //console.log(watchAllFields.shipTo.length);

                watchAllFields.shipTo.length && category && spec && attribute &&

                  itemMethods.append({
                    id: uuidv4(),
                    product: category.product,

                    categoryId: category.categoryId.toString(),
                    categoryNo: category.categoryNo,

                    type: category.type,
                    finish: category.finish,

                    specId: spec.specId.toString(),
                    specNo: spec.specNo,

                    attributeId: attribute.id.toString(),
                    attributeNo: category.categoryNo,

                    qty: 0,
                    qtyUnit: 'LB',
                    amount: 0,
                    unitPrice: 0,
                    weight: 0,

                    allocations: [],
                  } /*as OrderLotUseFormMethods*/)
              }
              }
            >
              add lot
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Box mt={2}>
        <TableContainer className={classes.container}>
          <Table size="small" stickyHeader className={classes.cell}>
            <TableHead>
              <TableRow>
                <TableCell align="center"></TableCell>
                <TableCell align="center">Product</TableCell>
                <TableCell align="center">Spec</TableCell>
                <TableCell align="center">Attributes</TableCell>
                <TableCell align="center">Weight (lb)</TableCell>
                <TableCell align="center">Qty</TableCell>
                <TableCell align="center">Unit</TableCell>
                <TableCell align="center">Unit Price</TableCell>
                <TableCell align="center">Amount</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {itemMethods.fields.map((lot, index) => {
                return (
                  <OrderItemInner key={lot._id} itemMethods={itemMethods} lot={lot} index={index} />
                );
              })
              }
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
          <Box m={2}>
            <Typography variant="h5">
              Delete the lot?
                  </Typography>
          </Box>
          <Box m={1}>
            <Button color="primary" size="small"
            //onClick={() => {
            //  arrayHelpers.remove(lotDialog.index);
            //  setLotDialog({
            //    isOpen: false,
            //    index: null
            //  });
            //}}
            >
              YES
                  </Button>
            <Button color="primary" size="small"
              onClick={() => {
                setLotDialog({
                  isOpen: false,
                  index: null
                })
              }}>
              CANCEL
                  </Button>
          </Box>
        </Popover>

        <Popover
          id={id}
          anchorEl={anchorEl}
          open={allocationDialog.isOpen}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
        >
          <Box m={2}>
            <Typography variant="h5">
              Delete the item?
                  </Typography>
          </Box>
          <Box m={1}>
            <Button color="primary" size="small"
              onClick={() => {
                allocationDialog.arrayHelpers.remove(allocationDialog.index2);

                setAllocationDialog({
                  isOpen: false,
                  arrayHelpers: null,
                  index2: null
                });
              }}>
              YES
                  </Button>
            <Button color="primary" size="small"
              onClick={() => {
                setAllocationDialog({
                  isOpen: false,
                  arrayHelpers: null,
                  index2: null
                });
              }} >
              CANCEL
                </Button>
          </Box>
        </Popover>

        {/*   <Dialog
              open={lotDialog.isOpen}
              style={{ bottom: '60%', left: '80%' }}
            >
              <DialogTitle>
                <Typography variant="h4">
                  Delete the lot?
                  </Typography>
              </DialogTitle>

              <DialogActions>
                <Button color="primary"
                  onClick={() => {
                    arrayHelpers.remove(lotDialog.index);
                    setLotDialog({
                      isOpen: false,
                      index: null
                    });
                  }}>
                  YES
                  </Button>
                <Button color="primary"
                  onClick={() => {
                    setLotDialog({
                      isOpen: false,
                      index: null
                    })
                  }}>
                  CANCEL
                  </Button>
              </DialogActions>
            </Dialog> */}

        {/*  <Dialog
              open={allocationDialog.isOpen}
              style={{ bottom: '50%', left: '80%' }}
            >
              <DialogTitle>
                <Typography variant="h4">
                  Delete the item?
                  </Typography>
              </DialogTitle>
              <DialogActions>
                <Button color="primary"
                  onClick={() => {
                    allocationDialog.arrayHelpers.remove(allocationDialog.index2);

                    setAllocationDialog({
                      isOpen: false,
                      arrayHelpers: null,
                      index2: null
                    });
                  }}>
                  YES
                  </Button>
                <Button color="primary"
                  onClick={() => {
                    setAllocationDialog({
                      isOpen: false,
                      arrayHelpers: null,
                      index2: null
                    });
                  }} >
                  CANCEL
                  </Button>
              </DialogActions>
            </Dialog> */}

      </Box>
    </Box>
    //    {/*
    //    <br />
    //    <div><pre>{JSON.stringify(order.lots, null, 2)}</pre></div>
    //    <div>{`spec: ${spec !== null ? `'${JSON.stringify(spec, null, 2)}'` : 'null'}`}</div>
    //    <div>{`attribute: ${attribute !== null ? `'${JSON.stringify(attribute, null, 2)}'` : 'null'}`}</div>
    //    */}
  );
};

OrderItem.propTypes = {
  className: PropTypes.string,
};

OrderItem.defaultProps = {

};

export default OrderItem;

interface OrderItemInnerProps {
  lot: any;
  index: any;
  itemMethods: any;
}

const OrderItemInner: FC<OrderItemInnerProps> = ({ itemMethods, lot, index, ...rest }) => {
  //console.log('lot', lot);

  const classes = useStyles();
  const { control, register } = useFormContext(); // retrieve all hook methods
  const allocationMethods = useFieldArray(
    {
      control: control,
      name: `lots.${index}.allocations`,
      keyName: "_id"
    }
  );

  const [unitPrice, setUnitPrice] = React.useState(lot.unitPrice as number);
  const [qty, setQty] = React.useState(lot.qty as number);

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

  //useEffect(() => {
  //  const salesOrder = watch();
  //  console.log(JSON.stringify(salesOrder, null, 2), "watch");
  //  var getValues1 = getValues();
  //  console.log(JSON.stringify(getValues1, null, 2), "getValues");
  //}, [itemMethods])

  //const reset1 = () => {
  //  const salesOrder = watch();
  //  console.log(JSON.stringify(salesOrder, null, 2), "watch");
  //  var getValues1 = getValues();
  //  console.log(JSON.stringify(getValues1, null, 2), "getValues");

  //  reset({
  //    no: salesOrder.no,
  //    orderedAt: salesOrder.orderedAt,
  //    orderStatus: salesOrder.orderStatus ?? "Draft",
  //    customerNo: salesOrder.customerNo,
  //    billTo: salesOrder.billTo,
  //    shipTo: salesOrder.shipTo,
  //    salesRep: salesOrder.salesRep,
  //    orderClass: salesOrder.orderClass,
  //    paymentTerm: salesOrder.paymentTerm,
  //    freightTerm: salesOrder.freightTerm,
  //    discountPayIn: salesOrder.discountPayIn,
  //    estDeliveryAt: salesOrder.estDeliveryAt,
  //    discountPercentage: salesOrder.discountPercentage,
  //    customerPO: salesOrder.customerPO,
  //    releaseNumber: salesOrder.releaseNumber ?? '',
  //    termsAndCondition: salesOrder.termsAndCondition,
  //    internalMemo: salesOrder.internalMemo,
  //    tags: salesOrder.tags,
  //    lots: salesOrder.lots?.map(u => {
  //      return {
  //        product: u.product,

  //        categoryId: u.categoryId,
  //        categoryNo: u.categoryNo,

  //        specId: u.specId,
  //        specNo: u.specNo,

  //        attributeId: u.attributeId,
  //        attributeNo: u.attributeNo,

  //        qty: u.qty,
  //        qtyUnit: u.qtyUnit,
  //        unitPrice: u.unitPrice,
  //        weight: u.weight,
  //        amount: u.amount,

  //        allocations: u.allocations?.map(allocation => {
  //          return {
  //            source: allocation.source,
  //            relatedOrder: allocation.relatedOrder,
  //            fromSite: allocation.fromSite,
  //            weight: allocation.weight,
  //          } as OrderAllocationUseFormMethods
  //        }),
  //      } as OrderLotUseFormMethods;
  //    }),
  //  } as OrderUseFormMethods,
  //    {
  //      errors: true, // errors will not be reset 
  //      dirtyFields: true, // dirtyFields will not be reset
  //      isDirty: true, // dirty will not be reset
  //      isSubmitted: false,
  //      touched: false,
  //      isValid: false,
  //      submitCount: false,
  //    });
  //}

  return (
    <React.Fragment key={lot.id}>
      <TableRow //className={classes.inputProps}
      //style={{ background: 'rgba(159, 168, 218, 0.18)' }}
      >
        <TableCell>
          <input type="hidden" ref={register()} name={`lots[${index}].id`} defaultValue={lot.id} />

          <Checkbox
          size="small"
          //name={`lots.${index}.cb`}
          //onChange={handleChange}
          //value={lot.id}
          />
        </TableCell>

        <TableCell>
          <Typography variant="body2" color="textSecondary" noWrap>
            {lot.categoryNo}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" color="textSecondary" noWrap>
            {lot.specNo}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" color="textSecondary" noWrap>
            {lot.attributeNo}
          </Typography>
        </TableCell>

        <TableCell style={{ width: 120 }}>
          <Controller
            name={`lots[${index}].weight`}
            inputProps={{ style: { textAlign: 'right', fontSize: 'small' } }}
            size="small"
            margin="dense"
            control={control}
            defaultValue={lot.weight ?? 0}
            as={
              <NumberFormat
                autoComplete="off"
                fullWidth
                thousandSeparator
                isNumericString
                customInput={TextField}
              >
              </NumberFormat>
            }
          />
        </TableCell>

        <TableCell style={{ width: 120 }}>
          {/*
            <input
            name={`lots[${index}].qty`}
            defaultValue={`${lot.qty}`} // make sure to set up defaultValue
            ref={register()}
          />
          */}
          <Controller
            name={`lots[${index}].qty`}
            inputProps={{ style: { textAlign: 'right', fontSize: 'small' } }}
            size="small"
            margin="dense"
            control={control}
            defaultValue={lot.qty ?? 0}
            as={
              <NumberFormat
                autoComplete="off"
                fullWidth
                thousandSeparator
                isNumericString
                customInput={TextField}
                onValueChange={(value) => {
                  setQty(value.floatValue);
                }}
              >
              </NumberFormat>
            }
          />
        </TableCell>

        <TableCell style={{ width: 50 }} className={classes.inputProps}>
          <Controller
            name={`lots.${index}.qtyUnit`}
            margin="none"
            control={control}
            defaultValue={lot.qtyUnit ?? 'LB'}
            render={(props) => (
              <TextField
              select
                fullWidth
                onChange={(value) => {
                  props.onChange(value);
                }}
                value={props.value}
              >
                <MenuItem value={'LB'}>LB</MenuItem>
                <MenuItem value={'FT'}>FT</MenuItem>
                <MenuItem value={'Bundle'}>Bundle</MenuItem>
                <MenuItem value={'Each'}>Each</MenuItem>
              </TextField>

            )}
          />
        </TableCell>

        <TableCell style={{ width: 80 }}>
          <Controller
            name={`lots.${index}.unitPrice`}
            control={control}
            defaultValue={lot.unitPrice ?? 0}
            inputProps={{ style: { fontSize: 'small' } }}
            as={
              <NumberFormat
                autoComplete="off"
                fullWidth
                thousandSeparator
                isNumericString
                customInput={TextField}
                onValueChange={(value) => {
                  setUnitPrice(value.floatValue);
                }}
              >
              </NumberFormat>
            }
            fullWidth
            size="small"
            margin="dense"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        </TableCell>

        <TableCell>
          <Typography variant="body2" noWrap align="right">
            $ {(numeral(qty * unitPrice || '')).format(`0,0.00`)}
          </Typography>
        </TableCell>

        <TableCell align="center" style={{ width: 70 }}>
          <Grid container>
            <Grid item>
              <Tooltip
                title="Allocation"
              >
                <IconButton
                  size="small"
                  onClick={() => {
                    //AddAllocation(index);
                    allocationMethods.append({
                      id: uuidv4(),
                      fromSite: 'MON'
                    });
                  }}
                >
                  <ShareOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Grid>

            <Grid item>
              <Tooltip
                title="Delete"
              >
                <IconButton
                  aria-describedby={id}
                  size="small"
                  onClick={(event) => {
                    setLotDialog({
                      isOpen: true,
                      index: index
                    });
                    handleClick(event);
                  }}

                /* onClick={() => {
                  console.log(`itemMethods.remove(${index});`);
                  itemMethods.remove(index);
                  reset1();
                }} */
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
        <Box >
          <Button color="primary" size="small" variant="outlined" style={{ margin: 10 }}
            onClick={() => {
              setLotDialog({
                isOpen: false,
                index: null
              })
            }}>
            CANCEL
          </Button>

          <Button color="primary" size="small" variant="contained" style={{ margin: 10 }}
            onClick={() => {
              itemMethods.remove(lotDialog.index);
              setLotDialog({
                isOpen: false,
                index: null
              });
            }}>
            Delete
          </Button>
        </Box>
      </Popover>

      {
        allocationMethods.fields && allocationMethods.fields.map((allocation, index2) => {
          return (
            <OrderAllocation key={allocation._id} allocationMethods={allocationMethods} allocation={allocation} index={index} index2={index2} />
          )
        })
      }
    </React.Fragment>
  );
}