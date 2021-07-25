import React, { useMemo, useState } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import numeral from 'numeral';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  makeStyles,
  TextField,
  InputAdornment,
  IconButton,
  SvgIcon,
  Popover,
  Typography
} from '@material-ui/core';
import type { Order, Lot, Allocation, Shipment } from 'src/types/simpleorder';
import { Formik, FastField, Field, FieldArray } from 'formik';
import { DatePicker } from 'formik-material-ui-pickers';
import DeleteIcon from '@material-ui/icons/Delete';

interface ShipmentItemProps {
  className?: string;
  //selectedLineItems: string[];
  //allocaions: Allocation[];
  shipment: Shipment;
}

const useStyles = makeStyles(() => ({
  root: {},
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
}));

const createAllocationFromSelected = (allocaions: Allocation[], selectedLineItems: string[]): Allocation[] => {

  const allocationArr = allocaions.filter(allocation => selectedLineItems.includes(allocation.id))
  return allocationArr
};


//const deleteAllocationFromSelected = (allocaions: Allocation[], selectedLineItems: string[]): Allocation[] => {
//  const allocationArr = allocaions.filter(allocation => selectedLineItems.includes(allocation.id))
//  return allocationArr
//};

// const handleDeleteLineItem = (event: React.MouseEvent, id: string): void => {
//   if (!selectedLineItems.includes(id)) {
//     setshipmentLineItems((prevSelected) => [...prevSelected, id]);
//   } else {
//     setshipmentLineItems((prevSelected) => prevSelected.filter((a) => a !== id));
//   }
// }

const ShipmentItem: FC<ShipmentItemProps> = ({ className, shipment, ...rest }) => {

  const classes = useStyles();

  const [shipmentDialog, setShipmentDialog] = React.useState({
    isOpen: false,
    index2: null
  });

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  //const selectedAllocationsForShipment = createAllocationFromSelected(shipment)

  return (
    <>
        {/*<Formik
      initialValues={{


        submit: null
      }}

      onSubmit={
        async (values, {
          setErrors,
          setStatus,
          setSubmitting
        }) => {
          try {
            // NOTE: Make API request
            setStatus({ success: true });
            setSubmitting(false);
          } catch (err) {
            console.error(err);
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
    >*/ }
        < Card >
        <CardHeader title="Order items" />
        <Divider />

        <Box >
          <Table size="small" stickyHeader className={classes.cell}>
            <TableHead>
              <TableRow>
                <TableCell>Sales Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>From Site</TableCell>
                <TableCell>Ship To</TableCell>
                <TableCell>ETD</TableCell>
                <TableCell>ETA</TableCell>
                <TableCell>Allocated</TableCell>
                <TableCell>Weight</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <FieldArray name="Lot"
                render={arrayHelpers => (
                  <>
                    {shipment.lots.map((lot, index) => (
                      <TableRow key={lot.id}>
                        <TableCell>
                        </TableCell>
                        <TableCell>
                        </TableCell>
                        <TableCell>
                          {lot.id}
                        </TableCell>
                        <TableCell>
                        </TableCell>
                        <TableCell>
                        </TableCell>
                        <TableCell>{/*ETD*/}
                          <Field
                            name={`lots.${index}.etd`}
                            label="ETD"
                            noWrap
                            size="small"
                            margin="dense"
                            component={DatePicker}
                            value={lot.etd}
                            format="MM/DD/yyyy"
                            inputProps={{ style: { textAlign: 'right' } }}
                            InputProps={{
                              startAdornment: (<InputAdornment position="start"> </InputAdornment>),
                            }}
                          />
                        </TableCell>
                        <TableCell>{/*ETA*/}
                          <Field
                            name={`lots.${index}.eta`}
                            label="ETA"
                            noWrap
                            size="small"
                            margin="dense"
                            component={DatePicker}
                            value={lot.eta}
                            format="MM/DD/yyyy"
                            inputProps={{ style: { textAlign: 'right' } }}
                            InputProps={{
                              startAdornment: (<InputAdornment position="start"> </InputAdornment>),
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {lot.weight/* - lot.shipped*/}
                        </TableCell>
                        <TableCell>{/*Weight*/}
                          <FastField
                            autoComplete="off"
                            as={TextField}
                            type="input"
                            name={`lots.${index}.weight`}
                            value={numeral(lot.weight || '').format(`0,0`)}
                            noWrap
                            size="small"
                            margin="dense"
                            variant="outlined"
                            style={{ backgroundColor: 'rgba(66, 26, 126, 0.0818)' }}
                            inputProps={{ style: { textAlign: 'right' } }}
                          />
                        </TableCell>

                        <TableCell>
                          <IconButton size="small"
                            aria-describedby={id}
                            onClick={(event) => {
                              setShipmentDialog({
                                isOpen: true,
                                index2: index
                              });
                              handleClick(event);
                            }}
                          >
                            <SvgIcon>
                              <DeleteIcon />
                            </SvgIcon>
                          </IconButton>
                        </TableCell>

                      </TableRow>
                    ))}
                  </>
                )}
              />
            </TableBody>
          </Table>

          <Popover
              id={id}
              anchorEl={anchorEl}
              open={shipmentDialog.isOpen}
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
                  onClick={() => {
                    //arrayHelpers.remove(shipmentDialog.index2);
                    setShipmentDialog({
                      isOpen: false,
                      index2: null
                    });
                  }}>
                YES
                  </Button>
                <Button color="primary" size="small"
                  onClick={() => {
                    setShipmentDialog({
                      isOpen: false,
                      index2: null
                    });
                  }}>
                CANCEL
                  </Button>
              </Box>
            </Popover>

        </Box>
      </Card>

{/*</Formik>*/ }       
    </>
  );
};

ShipmentItem.propTypes = {
  className: PropTypes.string,

};

ShipmentItem.defaultProps = {

};

export default ShipmentItem;
