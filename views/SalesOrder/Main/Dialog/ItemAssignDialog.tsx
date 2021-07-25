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
  TableContainer,
  Grid,
  Snackbar
} from '@material-ui/core';
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';
import numeral from 'numeral';
import type { Theme } from 'src/theme';
import type { Inventory, ShipmentTableType, FromSite } from 'src/types/simpleorder';
import { TransitionProps } from '@material-ui/core/transitions';
import RemoveCircleOutlinedIcon from '@material-ui/icons/RemoveCircleOutlined';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useForm, Controller, SubmitHandler, useFieldArray, FormProvider } from "react-hook-form";
import NumberFormat from 'react-number-format';
import { DevTool } from "@hookform/devtools";
import axios2 from 'src/utils/axios2';
import ShipmentItemInner from 'src/views/dev/SalesOrder/ShipmentEdit/Dev/ShipmentItemInner';
import { Alert } from '@material-ui/lab';

interface ItemAssignDialogProps {
  className?: string;
  open: boolean;
  onClose: (event: React.MouseEvent<unknown>) => void;
  shipmentTables: ShipmentTableType[];
  //selectedObject: Lot[];
  OpenOrderEdit: (event: React.MouseEvent<unknown>, orderNo: string) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(3)
  },
  container: {
    //height: 735,
    //'&::-webkit-scrollbar': {
    //  width: '0.5em',
    //},
    //'&::-webkit-scrollbar-track': {
    //  webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
    //},
    //'&::-webkit-scrollbar-thumb': {
    //  backgroundColor: 'rgba(0,0,0,0.00)',
    //},
    //'&:hover::-webkit-scrollbar-thumb': {
    //  backgroundColor: 'gray'
    //}
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
  },
  cell: {
    //'& th.MuiTableCell-sizeSmall': {
    //  padding: '2px 5px 2px 5px',
    //},
    //'& td.MuiTableCell-sizeSmall': {
    //  padding: '2px 5px 2px 5px',
    //},
    //'& tr.MuiTableCell-sizeSmall': {
    //  padding: '2px 5px 2px 5px',
    //},
  }
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ItemAssignDialog: FC<ItemAssignDialogProps> = ({
  className,
  open,
  onClose,
  shipmentTables,
  OpenOrderEdit,
  ...rest
}) => {

  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [sites, setSites] = useState<FromSite[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [deletedShipmentLotIds, setDeletedShipmentLotIds] = useState<string[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [btnCloseLabel, setBtnCloseLabel] = useState<boolean>(false);

  const methods = useForm();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control: methods.control,
    name: "lots",
    keyName: "_id",
  });

  const [lotDialog, setLotDialog] = React.useState({
    isOpen: false,
    index: null
  });

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const handleClickPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const popoverId = Boolean(anchorEl) ? 'simple-popover' : undefined;

  // const onSubmit = (data) => { JSON.stringify(data, null, 2) }
  const onSubmit = async (data) => {
    var sendData = {
      lots: data.lots,
      deletedLotIds: deletedShipmentLotIds
    };
    console.log(sendData);

    var response = await axios2.put(`/sh/lotsUpsert`, sendData);
    console.log(`/sh/lotsUpsert`, response);
    setOpenSnackbar(true);
    setBtnCloseLabel(true);
  };

  const getSites = useCallback(async () => {
    try {
      const response = await axios2.get<FromSite[]>('/fromSite/list');
      //console.log('FiltersProvider /sos', response);

      if (isMountedRef.current) {
        setSites(response.data);
      }
      else {
        debugger;
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getSites();
  }, [getSites]);

  const getInventories = useCallback(async () => {
    try {
      //console.log('getInventories', itemMethods.fields.map(a => a.from))
      const response = await axios2.post<Inventory[]>('/inventory/listByFroms/', shipmentTables.map(a => a.fromSite));
      //console.log('FiltersProvider /sos', response);

      if (isMountedRef.current) {
        setInventories(response.data);
      }
      else {
        debugger;
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef, shipmentTables]);

  useEffect(() => {
    getInventories();
  }, [getInventories]);

  const getLotDraft = useCallback(async () => {
    var response = await axios2.post('sh/lotsRequest', shipmentTables.map((shipmentTable) => shipmentTable.id));
    console.log('sh/LotsRequet', response);
    methods.reset({
      lots: response.data
    });

    setDeletedShipmentLotIds([]);
    setBtnCloseLabel(false);
  }, [isMountedRef, shipmentTables]);

  useEffect(() => {
    getLotDraft();
  }, [getLotDraft]);

  
  const handleCloseSnackbar = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth='xl'
      {...rest}
    >
      <FormProvider {...methods} >
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <DevTool control={methods.control} />
          <div className={classes.root}>
            <Box
              display="flex"
              justifyContent="space-between"
              style={{ marginBottom: 30 }}
            ><Typography variant="h4" color="textSecondary">Quick ItemAssign</Typography></Box>
            <Divider />
            <Box mt={2}>
              {/* <TableContainer className={classes.container}> */}
                <Table size="small" stickyHeader className={classes.table}>
                  <TableHead>
                  <TableRow>
                      <TableCell align="center"></TableCell>
                      <TableCell align="center">Sales Order</TableCell>
                      <TableCell align="center">Customer</TableCell>
                      <TableCell align="center">Spec</TableCell>
                      <TableCell align="center">Attribute</TableCell>
                      <TableCell align="center">From Site</TableCell>
                      <TableCell align="center">Ship To</TableCell>
                      <TableCell align="center">ETD</TableCell>
                      <TableCell align="center">ETA</TableCell>
                      <TableCell align="center">Allocated</TableCell>
                      <TableCell align="center">Weight (lb)</TableCell>
                      <TableCell align="center">Release No</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>

                  </TableHead>
                  <TableBody>
                    {fields.map((item, index) => {
                      console.log('ItemAssignDialog', item);
                      return (
                        <ShipmentItemInner key={item._id}
                          item={item}
                          index={index}
                          sites={sites}
                          OpenOrderEdit={OpenOrderEdit}
                          setLotDialog={setLotDialog}
                          handleClickPopover={handleClickPopover}
                          inventories={inventories}
                        />
                      )
                    })}
                  </TableBody>
                </Table>
              {/* </TableContainer> */}

              <Popover
                id={popoverId}
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
                <Box>
                  <Typography variant="h5" align="center">Delete Lot?</Typography>
                </Box>
                <Box>
                  <Button color="primary" size="small" variant="outlined" style={{ margin: 10 }}
                    onClick={() => {
                      setLotDialog({
                        isOpen: false,
                        index: null
                      })
                    }}>CANCEL</Button>
                  <Button color="primary" size="small" variant="contained" style={{ margin: 10 }}
                    onClick={() => {
                      deletedShipmentLotIds.push(fields[lotDialog.index].id);
                      setDeletedShipmentLotIds(deletedShipmentLotIds);
                      remove(lotDialog.index);
                      setLotDialog({
                        isOpen: false,
                        index: null
                      });
                    }}
                  >Delete</Button>
                </Box>
              </Popover>
            </Box>

            <Box mt={2} textAlign="right" >
              {btnCloseLabel ?
                <Button
                  style={{ marginRight: 30 }}
                  color="secondary"
                  //disabled={isSubmitting}
                  size="large"
                  variant="outlined"
                  onClick={(event) => onClose(event)}
                >CLOSE</Button>
                :
                <Button style={{ marginRight: 30 }} color="secondary"
                  //disabled={isSubmitting}
                  size="large" variant="outlined"
                  onClick={(event) => onClose(event)}
                >CANCEL</Button>
              }

              <Button color="secondary"
                //disabled={isSubmitting}
                size="large" variant="contained"
                onClick={methods.handleSubmit(onSubmit)}
              >SUBMIT</Button>
            </Box>
            {/*
            <Grid container spacing={2}>
              <Grid item xs={6} sm={6} lg={12} >
                watchValues
                <pre style={{ color: '#ffffff' }}>{JSON.stringify(methods.watch(), null, 2)}</pre>
                <br />deletedShipmentLotIds
                <pre style={{ color: '#ffffff' }}>{JSON.stringify(deletedShipmentLotIds, null, 2)}</pre>
                <br />
                getValues
                <pre style={{ color: '#ffffff' }}>{JSON.stringify(methods.getValues(), null, 2)}</pre>
                <br />
                fields
                <pre style={{ color: '#ffffff' }}>{JSON.stringify(fields, null, 2)}</pre>
              </Grid>
            </Grid>
            */}
          </div>
        </form>
      </FormProvider>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          This is a success message!
          </Alert>
      </Snackbar>
    </Dialog>
  );
};

ItemAssignDialog.propTypes = {
  // @ts-ignore
  // card: PropTypes.object.isRequired,
  className: PropTypes.string,
  // @ts-ignore
  // list: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};

ItemAssignDialog.defaultProps = {
  open: false,
};

export default ItemAssignDialog;