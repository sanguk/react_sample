import React, { useEffect, useState, useCallback } from 'react';
import type { FC, ChangeEvent } from 'react';
import PropTypes from 'prop-types';
//import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Dialog,
  Divider,
  Grid,
  Typography,
  makeStyles,
  IconButton,
  SvgIcon,
  Snackbar,
  Card,
  MenuItem,
  TextField,
  InputAdornment,
  TableContainer,
  Tooltip,
  //Checkbox,
  Chip,
  Paper,
  Input,
  Tabs,
  Tab,
  //FormControlLabel
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
// import {
//   XCircle as CloseIcon,
//   Eye as EyeIcon,
//   EyeOff as EyeOffIcon,
//   ArrowRight as ArrowRightIcon,
//   Archive as ArchiveIcon,
//   CheckSquare as CheckIcon,
//   Copy as CopyIcon,
//   Users as UsersIcon,
//   File as FileIcon,
//   Layout as LayoutIcon
// } from 'react-feather';
import type { Theme } from 'src/theme';
//import { useDispatch } from 'src/store';
//import Autocomplete from '@material-ui/lab/Autocomplete';

import type { Vendor } from 'src/types/simpleorder';
import axios2 from 'src/utils/axios2';

//import * as Yup from 'yup';
import { useForm, Controller, SubmitHandler, useFieldArray, FormProvider } from "react-hook-form";

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import NumberFormat from 'react-number-format';
import { DevTool } from "@hookform/devtools";
import { DatePicker, KeyboardDatePicker } from '@material-ui/pickers';
import moment from 'moment';
import numeral from 'numeral';
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined';
import InvoiceLot from './InvoiceLot';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import Tags from 'src/components/Tags';

interface InvoiceDialogProps {
  className?: string;
  onClose?: () => void;
  open: boolean;
  handleDialog1Close: () => void;
  //selectedLineItems: string[];
  //allocaions: Allocation[];
  invoice: any;
  OpenOrderEdit: (event: React.MouseEvent<unknown>, orderNo: string) => void
}

const tabs = [
  { value: 'invoiceItem', label: 'Invoice Detail', id: '1' },
  /* { value: 'invoice', label: 'invoice', id: '2' }, */
];

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(1),
    minWidth: 1900
  },
  listName: {
    fontWeight: theme.typography.fontWeightMedium
  },
  card: {
    padding: 10,
    //minHeight: 980,
    //maxHeight: 980,
    '&::-webkit-scrollbar': {
      width: '0.5em'
    },
    '&::-webkit-scrollbar-track': {
      //boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.3)',
      //outline: '1px solid slategrey'
    }
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
    height: 845,
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
  tag: {
    display: 'flex',
    // justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    //padding: theme.spacing(0.5),
    //margin: 0,
  },
  searchInput: {
    marginLeft: theme.spacing(2)
  },
  autocomplete: {
    flexGrow: 1,
    '& pre': { color: 'white' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#FF9800',
      },
    },
  },

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

let renderCount = 0;

const InvoiceDialog: FC<InvoiceDialogProps> = ({
  className,
  onClose,
  open,
  handleDialog1Close,
  invoice,
  //selectedLineItems,
  //allocaions,
  OpenOrderEdit,
  ...rest
}) => {
  console.log("Invoice Dialog Start")
  renderCount++;

  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  // const dispatch = useDispatch();
  // const { enqueueSnackbar } = useSnackbar();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [btnCloseLabel, setBtnCloseLabel] = useState<boolean>(false);

  //const today = new Date().toISOString().substring(0, 10);
  // const formatDate = (date_ob) => {
  //   let date = ("0" + date_ob.getDate()).slice(-2);
  //   let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  //   let year = date_ob.getFullYear();
  //   return (
  //     //date.toISOString().substring(0, 10)
  //     month + "/" + date + "/" + year
  //   )
  // }

  const [currentTab, setCurrentTab] = useState<string>('invoiceItem');

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  const methods = useForm({
    defaultValues: invoice,
    shouldUnregister: false
  });

  // defaultValues: {}; you can populate the fields by this attribute 
  //const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
  //  control: methods.control, // control props comes from useForm (optional: if you are using FormContext)
  //  name: "items", // unique name for your Field Array
  //  keyName: "_id",// default to "id", you can change the key name
  //});

  //console.log(JSON.stringify(invoice.lots, null, 2));

  //console.log(invoice, 'invoice');
  //console.log(fields, "fields11")

  //useEffect(() => {
  //  let array = Object.getOwnPropertyNames(invoice);
  //  array.forEach(a => register(a))
  //  if (invoice.lots != null) {
  //    let array1 = Object.getOwnPropertyNames(invoice.lots[0]);
  //    console.log(array1, 'array1');
  //    array1.forEach(a => register('lots.'+a))
  //  }
  //  return () => {
  //    let array = Object.getOwnPropertyNames(invoice);
  //    array.forEach(a => unregister(a))
  //    if (invoice.lots != null) {
  //      let array1 = Object.getOwnPropertyNames(invoice.lots[0]);
  //      console.log(array1, 'array1');
  //      array1.forEach(a => unregister('lots.' + a))
  //    }
  //  }

  //}, [register, invoice])

  const onSubmit = async (data) => {
    console.log(JSON.stringify(data, null, 2), "onSubmit");
    //console.log(JSON.stringify({ ...invoice, ...data }, null, 2), "onSubmit merge");

    // for dev, temporally comment
    var response = await axios2.put(`/si/Upsert`, data);
    setOpenSnackbar(true);
    setBtnCloseLabel(true);
  };

  useEffect(() => {
    methods.reset(invoice);
    setBtnCloseLabel(false);
    //setdefault("Lot", invoice);
  }, [invoice]);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  //const handleTranportationType = (event: any) => {
  //setTransportationType(event.target.value)
  // setTransportationType(value)
  //}

  const [vendor, setVendor] = useState<Vendor[]>([]);

  const getVendor = useCallback(async () => {
    try {
      const response = await axios2.get<Vendor[]>('/Vendor/list');
      //console.log('getVendor1111 /Vendor/list', response);

      if (isMountedRef.current) {
        setVendor(response.data);
      }
      else {
        debugger;
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getVendor();
  }, [getVendor]);

  const createVendorList = () => {
    const arr = vendor.map(a => a.name)
    const vendorList = ([].concat(...arr))
    return (
      vendorList
    )
  };

  const vendorOption = createVendorList()

  function ChipsArray(invoice) {
    const classes = useStyles();
    const [inputValue, setInputValue] = useState<string>('');
    const [chips, setChips] = useState<string[]>(invoice.tags ?? []);

    const handleChipDelete = (chip: string): void => {
      setChips((prevChips) => prevChips.filter((prevChip) => chip !== prevChip));
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
      event.persist();
      setInputValue(event.target.value);
    };

    const handleInputClick = (event: React.MouseEvent<unknown>): void => {
      event.persist();

      if (inputValue) {
        if (!chips.includes(inputValue)) {
          setChips((prevChips) => [...prevChips, inputValue]);
          setInputValue('');
        }
      }
    };

    return (
      <Paper component="ul" className={classes.tag} >
        <Grid container justify="space-between">
          <Grid item>
            <Box>
              {chips.map((data) => {
                let icon;
                return (
                  <Chip
                    // key={data.id}
                    icon={icon}
                    label={data}
                    onDelete={() => handleChipDelete(data)}
                  />
                );
              })}
            </Box>
          </Grid>
        </Grid>

        <Grid container justify="space-between" alignItems="center">
          <Grid item xs={12} sm={10}>
            <Box>
              <Input
                fullWidth
                disableUnderline
                className={classes.searchInput}
                onChange={handleInputChange}
                placeholder="Enter a Tag"
                value={inputValue}
                startAdornment={<LocalOfferOutlinedIcon style={{ marginRight: 10 }} />}
              />
            </Box>
          </Grid>
          <Grid item>
            <Box>
              <Tooltip title="Add">
                <IconButton
                  onClick={handleInputClick} >
                  <SvgIcon>
                    <AddCircleOutlinedIcon />
                  </SvgIcon>
                  {/* <Typography variant="body2" noWrap>
                        Add
                      </Typography> */}
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    );
  }

  const getValues = methods.getValues();
  //const watchAllFields = methods.watch(['transportType']);
  const watchAllFields = methods.watch(); // for test & debugging

  return (

    <Dialog
      fullScreen
      open={open}
      onClose={handleDialog1Close}

      // TransitionComponent={Transition}
      {...rest}
    >
      <div className={classes.root}>
        {/* {renderCount} */}
        <FormProvider {...methods} >
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <DevTool control={methods.control} />
            <Grid container spacing={1}>
              <Grid item xs={12} sm={12} lg={3} className={classes.autocomplete}>
                <Card
                  className={classes.card}
                  {...rest}
                >
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>

                      <Box m={1}>
                        <Typography variant="h4">
                          Invoice {renderCount}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box m={1}>
                        <Typography variant="h4" align="right">
                          {invoice.no}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  <Divider />

                  <TableContainer className={classes.container}>
                    <Grid container >
                      <Grid item xs={12} sm={6}>
                        <Box m={1}>
                          <Controller
                            name="status"
                            control={methods.control}
                            render={(props) => (
                              <TextField
                                select
                                label="Invoice Status"
                                fullWidth
                                onChange={(value) => {
                                  props.onChange(value);
                                }}
                                value={props.value}
                              >
                                <MenuItem value={'Draft'}>Draft</MenuItem>
                                <MenuItem value={'Open'}>Open</MenuItem>
                                <MenuItem value={'Canceled'}>Canceled</MenuItem>
                                <MenuItem value={'Completed'}>Completed</MenuItem>
                                <MenuItem value={'Hold'}>Hold</MenuItem>
                              </TextField>
                            )}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box m={1}>
                          <Controller
                            name="invoiceDate"
                            control={methods.control}
                            render={({ onChange, value }) => (
                              <KeyboardDatePicker
                                autoComplete="off"
                                required
                                fullWidth
                                format="MM/DD/yyyy"
                                variant="inline"
                                label="Invoice Date"
                                onChange={(v) => onChange(v)}
                                KeyboardButtonProps={{
                                  'aria-label': 'change date',
                                }}
                                value={value}
                              />
                            )}
                          />
                        </Box>
                      </Grid>
                    </Grid>

                    <Grid container>
                      <Grid item xs={12} sm={6}>
                        <Box m={1}>
                          <Controller
                            name="salesRep"
                            control={methods.control}
                            render={(props) => (
                              <TextField
                                label="Sales Rep"
                                fullWidth
                                defaultValue={invoice.salesRep}
                                InputProps={{
                                  readOnly: true,
                                  startAdornment: (
                                    <InputAdornment position="start"> </InputAdornment>
                                  )
                                }}
                              />
                            )}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box m={1}>
                          <Controller
                            name="dueDate"
                            control={methods.control}
                            render={({ onChange, value }) => (
                              <KeyboardDatePicker
                                autoComplete="off"
                                required
                                fullWidth
                                format="MM/DD/yyyy"
                                variant="inline"
                                label="Due Date"
                                onChange={(v) => onChange(v)}
                                KeyboardButtonProps={{
                                  'aria-label': 'change date',
                                }}
                                value={value}
                              />
                            )}
                          />
                        </Box>
                      </Grid>
                    </Grid>

                    <Grid container>
                      <Grid item xs={12} sm={12}>
                        <Box m={1}>
                          <Controller
                            name="customerNo"
                            control={methods.control}
                            render={(props) => (
                              <TextField
                                label="Customer"
                                fullWidth
                                /* defaulValue={invoice.customerNo} */
                                InputProps={{
                                  readOnly: true,
                                  startAdornment: (
                                    <InputAdornment position="start"> </InputAdornment>
                                  )
                                }}
                              />
                            )}
                          />
                        </Box>
                      </Grid>
                    </Grid>

                    <Grid container>
                      <Grid item xs={12} sm={6}>
                        <Box m={1}>
                          <Typography color="textSecondary" variant="caption">
                            Bill To:
                          </Typography>
                          <Box m={1}>
                            <Typography variant="caption">
                              <div>{watchAllFields.freightTerm}</div>
                              <div>{watchAllFields.billTo?.address1}</div>
                              <div>{watchAllFields.billTo?.city}, {watchAllFields.billTo?.state}</div>
                              <div>{watchAllFields.billTo?.zip}</div>
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box m={1}>
                          <Typography color="textSecondary" variant="caption">
                            Ship To:
                      </Typography>
                          <Box m={1}>
                            {/* show only default=true, others drop down option <ul>,<li> remove*/}
                            {invoice && <Typography variant="caption">
                              <div>{invoice.shipTo}</div>
                            </Typography>}
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>

                    <Grid container >
                      <Grid item xs={12} sm={6}>
                        <Box m={1}>
                          <Controller
                            name="paymentTerm"
                            control={methods.control}
                            render={(props) => (
                              <TextField
                                label="Paymetn Term"
                                fullWidth
                                defaultValue={invoice.paymentTerm}
                                InputProps={{
                                  readOnly: true,
                                  startAdornment: (
                                    <InputAdornment position="start"> </InputAdornment>
                                  )
                                }}
                              />
                            )}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box m={1}>
                          <Controller
                            name="freightTerm"
                            control={methods.control}
                            render={(props) => (
                              <TextField
                                label="Freight Term"
                                fullWidth
                                defaultValue={invoice.freightTerm}
                                InputProps={{
                                  readOnly: true,
                                  startAdornment: (
                                    <InputAdornment position="start"> </InputAdornment>
                                  )
                                }}
                              />
                            )}
                          />
                        </Box>
                      </Grid>
                    </Grid>

                    <Grid container >
                      <Grid item xs={12} sm={6}>
                        <Box m={1}>
                          <Controller
                            name="discountPayIn"
                            control={methods.control}
                            as={
                              <TextField
                                label="Discount Pay In"
                                fullWidth
                                defaultValue={invoice.discountPayIn}
                                inputProps={{ style: { textAlign: 'right' } }}
                                InputProps={{
                                  readOnly: true,
                                  startAdornment: (
                                    <InputAdornment position="start"> </InputAdornment>
                                  )
                                }}
                              />
                            }
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box m={1}>
                          <Controller
                            name="shipDate"
                            control={methods.control}
                            render={({ onChange, value }) => (
                              <KeyboardDatePicker
                                autoComplete="off"
                                fullWidth
                                format="MM/DD/yyyy"
                                variant="inline"
                                label="Ship Date"
                                onChange={(v) => onChange(v)}
                                KeyboardButtonProps={{
                                  'aria-label': 'change date',
                                }}
                                value={value}
                              />
                            )}
                          />
                        </Box>
                      </Grid>
                    </Grid>

                    <Grid container >
                      <Grid item xs={12} sm={6}>
                        <Box m={1}>
                          <Controller
                            name="discountPercentage"
                            control={methods.control}
                            render={(props) => (
                              <TextField
                                label="Discount Percentage"
                                fullWidth
                                defaultValue={invoice.discountPercentage}
                                inputProps={{ style: { textAlign: 'right' } }}
                                InputProps={{
                                  readOnly: true,
                                  startAdornment: (
                                    <InputAdornment position="start"> </InputAdornment>
                                  ),
                                  endAdornment: (
                                    <InputAdornment position="end">%</InputAdornment>
                                  )
                                }}
                              />
                            )}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box m={1}>
                        <Controller
                            name="paymentMethod"
                            control={methods.control}
                            render={(props) => (
                              <TextField
                                select
                                label="Payment Method"
                                fullWidth
                                onChange={(value) => {
                                  props.onChange(value);
                                }}
                                value={props.value}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start"> </InputAdornment>
                                  )
                                }}
                              >
                                <MenuItem value={'Check'}>Check</MenuItem>
                                <MenuItem value={'Wire'}>Wire</MenuItem>
                              </TextField>
                            )}
                          />
                        </Box>
                      </Grid>
                    </Grid>

                    <Grid container >
                      <Grid item xs={12} sm={12}>
                        <Box m={1}>
                          <Controller
                            fullWidth
                            multiline
                            rows={2}
                            name="termsAndCondition"
                            control={methods.control}
                            label="Terms & Condition"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start"> </InputAdornment>
                              ),
                            }}
                            as={TextField}
                          />
                        </Box>
                      </Grid>
                    </Grid>

                    <Grid container>
                      <Grid item xs={12} sm={12}>
                        <Box m={1}>
                          <Controller
                            fullWidth
                            multiline
                            rows={2}
                            name="internalMemo"
                            control={methods.control}
                            label="Internal Note"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start"> </InputAdornment>
                              ),
                            }}
                            as={TextField}
                          />
                        </Box>
                      </Grid>
                    </Grid>

                    <Grid container>
                      <Grid item xs={12} sm={12}>
                        <Box m={1}>
                          {/* <Tags tags={values.tags} /> */}
                        </Box>

                      </Grid>
                    </Grid>


                  </TableContainer>
                </Card>
              </Grid>
              <Grid item xs={12} sm={12} lg={9}>
                < Card className={classes.card}
                  {...rest}
                >
                  <Grid container alignItems="baseline">
                    <Grid item xs={12} sm={10}>
                      <Tabs
                        onChange={handleTabsChange}
                        scrollButtons="auto"
                        value={currentTab}
                        variant="scrollable"
                        textColor="secondary"
                      >
                        {tabs.map((tab) => (
                          <Tab
                            label={tab.label}
                            value={tab.value}
                            key={tab.id}
                          />
                        ))}
                      </Tabs>
                    </Grid>
                  </Grid>
                  {currentTab === 'invoiceItem' &&
                    <InvoiceLot OpenOrderEdit={OpenOrderEdit} />
                  }
                </Card>
                <Box mt={2} textAlign="right">
                  {btnCloseLabel ?
                    <Button
                      style={{ marginRight: 30 }}
                      color="secondary"
                      //disabled={isSubmitting}
                      size="large"
                      variant="outlined"
                      onClick={handleDialog1Close}
                    >CLOSE</Button>
                    :
                    <Button
                      style={{ marginRight: 30 }}
                      color="secondary"
                      //disabled={isSubmitting}
                      size="large"
                      variant="outlined"
                      onClick={handleDialog1Close}
                    >CANCEL</Button>
                  }
                  <Button
                    color="secondary"
                    // disabled={isSubmitting}
                    size="large"
                    type="submit"
                    variant="contained"
                  >SUBMIT</Button>
                </Box>
              </Grid>
            </Grid>
            {/* <Grid container spacing={2}>
              <Grid item xs={6} sm={6} lg={12} >
                <pre style={{ color: '#ffffff' }}>{JSON.stringify(watchAllFields, null, 2)}</pre>
              </Grid>
            </Grid> */}
          </form>
        </FormProvider>
        <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            This is a success message!
        </Alert>
        </Snackbar>
      </div>
    </Dialog>
  );
};

InvoiceDialog.propTypes = {
  // @ts-ignore
  // card: PropTypes.object.isRequired,
  className: PropTypes.string,
  // @ts-ignore
  // list: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};

InvoiceDialog.defaultProps = {
  open: false,
  onClose: () => { }
};

export default InvoiceDialog;