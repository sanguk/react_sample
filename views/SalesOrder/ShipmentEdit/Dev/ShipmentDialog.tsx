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
  Checkbox,
  Chip,
  Paper,
  Input,
  Tabs,
  Tab,
  FormControlLabel,
  Slide
} from '@material-ui/core';
import { Alert, Autocomplete } from '@material-ui/lab';
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

import type { Order, Allocation, Shipment, FromSite, Vendor } from 'src/types/simpleorder';
import axios2 from 'src/utils/axios2';

//import * as Yup from 'yup';
import { useForm, Controller, useFieldArray, FormProvider } from "react-hook-form";
import { TransitionProps } from '@material-ui/core/transitions';
//import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
//import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';
//import DeleteIcon from '@material-ui/icons/Delete';
import NumberFormat from 'react-number-format';
import { DevTool } from "@hookform/devtools";
import { KeyboardDatePicker } from '@material-ui/pickers';
//import moment from 'moment';
//import numeral from 'numeral';
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined';
import TransportationInfo from '../TransportationInfo';
import ShipmentItem from './ShipmentItem';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

interface ShipmentResultProps {
  className?: string;
  onClose?: () => void;
  open: boolean;
  handleDialog1Close: () => void;
  //selectedLineItems: string[];
  //allocaions: Allocation[];
  shipment: any;
  OpenOrderEdit: (event: React.MouseEvent<unknown>, orderNo: string) => void;
  OpenShipmentEdit: (event: React.MouseEvent<unknown>, shipmentNo: string) => void;
  handleCloseShipmentEdit: () => void;
}

const tabs = [
  { value: 'shipmentDetail', label: 'Shipment Detail', id: '1' },
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

 const Transition = React.forwardRef(function Transition(
   props: TransitionProps & { children?: React.ReactElement },
   ref: React.Ref<unknown>,
 ) {
   return <Slide direction="up" ref={ref} {...props} />;
 });

//const createLotFromOrder = (orders: Order[]) => {
//  const lotArr = orders.map(order => order.lots)
//  const lots = ([].concat(...lotArr))
//  return lots
//};

let renderCount = 0;

const ShipmentDialog: FC<ShipmentResultProps> = ({
  className,
  onClose,
  open,
  handleDialog1Close,
  shipment,
  //selectedLineItems,
  //allocaions,
  OpenOrderEdit,
  OpenShipmentEdit,
  handleCloseShipmentEdit,
  ...rest
}) => {
  //console.log("Shipment Edit Start")
  renderCount++;

  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  // const dispatch = useDispatch();
  // const { enqueueSnackbar } = useSnackbar();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [btnCloseLabel, setBtnCloseLabel] = useState<boolean>(false);

  const [currentTab, setCurrentTab] = useState<string>('shipmentDetail');

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  const methods = useForm();

  // defaultValues: {}; you can populate the fields by this attribute 
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control: methods.control, // control props comes from useForm (optional: if you are using FormContext)
    name: "lots", // unique name for your Field Array
    keyName: "_id",// default to "id", you can change the key name
  });

  //console.log(JSON.stringify(shipment.lots, null, 2));

  //console.log(shipment, 'shipment');
  //console.log(fields, "fields11")

  //useEffect(() => {
  //  let array = Object.getOwnPropertyNames(shipment);
  //  array.forEach(a => register(a))
  //  if (shipment.lots != null) {
  //    let array1 = Object.getOwnPropertyNames(shipment.lots[0]);
  //    console.log(array1, 'array1');
  //    array1.forEach(a => register('lots.'+a))
  //  }
  //  return () => {
  //    let array = Object.getOwnPropertyNames(shipment);
  //    array.forEach(a => unregister(a))
  //    if (shipment.lots != null) {
  //      let array1 = Object.getOwnPropertyNames(shipment.lots[0]);
  //      console.log(array1, 'array1');
  //      array1.forEach(a => unregister('lots.' + a))
  //    }
  //  }

  //}, [register, shipment])

  const onSubmit = async (data) => {
    console.log(JSON.stringify(data, null, 2), "onSubmit");
    //console.log(JSON.stringify({ ...shipment, ...data }, null, 2), "onSubmit merge");

    // for dev, temporally comment
    var response = await axios2.put(`/sh/Upsert`, data);
    setOpenSnackbar(true);
    setBtnCloseLabel(true);
  };

  useEffect(() => {
    methods.reset(shipment);

    setBtnCloseLabel(false);
    //setdefault("Lot", shipment);
  }, [shipment]);

  const handleCloseSnackbar = (event?: React.SyntheticEvent, reason?: string) => {
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

  function ChipsArray(shipment) {
    const classes = useStyles();
    const [inputValue, setInputValue] = useState<string>('');
    const [chips, setChips] = useState<string[]>(shipment.tags ?? []);

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
      TransitionComponent={Transition}
      {...rest}
    >
      <div className={classes.root}>
        {/* {renderCount} */}
        <FormProvider {...methods} >
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {/* <DevTool control={methods.control} /> */}
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
                          SALES SHIPMENT {renderCount}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box m={1}>
                        <Typography variant="h4" align="right">
                          <input type="hidden" ref={methods.register()} name={`no`} defaultValue={shipment.no} />
                          {shipment.no}
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
                            name="orderStatus"
                            control={methods.control}
                            render={(props) => (
                              <TextField
                                select
                                label="Shipment Status"
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
                    </Grid>

                    <Grid container >
                      <Grid item xs={12} sm={6}>
                        <Box m={1}>
                          <Controller
                            name="dateCondition"
                            control={methods.control}
                            render={(props) => (
                              <TextField
                                select
                                label="Date Condition"
                                fullWidth
                                onChange={(value) => {
                                  props.onChange(value);
                                }}
                                value={props.value}
                              >
                                <MenuItem value={'By'}>By</MenuItem>
                                <MenuItem value={'At'}>At</MenuItem>
                                <MenuItem value={'After'}>After</MenuItem>
                              </TextField>
                            )}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box m={1}>
                          <Controller
                            name="orderedAt"
                            control={methods.control}
                            render={({ onChange, value }) => (
                              <KeyboardDatePicker
                                autoComplete="off"
                                variant="inline"
                                format="MM/DD/yyyy"
                                label="Order Date"
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
                      <Grid item xs={12} sm={12}>
                        <Box m={1}>
                          <Controller
                            name="vendor"
                            label="Vendor"
                            required
                            control={methods.control}
                            render={(props) => (
                              <Autocomplete
                                {...props}
                                options={vendorOption}
                                getOptionLabel={(option) => option}
                                onChange={(e, value) => props.onChange(value)}
                                renderInput={(params) => (
                                  <TextField
                                    variant="outlined"
                                    label="Vendor"
                                    {...params}
                                  />
                                )}
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
                            name="freightTerm"
                            control={methods.control}
                            render={(props) => (
                              <TextField
                                select
                                label="Freigh Term"
                                fullWidth
                                onChange={(value) => {
                                  props.onChange(value);
                                  //handleTranportationType(value)

                                }}
                                value={props.value}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start"> </InputAdornment>
                                  )
                                }}
                              >
                                <MenuItem value={'Prepaid'}>Prepaid</MenuItem>
                                <MenuItem value={'CPU'}>CPU</MenuItem>
                                <MenuItem value={'Collect'}>Collect</MenuItem>
                                <MenuItem value={'Transfer'}>Transfer</MenuItem>
                              </TextField>
                            )}
                          />

                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box m={1}>
                          <Controller
                            name="freightRate"
                            control={methods.control}
                            as={
                              <NumberFormat
                                label="Freigh Rate"
                                fullWidth
                                thousandSeparator
                                isNumericString
                                customInput={TextField}
                                autoComplete="off"
                              >
                              </NumberFormat>
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">$</InputAdornment>
                              )
                            }}
                          />
                        </Box>
                      </Grid>
                    </Grid>

                    <Grid container >
                      <Grid item xs={12} sm={6}>
                        <Box m={1}>
                          <Controller
                            name="transportType"
                            control={methods.control}
                            render={(props) => (
                              <TextField
                                select
                                label="Transportation"
                                fullWidth
                                onChange={(value) => {
                                  props.onChange(value);
                                  //handleTranportationType(value)
                                }}
                                value={props.value}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start"> </InputAdornment>
                                  )
                                }}
                              >
                                <MenuItem value={'Flatbed Truck'}>Flatbed Truck</MenuItem>
                                <MenuItem value={'Container Truck'}>Container Truck</MenuItem>
                              </TextField>
                            )}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        {watchAllFields.transportType &&
                          <TransportationInfo control={methods.control} transportationType={watchAllFields.transportType} />
                        }
                      </Grid>
                    </Grid>

                    <Grid container >
                      <Grid item xs={12} sm={12}>
                        <Box m={1}>
                          <Controller
                            name="internalMemo"
                            control={methods.control}
                            rows={2}
                            as={
                              <TextField
                                multiline
                                label="Internal Note"
                                fullWidth
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start"> </InputAdornment>
                                  )
                                }}
                              >
                              </TextField>
                            }
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <Box m={1}>
                          <Controller
                            name="accountingMemo"
                            control={methods.control}
                            rows={2}
                            as={
                              <TextField
                                multiline
                                label="Accounting Note"
                                fullWidth
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start"> </InputAdornment>
                                  )
                                }}
                              >
                              </TextField>
                            }
                          />
                        </Box>
                      </Grid>
                    </Grid>

                    <Grid container >
                      <Grid item xs={12} sm={12}>
                        <Box m={1}>
                          <ChipsArray shipment={shipment} />
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

                  {currentTab === 'shipmentDetail' &&
                    <ShipmentItem OpenOrderEdit={OpenOrderEdit} />
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
                  >
                    SUBMIT
                  </Button>
                </Box>

              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6} sm={6} lg={12} >
                watchValues
                <pre style={{ color: '#ffffff' }}>{JSON.stringify(watchAllFields, null, 2)}</pre>
                <br />
                getValues
                <pre style={{ color: '#ffffff' }}>{JSON.stringify(getValues, null, 2)}</pre>
                <br />
                fields
                <pre style={{ color: '#ffffff' }}>{JSON.stringify(fields, null, 2)}</pre>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
        {/* )}
        </Formik> */}

        <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success">
            This is a success message!
          </Alert>
        </Snackbar>
      </div>
    </Dialog>
  );
};

ShipmentDialog.propTypes = {
  // @ts-ignore
  // card: PropTypes.object.isRequired,
  className: PropTypes.string,
  // @ts-ignore
  // list: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};

ShipmentDialog.defaultProps = {
  open: false,
  onClose: () => { }
};

export default ShipmentDialog;