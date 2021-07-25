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
import { Controller, SubmitHandler, useFieldArray, FormProvider, UseFormMethods, useFormContext } from "react-hook-form";
import type { Spec, Attribute, Category } from 'src/types/spec';
import NumberFormat from 'react-number-format';
import { Theme } from '@fullcalendar/core';
import { Autocomplete } from '@material-ui/lab';
import InputAdornment from '@material-ui/core/InputAdornment';
import DeleteIcon from '@material-ui/icons/Delete';
import { DatePicker, KeyboardDatePicker } from '@material-ui/pickers';
import AddShoppingCartOutlinedIcon from '@material-ui/icons/AddShoppingCartOutlined';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import axios2 from 'src/utils/axios2';
import type { Order, Lot, OrderStatus, Allocation, Inventory, FromSite, AssignedItem } from 'src/types/simpleorder';
import useFilters from 'src/views/dev/SalesOrder/Main/useFilters';
import { v4 as uuidv4 } from 'uuid';

interface InvoiceLotProps {
  className?: string;
  OpenOrderEdit: (event: React.MouseEvent<unknown>, orderNo: string) => void;
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

let renderCount = 0;

const InvoiceLot: FC<InvoiceLotProps> = ({ className, OpenOrderEdit, ...rest }) => {
  const classes = useStyles();
  renderCount++;
  //console.log('Shipment item Render...' + renderCount);

  const isMountedRef = useIsMountedRef();
  //const [openDetail, setOpenDetail] = useState(false);
  const [assignedItem, setAssingedItem] = useState<AssignedItem>(null);
  const [assignedItems, setAssingedItems] = useState<AssignedItem[]>([]);

  const { control, getValues, register, watch } = useFormContext(); // retrieve all hook methods
  //const { orders } = useFilters();
  //const invoice = getValues();
  //console.log('methods.getValues()' + order);

  const lotMethods = useFieldArray(
    {
      control: control,
      name: "lots",
      keyName: "_id"
    }
  );

  const getItems = useCallback(async () => {
    try {
      const response = await axios2.post('/sh/assignedItems', null);
      console.log('/sh/assignedItems', response);
      if (isMountedRef.current) {
        setAssingedItems(response.data);
      }
      else {
        debugger;
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getItems();
  }, [getItems]);

  const watchAllFields = watch();

  return (
    <Box style={{ paddingTop: 13 }}>
      <Grid container spacing={2} justify="space-between" className={classes.autocomplete}>
        <Grid item xs={12} sm={12} md={5}>
          {/* {renderCount} */}
          <Autocomplete
            autoComplete={false}
            autoHighlight
            options={assignedItems}
            getOptionLabel={(option) => option.itemNo + ' | ' + option.specNo + ' | ' + option.attributeNo}
            //style={{ width: 600 }}
            renderInput={(params) => <TextField {...params} label="Search Items" variant="outlined" />}
            onChange={(event: any, newValue: any | null) => {
              console.log('Autocomplete \'Search Items\' onChange', newValue);
              setAssingedItem(newValue);
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
                console.log('Add Lot Clicked', assignedItem);
                console.log('watchAllFields.lots', watchAllFields.lots);

                var findIndex = watchAllFields.lots.findIndex((el) => el.categoryId == assignedItem.categoryId
                  && el.specId == assignedItem.specId
                  && el.attributeId == assignedItem.attributeId
                );

                //alert('findIndex ' + findIndex);

                if (findIndex == -1) {
                  lotMethods.append({
                    id: uuidv4(),
                    categoryId: assignedItem.categoryId,
                    specId: assignedItem.specId,
                    attributeId: assignedItem.attributeId,
                    items: [{
                      id: assignedItem.id,
                      assignedItem: assignedItem
                    }]
                  });
                }
                else {
                  var tempVar = lotMethods.fields[findIndex];
                  //console.log('tempVar', tempVar);

                  if (tempVar.items.findIndex((el) => el.assignedItem.itemNo == assignedItem.itemNo) != -1) {
                    alert('already used(dup)');
                    return;
                  }

                  tempVar.items.push({
                    id: assignedItem.id,
                    assignedItem: {
                      itemNo: assignedItem.itemNo,
                      shipmentLotNo: assignedItem.shipmentLotNo,
                      shlaId: null,
                      shNo: null
                    }
                  });

                  console.log(`lotMethods.fields[${findIndex}]`, tempVar);
                  lotMethods.append(tempVar);
                  lotMethods.remove(findIndex);
                }
              }}
            >Add Lot</Button>
          </Box>
        </Grid>
      </Grid>

      <Box mt={2}>
        <TableContainer className={classes.container}>
          <Table size="small" stickyHeader className={classes.cell}>
            <TableHead>
              <TableRow>
                <TableCell align="center">ItemNo</TableCell>
                <TableCell align="center">SO</TableCell>
                <TableCell align="center">Customer PO</TableCell>
                <TableCell align="center">CategoryId</TableCell>
                <TableCell align="center">SpecId</TableCell>
                <TableCell align="center">AttributeId</TableCell>
                <TableCell align="center">Weight</TableCell>
                <TableCell align="center">Qty</TableCell>
                <TableCell align="center">Unit</TableCell>
                <TableCell align="center">Length</TableCell>
                <TableCell align="center">Unit Price</TableCell>
                <TableCell align="center">Amount</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>

            </TableHead>
            <TableBody>
              {lotMethods.fields.map((lot, index) => {
                return (
                  <InvoiceLotInner key={lot._id}
                    lot={lot}
                    index={index}
                    lotMethods={lotMethods}
                    OpenOrderEdit={OpenOrderEdit}
                  />
                )
              })}

              <TableRow>
                <TableCell colSpan={9} align="right">
                  <Typography variant="body1">
                    Additional Charge
                  </Typography>
                </TableCell>
                <TableCell />
                <TableCell colSpan={2} align="right">
                    <Controller
                      name="additionalCharge"
                      align="right"
                      control={control}
                      render={(props) => (
                        <TextField
                          fullWidth
                          variant="outlined"
                          size="small"
                          margin="dense"
                          inputProps={{ style: { textAlign: 'right' } }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">$</InputAdornment>
                            )
                          }}
                        />
                      )}
                    />
                </TableCell>
                <TableCell />
              </TableRow>

              <TableRow>
                <TableCell colSpan={9} align="right">
                  <Typography variant="body1">
                    Total
              </Typography>
                </TableCell>
                <TableCell />
                <TableCell colSpan={2} align="right">
                  <Typography variant="body1">
                    $
                  </Typography>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableBody>

          </Table>
        </TableContainer>
      </Box>
    </Box >
  );
};

InvoiceLot.propTypes = {
  // @ts-ignore
  // card: PropTypes.object.isRequired,
  className: PropTypes.string,
  // @ts-ignore
  // list: PropTypes.object.isRequired,
  //onClose: PropTypes.func,
  //open: PropTypes.bool.isRequired
};

InvoiceLot.defaultProps = {
  //open: false,
  //onClose: () => { }
};

export default InvoiceLot;

interface InvoiceLotInnerProps {
  lot: any;
  index: any;
  lotMethods: any;
  OpenOrderEdit: (event: React.MouseEvent<unknown>, orderNo: string) => void;
}

const InvoiceLotInner: FC<InvoiceLotInnerProps> = ({ lotMethods, lot, index, OpenOrderEdit, ...rest }) => {
  //console.log(spec);
  const classes = useStyles();
  const { control, getValues, watch, reset, register } = useFormContext(); // retrieve all hook methods

  const [itemDialog, setItemDialog] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const removeItemClick = (index, index2) => {
    console.log('removeItem', index, index2);

    lot.items = lot.items.splice(index, index2);

    if (lot.items.length != 0) {
      lotMethods.append(lot);
    }
    lotMethods.remove(index);
  };

  return (
    <React.Fragment>
      <TableRow className={classes.inputProps}>
        <TableCell>
          <Typography variant="caption" color="textSecondary" noWrap>
            { }
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="caption" color="textSecondary" noWrap>
            { }
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="caption" color="textSecondary" noWrap>
            { }
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="caption" color="textSecondary" noWrap>
            {lot.productNo}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="caption" color="textSecondary" noWrap>
            {lot.specNo}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="caption" color="textSecondary" noWrap>
            {lot.attributeNo}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="caption" color="textSecondary" noWrap>
            { }
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="caption" color="textSecondary" noWrap>
            { }
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="caption" color="textSecondary" noWrap>
            { }
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="caption" color="textSecondary" noWrap>
            { }
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="caption" color="textSecondary" noWrap>
            { }
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="caption" color="textSecondary" noWrap>
            { }
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="caption" color="textSecondary" noWrap>
            { }
          </Typography>
        </TableCell>
      </TableRow>
      {
        lot.items && lot.items.map((item, index2) => {
          return (
            <TableRow key={index2}>
              <TableCell><Typography variant="caption">{item.assignedItem.itemNo}</Typography></TableCell>
              <TableCell>
                <Button
                  size="small"
                  onClick={(event) => OpenOrderEdit(event, item.soNo)} >
                  <Typography variant="caption" noWrap style={{ textDecoration: 'underline', fontWeight: 'lighter' }}>
                    {item.assignedItem.soNo}
                  </Typography>
                </Button>
              </TableCell>
              <TableCell><Typography variant="caption">{ }</Typography></TableCell>
              <TableCell><Typography variant="caption">{item.assignedItem.categoryNo}</Typography></TableCell>
              <TableCell><Typography variant="caption">{item.assignedItem.specNo}</Typography></TableCell>
              <TableCell><Typography variant="caption">{item.assignedItem.attributeNo}</Typography></TableCell>
              <TableCell align="right"><Typography variant="caption">{item.assignedItem.weight}</Typography></TableCell>
              <TableCell align="right"><Typography variant="caption">{item.assignedItem.qty}</Typography></TableCell>
              <TableCell><Typography variant="caption">{item.assignedItem.qtyUnit}</Typography></TableCell>
              <TableCell align="right"><Typography variant="caption">{item.assignedItem.length}</Typography></TableCell>
              <TableCell align="right"><Typography variant="caption">{item.assignedItem.unitPrice}</Typography></TableCell>
              <TableCell align="right"><Typography variant="caption">{item.assignedItem.amount}</Typography></TableCell>
              <TableCell align="right">
                <Grid item>
                  <Tooltip title="Delete" >
                    <IconButton size="small"
                      aria-describedby={id}
                      onClick={(event) => {
                        setItemDialog(true);
                        handleClick(event);
                      }}
                    >
                      <SvgIcon><DeleteIcon /></SvgIcon>
                    </IconButton>
                  </Tooltip>
                  <Popover
                    id={id}
                    anchorEl={anchorEl}
                    open={itemDialog}
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
                    <Box>
                      <Button color="primary" size="small" variant="outlined" style={{ margin: 10 }}
                        onClick={() => {
                          setItemDialog(false);
                        }}
                      >CANCEL</Button>
                      <Button color="primary" size="small" variant="contained" style={{ margin: 10 }}
                        onClick={(event) => {
                          removeItemClick(index, index2);
                          setItemDialog(false);
                        }}>Delete</Button>
                    </Box>
                  </Popover>
                </Grid>
              </TableCell>
            </TableRow>
          )
        })
      }
    </React.Fragment>
  );
}
