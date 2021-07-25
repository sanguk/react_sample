import React, { useCallback, useEffect, useState } from 'react';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Dialog,
  Divider,
  Typography,
  makeStyles,
  Table,
  TableHead,
  TableCell,
  TableRow,
  Slide,
  TextField,
  IconButton,
  SvgIcon,
  Button,
  Tooltip,
  Select,
  MenuItem,
  TableBody,
  Popover,
  Snackbar,
} from '@material-ui/core';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import numeral from 'numeral';
import type { Theme } from 'src/theme';
import type { Lot, FromSite } from 'src/types/simpleorder';
import { TransitionProps } from '@material-ui/core/transitions';
import DeleteIcon from '@material-ui/icons/Delete';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useForm, Controller, useFieldArray } from "react-hook-form";
import NumberFormat from 'react-number-format';
import { DevTool } from "@hookform/devtools";
import axios2 from 'src/utils/axios2';
import { v4 as uuidv4 } from 'uuid';
import { Alert } from '@material-ui/lab';

interface AllocationDialogProps {
  className?: string;
  //card: Card;
  open: boolean;
  selectedLots: Lot[];
  handleActionItem1Click: () => void;
  OpenOrderEdit: (event: React.MouseEvent<unknown>, orderNo: string) => void
}

//const source = [
//  { value: 'Order', label: 'ORDER' },
//  { value: 'Inv', label: 'INV' }
//];

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(3)
  },
  table: {
    '& th.MuiTableCell-sizeSmall': {
      padding: '0 5px 0 10px',
    },
    '& td.MuiTableCell-sizeSmall': {
      padding: '0 5px 0 5px',
    },
    '& tr.MuiTableCell-sizeSmall': {
      padding: '0 5px 0 5px',
    },
  }
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AllocationDialog: FC<AllocationDialogProps> = ({
  className,
  selectedLots,
  open,
  handleActionItem1Click,
  OpenOrderEdit,
  ...rest
}) => {
  // console.log(defaultValues.SelectedLot)
  // console.log(defaultValues.TestData)

  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [site, setSite] = useState<FromSite[]>([]);
  const [deletedAlloationIds, setDeletedAlloationIds] = useState<string[]>([]);
  //const [selectedLots, setSelectedLots] = useState<Lot[]>(selectedObject);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [btnCloseLabel, setBtnCloseLabel] = useState<boolean>(false);

  const { handleSubmit, register, control, setValue, getValues, watch, reset } = useForm();
  const { fields, insert, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "list", // unique name for your Field Array
    keyName: "_id",// default to "id", you can change the key name
  });

  var watchValues = watch();

  // const onSubmit = (data) => { JSON.stringify(data, null, 2) }
  const onSubmit = async (data) => {
    var sendData = {
      addAndUpdates: data['list'],
      deleteIds: deletedAlloationIds
    };
    //console.log('AllocationDialog onSubmit', JSON.stringify(sendData, null, 2));

    var response = await axios2.put(`/so/allocations`, sendData);
    //console.log(`/so/allocations`, response);
    setOpenSnackbar(true);
    setBtnCloseLabel(true);
  };

  const getSite = useCallback(async () => {
    try {
      const response = await axios2.get<FromSite[]>('/fromSite/list');
      //console.log('/fromSite/list', response);

      if (isMountedRef.current) {
        setSite(response.data);
      }
      else {
        debugger;
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef, setSite]);

  useEffect(() => {
    getSite();
  }, [getSite]);

  useEffect(() => {
    var list = selectedLots.map((soLot) => ({
      allocations: (soLot.allocations == null || soLot.allocations.length == 0) ?
        [{
          //...allocation,
          id: null,//allocation.id,
          no: soLot.orderNo,
          lotNo: soLot.no,
          //allocationId: null,//allocation.id,
          customerNo: soLot.customerNo,
          categoryNo: soLot.categoryNo,
          specNo: soLot.specNo,
          attributeNo: soLot.attributeNo,
          allocated: soLot.allocated,
          source: 'Order',//allocation.source,
          relatedOrder: '',//allocation.relatedOrder,
          fromSite: '',//allocation.fromSite,
          weight: 0,//allocation.weight,
          lotWeight: soLot.weight
        }]
        :
        soLot.allocations.map(allocation => ({
          //...allocation,
          id: allocation.id,
          no: soLot.orderNo,
          lotNo: soLot.no,
          //allocationId: allocation.id,
          customerNo: soLot.customerNo,
          categoryNo: soLot.categoryNo,
          specNo: soLot.specNo,
          attributeNo: soLot.attributeNo,
          allocated: soLot.allocated,
          source: allocation.source,
          relatedOrder: allocation.relatedOrder,
          fromSite: allocation.fromSite,
          weight: allocation.weight,
          lotWeight: soLot.weight
        }))
    })).flatMap(a => a.allocations);

    reset({
      list: list
    });

    setDeletedAlloationIds([]);
    setBtnCloseLabel(false);
  }, [selectedLots, setValue, setDeletedAlloationIds]);

  const createSiteList = () => {
    const arr = site.map(a => a.site)
    const siteList = ([].concat(...arr))
    return (
      siteList
    )
  };

  const siteOption = createSiteList()

  // const setValuesForHidden = (index, item) => {
  //   setValue(`list[${index}].attributeNo`, item
  //   )
  // }

  const [allocationDialog, setAllocationDialog] = React.useState({
    isOpen: false,
    arrayHelpers: null,
    index: null
  });

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const open2 = Boolean(anchorEl);
  const id = open2 ? 'simple-popover' : undefined;

  const handleCloseSnackbar = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleActionItem1Click}
      TransitionComponent={Transition}
      maxWidth='xl'
      {...rest}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DevTool control={control} />
        <div className={classes.root}>
          <Box
            display="flex"
            justifyContent="space-between"
            style={{ marginBottom: 30 }}
          >
            <Typography
              variant="h4"
              color="textSecondary"
            >
              Quick Allocation
          </Typography>
          </Box>
          <Divider />
          <Box>
            <Table size="small" className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell align="center"> SO </TableCell>

                  <TableCell align="center"> Customer </TableCell>
                  <TableCell align="center"> Product </TableCell>
                  <TableCell align="center"> Spec </TableCell>
                  <TableCell align="center">
                    Attibute
                  </TableCell>
                  <TableCell align="center">
                    Un-Allocated (lb)
                  </TableCell>
                  <TableCell align="center">
                    Source
                  </TableCell>
                  <TableCell align="center">
                    Related Order
                  </TableCell>
                  <TableCell align="center">
                    From Site
                  </TableCell>
                  <TableCell align="center">
                    Allocation (lb)
                  </TableCell>
                  <TableCell align="center" colSpan={2}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((allocation, index) => {
                  //console.log('allocation', allocation, watchValues['list']);
                  var lotAllocated = watchValues['list'].filter(a => a.lotNo == allocation.lotNo).reduce((sum, current) => sum + numeral(current.weight).value(), 0);
                  var lotWeight = fields.filter(a => a.lotNo == allocation.lotNo)[0].lotWeight;
                  //console.log(allocation.lotNo + '.unAllocated', allocation.lotWeight, lotAllocated)

                  return (
                    <TableRow key={allocation._id}>
                      <TableCell>
                        <input type="hidden" ref={register()} name={`list[${index}].id`} defaultValue={allocation.id} />
                        <input type="hidden" ref={register()} name={`list[${index}].no`} defaultValue={allocation.no} />
                        <input type="hidden" ref={register()} name={`list[${index}].lotNo`} defaultValue={allocation.lotNo} />

                        <Button
                          onClick={(event) => OpenOrderEdit(event, allocation.orderNo)} >
                          <Typography variant="body2" color="textPrimary" style={{ textDecoration: 'underline', fontWeight: 'lighter' }}>
                            {allocation.no}
                          </Typography>
                        </Button>
                      </TableCell>
                      <TableCell style={{ maxWidth: 180, textOverflow: "ellipsis", overflow: "hidden" }}>
                        <Typography variant="body2" color="textSecondary" noWrap>
                          {allocation.customerNo}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary" noWrap>
                          {allocation.categoryNo}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary" noWrap>
                          {allocation.specNo}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary" noWrap>
                          {allocation.attributeNo}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap>
                          {numeral(lotWeight - lotAllocated).format(`0,0`)} / {numeral(lotWeight).format(`0,0`)}
                        </Typography>
                      </TableCell>
                      <TableCell style={{ width: 90 }}>
                        <Controller
                          fullWidth
                          name={`list[${index}].source`}
                          control={control}
                          defaultValue={allocation.source}
                          as={
                            <Select>
                              <MenuItem value={'Order'}>ORDER</MenuItem>
                              <MenuItem value={'Inv'}>INV</MenuItem>
                            </Select>
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Controller
                          as={TextField}
                          name={`list[${index}].relatedOrder`}
                          control={control}
                          defaultValue={allocation.relatedOrder} // make sure to set up defaultValue
                        />
                      </TableCell>
                      <TableCell style={{ width: 110 }}>
                        <Controller
                          name={`list[${index}].fromSite`}
                          control={control}
                          defaultValue={allocation.fromSite}
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
                      <TableCell style={{ width: 110 }}>
                        <Controller
                          as={NumberFormat}
                          thousandSeparator
                          isNumericString
                          customInput={TextField}
                          name={`list[${index}].weight`}
                          control={control}
                          defaultValue={allocation.weight} // make sure to set up defaultValue
                          inputProps={{ style: { textAlign: 'right' } }}
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Allocation">
                          <IconButton
                            size="small"
                            onClick={() => insert((index + 1),
                              {
                                id: '',
                                no: allocation.no,
                                lotNo: allocation.lotNo,
                                //allocationId: allocation.allocationId,
                                customerNo: allocation.customerNo,
                                categoryNo: allocation.categoryNo,
                                specNo: allocation.specNo,
                                attributeNo: allocation.attributeNo,
                                allocated: allocation.allocated,
                                source: allocation.source,
                                relatedOrder: allocation.relatedOrder,
                                fromSite: allocation.fromSite,
                                weight: 0,
                                lotWeight: allocation.lotWeight,
                              }
                            )}
                          >
                              <ShareOutlinedIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Delete">
                          <IconButton
                            aria-describedby={id}
                            onClick={(event) => {
                              console.log('delete', index);
                              deletedAlloationIds.push(allocation.id);
                              setDeletedAlloationIds(deletedAlloationIds);
                              setAllocationDialog({ isOpen: true, index: index, arrayHelpers: null });
                              handleClick(event);
                              //remove(index)
                            }}
                            size="small"
                          >
                              <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

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
              <Box style={{ marginTop: 10 }}>
                <Typography variant="h5" align="center">
                  Delete Item?
                  </Typography>
              </Box>
              <Box >
                <Button color="primary" size="small" variant="outlined" style={{ margin: 10 }}
                  onClick={() => {
                    setAllocationDialog({
                      isOpen: false,
                      arrayHelpers: null,
                      index: null
                    })
                  }}>CANCEL</Button>
                <Button color="primary" size="small" variant="contained" style={{ margin: 10 }}
                  onClick={() => {
                    remove(allocationDialog.index);
                    setAllocationDialog({
                      isOpen: false,
                      arrayHelpers: null,
                      index: null
                    });
                  }}>
                  DELETE
                  </Button>
              </Box>
            </Popover>

            <Box mt={2} textAlign="right" >
              {btnCloseLabel ?
                <Button
                  style={{ marginRight: 30 }}
                  color="secondary"
                  //disabled={isSubmitting}
                  size="large"
                  variant="outlined"
                  onClick={handleActionItem1Click}
                >CLOSE</Button>
                :
                <Button style={{ marginRight: 30 }} color="secondary"
                  //disabled={isSubmitting}
                  size="large" variant="outlined"
                  onClick={handleActionItem1Click}
                >CANCEL</Button>
              }

              <Button color="secondary"
                //disabled={isSubmitting}
                size="large" variant="contained"
                onClick={handleSubmit(onSubmit)}
              >SUBMIT</Button>
            </Box>
          </Box>
        </div>
      </form>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          This is a success message!
          </Alert>
      </Snackbar>
      {/*
      deletedAlloationIds
      <pre style={{ color: '#ffffff' }}>{JSON.stringify(deletedAlloationIds, null, 2)}</pre>
      <br />
      watchValues
      <pre style={{ color: '#ffffff' }}>{JSON.stringify(watchValues, null, 2)}</pre>
      <br />
      getValues
      <pre style={{ color: '#ffffff' }}>{JSON.stringify(getValues(), null, 2)}</pre>
      <br />
      fields
      <pre style={{ color: '#ffffff' }}>{JSON.stringify(fields, null, 2)}</pre>
      <br />
      selectedObject
      <pre style={{ color: '#ffffff' }}>{JSON.stringify(selectedLots, null, 2)}</pre>
      */}
    </Dialog>
  );
};

AllocationDialog.propTypes = {
  // @ts-ignore
  // card: PropTypes.object.isRequired,
  className: PropTypes.string,
  // @ts-ignore
  // list: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};

AllocationDialog.defaultProps = {
  open: false,
};

export default AllocationDialog;
