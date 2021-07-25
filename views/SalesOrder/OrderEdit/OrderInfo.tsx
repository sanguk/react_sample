import React, { useEffect, useState } from 'react';
import type { ChangeEvent, FC } from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useForm, Controller, useFieldArray, FormProvider, UseFormMethods } from "react-hook-form";
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  makeStyles,
  Tab,
  Tabs,
  TableContainer,
  TextField,
  Typography,
  Snackbar,
  MenuItem,
  Checkbox,
  FormControlLabel,
  //Paper,
  //Chip,
  //Input,
  //Tooltip,
  //IconButton,
  //SvgIcon,
} from '@material-ui/core';
//import DoneIcon from '@material-ui/icons/Done';
//import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined';
//import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';
import type { Theme } from 'src/theme';
//import type { FormikSelectItem } from "src/types/formik";
//import { FreightTerm } from 'src/types/shipment';
//import { OrderUseFormMethods } from "src/types/simpleorder";
import type { NameValue } from 'src/types/simpleorder';
import axios2 from 'src/utils/axios2';
//import OrderItem from 'src/views/dev/SalesOrder/OrderEdit/OrderItem';
import OrderItem from './OrderItem';
//import * as Yup from 'yup';
//import AssignedItem from 'src/views/dev/SalesOrder/OrderEdit/AssignedItem';
//import AssignedItemTable from 'src/views/dev/SalesOrder/Main/Table/AssignedItemTable';
import OrderShipment from 'src/views/dev/SalesOrder/OrderEdit/OrderShipment';
import { Alert } from '@material-ui/lab';
//import TagFacesIcon from '@material-ui/icons/TagFaces';
//import SearchIcon from '@material-ui/icons/Search';
import { KeyboardDatePicker } from '@material-ui/pickers';
import HookSelectFieldCustomer from 'src/components/HookSelect/HookSelectFieldCustomer';
import NumberFormat from 'react-number-format';
//import SalesOrderConfirmation from './SalesOrderConfirmation';
import Tags from 'src/components/Tags';

interface OrderInfoProps {
  className?: string;
  salesOrder?: any;
  handleCloseOrderEdit: () => void;
  OpenOrderEdit: (event: React.MouseEvent<unknown>, orderNo: string) => void
}

const tabs = [
  { value: 'orderDetail', label: 'Order Detail', id: '1' },
  { value: 'shipment', label: 'Shipment', id: '2' },
  { value: 'invoice', label: 'invoice', id: '3' },
];

const useStyles = makeStyles((theme: Theme) => ({
  autocomplete: {
    flexGrow: 1,
    '& pre': { color: 'white' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#FF9800',
      },
    },
    '& .MuiGrid-item': {
      marginTop: 5
    }
  },
  card: {
    padding: 10,
    //minHeight: 900,
    //maxHeight: 980,
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
}));

let renderCount = 0;

const OrderInfo: FC<OrderInfoProps> = ({ className, salesOrder, handleCloseOrderEdit, OpenOrderEdit, ...rest }) => {
  renderCount++;
  //console.log('Order Info Render...' + renderCount);

  const classes = useStyles();
  const [openOrderConfirmation, setOrderConfirmation] = useState<boolean>(false);
  const [btnCloseLabel, setBtnCloseLabel] = useState<boolean>(false);

  const handleCreateSalesOrderConfirmationClick = (): void => {
    if (!openOrderConfirmation) {
      setOrderConfirmation(true);
    } else {
      setOrderConfirmation(false);
    }
  };

  const [currentTab, setCurrentTab] = useState<string>('orderDetail');
  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  const [open, setOpen] = React.useState(false);
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const methods: UseFormMethods<any> = useForm(
    {
      defaultValues: salesOrder,
      shouldUnregister: false
    }
  );

  useEffect(() => {
    methods.reset(salesOrder);
    setBtnCloseLabel(false);
    //setdefault("Lot", shipment);
  }, [salesOrder]);

  //useEffect(() => {
  //  methods.setValue('no', salesOrder.no);
  //  methods.setValue('orderedAt', salesOrder.orderedAt);
  //  methods.setValue('orderStatus', salesOrder.orderStatus ?? "Draft");
  //  methods.setValue('customerNo', salesOrder.customerNo);
  //  //methods.setValue('billTo', salesOrder.billTo);
  //  //methods.setValue('shipTo', salesOrder.shipTo);
  //}, [salesOrder]);

  const shipToMethods = useFieldArray(
    {
      control: methods.control,
      name: "shipTo",
      keyName: "_id"
    }
  );

  const onSubmit = async (data) => {
    //console.log(JSON.stringify(data, null, 2), "onSubmit");
    //console.log(JSON.stringify({ ...shipment, ...data }, null, 2), "onSubmit merge");
    //var response = await axios2.put(`/ShipmentUpsert`, { ...shipment, ...data });
    var response = await axios2.put(`/so`, data);
    console.log('axios2.put(/so, data)', JSON.stringify(response.data, null, 2));

    // error일때 sackbar로 띄워서 메시지 유저에게 보여줌
    if (response.data['isSuccess'] == true) {
      // succes snackbar
    }
    else {
      // faill snacbar with errMsg
      //alert(response.data['errMsg'] + '   gjegjewigjewiogjewi' );
    }

    //console.log(JSON.stringify(response, null, 2), "onSubmit response");
    setOpen(true);
    setBtnCloseLabel(true);
  };

  const watchAllFields = methods.watch(['shipTo', 'freightTerm', 'billTo']);
  var shipTo = watchAllFields.shipTo?.filter(a => a.isDefault == true)[0]; // shipTo or null or undefiled

  const values = methods.getValues();


  return (
    <div >
      {/* {renderCount} */}
      <FormProvider {...methods} >
        <form onSubmit={methods.handleSubmit(onSubmit)}>
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
                        SALES ORDER
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box m={1}>
                      <Typography variant="h4" align="right">
                        {salesOrder.no}
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
                              label="Order Status"
                              required
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
                          name="orderedAt"
                          control={methods.control}

                          render={({ onChange, value }) => (
                            <KeyboardDatePicker
                              autoComplete="off"
                              required
                              fullWidth
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
                        <input name="paymentMethod" type="hidden" ref={methods.register} />
                        <input name="billTo.address1" type="hidden" ref={methods.register} />
                        <input name="billTo.city" type="hidden" ref={methods.register} />
                        <input name="billTo.state" type="hidden" ref={methods.register} />
                        <input name="billTo.zip" type="hidden" ref={methods.register} />

                        {shipToMethods.fields.map((item, index) => {
                          return (
                            <div key={"shipToMethods-" + index}>
                              <input type={"hidden"} name={`shipTo[${index}].id`} ref={methods.register()} defaultValue={item.id} />
                              <input type={"hidden"} name={`shipTo[${index}].name`} ref={methods.register()} defaultValue={item.name} />
                              <input type={"hidden"} name={`shipTo[${index}].address1`} ref={methods.register()} defaultValue={item.address1} />
                              <input type={"hidden"} name={`shipTo[${index}].address2`} ref={methods.register()} defaultValue={item.address2} />
                              <input type={"hidden"} name={`shipTo[${index}].city`} ref={methods.register()} defaultValue={item.city} />
                              <input type={"hidden"} name={`shipTo[${index}].state`} ref={methods.register()} defaultValue={item.state} />
                              <input type={"hidden"} name={`shipTo[${index}].zip`} ref={methods.register()} defaultValue={item.zip} />
                              <input type={"hidden"} name={`shipTo[${index}].country`} ref={methods.register()} defaultValue={item.country} />
                            </div>
                          )
                        })}

                        <Controller
                          name="customerNo"
                          required
                          control={methods.control}
                          render={(props) => (
                            <HookSelectFieldCustomer
                              name={props.name}
                              value={props.value}
                              fields={[
                                { name: 'customerNo', value: 'name' },
                                { name: 'billTo', value: 'billTo' },
                                { name: 'shipTo', value: 'shipTo' },
                                //{ name: 'paymentMethod', value: 'paymentMethod' },
                                { name: 'salesRep', value: 'salesRep' },
                                { name: 'paymentTerm', value: 'paymentTerm' },
                                { name: 'freightTerm', value: 'freightTerm' },
                              ] as NameValue[]}
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
                          name="salesRep"
                          control={methods.control}
                          render={(props) => (
                            <TextField
                              select
                              label="Sales Rap"
                              fullWidth
                              onChange={(value) => {
                                props.onChange(value);
                              }}
                              value={props.value}
                            >
                              <MenuItem value={'CS'}>CS</MenuItem>
                              <MenuItem value={'JJ'}>JJ</MenuItem>
                            </TextField>
                          )}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box m={1}>
                        <Controller
                          name="orderClass"
                          control={methods.control}
                          render={(props) => (
                            <TextField
                              select
                              label="Order Class"
                              fullWidth
                              onChange={(value) => {
                                props.onChange(value);
                              }}
                              value={props.value}
                            >
                              <MenuItem value={'B'}>B</MenuItem>
                              <MenuItem value={'C'}>C</MenuItem>
                              <MenuItem value={'H'}>H</MenuItem>
                              <MenuItem value={'S'}>S</MenuItem>
                              <MenuItem value={'P'}>P</MenuItem>
                              <MenuItem value={'T'}>T</MenuItem>
                              <MenuItem value={'M'}>M</MenuItem>
                            </TextField>
                          )}
                        />
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid container >
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
                          {shipTo && <Typography variant="caption">
                            <div>{shipTo.address1}</div>
                            <div>{shipTo.address2}</div>
                            <div>{shipTo.city}, {shipTo.state}</div>
                            <div>{shipTo.zip} </div>
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
                              select
                              label="Paymetn Term"
                              fullWidth
                              onChange={(value) => {
                                props.onChange(value);
                              }}
                              value={props.value}
                            >
                              <MenuItem value={'Net'}>Net</MenuItem>
                              <MenuItem value={'Net 30'}>Net 30</MenuItem>
                              <MenuItem value={'CIA'}>CIA</MenuItem>
                              <MenuItem value={'CAD'}>CAD</MenuItem>
                            </TextField>
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
                              select
                              label="Freight Term"
                              fullWidth
                              onChange={(value) => {
                                props.onChange(value);
                              }}
                              value={props.value}
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

                  </Grid>

                  <Grid container >
                    <Grid item xs={12} sm={6}>
                      <Box m={1}>
                        <Controller
                          name="discountPayIn"
                          control={methods.control}
                          as={
                            <NumberFormat
                              label="Discount Pay In Day"
                              fullWidth
                              inputProps={{ style: { textAlign: 'right' } }}
                              thousandSeparator
                              isNumericString
                              customInput={TextField}
                              autoComplete="off"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start"> </InputAdornment>
                                ),
                              }}
                            >
                            </NumberFormat>
                          }
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box m={1}>
                        <Controller
                          name="estDeliveryAt"
                          control={methods.control}
                          render={({ onChange, value }) => (
                            <KeyboardDatePicker
                              autoComplete="off"
                              fullWidth
                              variant="inline"
                              format="MM/DD/yyyy"
                              label="Est.Delivery Date"
                              onChange={(v) => onChange(v)}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start"> </InputAdornment>
                                ),
                              }}
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
                          inputProps={{ style: { textAlign: 'right' } }}
                          fullWidth
                          control={methods.control}
                          label="Discount Percentage"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start"> </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">%</InputAdornment>
                            )
                          }}
                          as={TextField}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box m={1}>
                        <Controller
                          name="customerPO"
                          fullWidth
                          control={methods.control}
                          multiline
                          label="Customer PO"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start"> </InputAdornment>
                            ),
                          }}
                          as={TextField}
                        />
                      </Box>
                    </Grid>

                    <Grid container >
                      <Grid item>
                        <Box m={1}>
                          <Controller
                            name="proforma"
                            as={
                              <FormControlLabel
                                control={<Checkbox  />}
                                label="Proforma"
                              />
                            }
                            valueName="proforma"
                            type="checkbox"
                            onChange={([e]) => {
                              console.log('e.target.checked', e.target.checked);
                              return e.target.checked ? e.target.value : "";
                            }}
                            control={methods.control}
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
                          <Tags tags={values.tags} />
                        </Box>

                      </Grid>
                    </Grid>
                    {/* <Grid container>
                      <Grid item>
                        <Box style={{ paddingLeft: 10 }}>
                          <FormControlLabel control={<Checkbox name="checkedIMTC" />}
                            label="MTC SENT?"
                          />
                        </Box>
                      </Grid>
                    
                      <Grid item >
                        <Box style={{ paddingLeft: 10 }}>
                          <FormControlLabel control={<Checkbox name="checkedSO" />}
                            label="SO SENT?"
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid> */}
                  </Grid>
                </TableContainer>

              </Card>
            </Grid>

            <Grid item xs={12} sm={12} lg={9} >
              <Card
                className={classes.card}
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
                          key={'tab' + tab.id}
                        />
                      ))}
                    </Tabs>
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <Box textAlign="right">
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                      >
                        Create SO Confirmation
                      </Button>
                    </Box>
                  </Grid>
                </Grid>

                <Divider />

                {currentTab === 'orderDetail' &&
                  <OrderItem />
                }

                {currentTab === 'shipment' &&
                  <Box style={{ marginTop: 30, height: 846 }}>
                    {/* <Divider /> */}
                    {/* <AssignedItem order={order} onClose={onClose}/> */}
                    <OrderShipment OpenOrderEdit={OpenOrderEdit}/>
                  </Box>
                }
              </Card>

              <Box mt={2} textAlign="right" >
                {btnCloseLabel ?
                  <Button
                    style={{ marginRight: 30 }}
                    color="secondary"
                    //disabled={isSubmitting}
                    size="large"
                    variant="outlined"
                    onClick={handleCloseOrderEdit}
                  >
                    Close
                </Button>
                  :
                  <Button
                    style={{ marginRight: 30 }}
                    color="secondary"
                    //disabled={isSubmitting}
                    size="large"
                    variant="outlined"
                    onClick={handleCloseOrderEdit}
                  >
                    CANCEL
                </Button>
                }

                <Button
                  color="secondary"
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  SUBMIT
                </Button>
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
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          This is a success message!
        </Alert>
      </Snackbar>
    </div >
  );
};

OrderInfo.propTypes = {
  className: PropTypes.string,
  // @ts-ignore
  //salesOrder: PropTypes.object.isRequired
};

export default OrderInfo;