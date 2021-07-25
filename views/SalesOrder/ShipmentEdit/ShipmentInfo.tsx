import React, { useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { DatePicker } from 'formik-material-ui-pickers';
import moment from 'moment';
import numeral from 'numeral';
import {
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  Link,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Grid,
  Box,
  Typography,
  InputAdornment,
  Select,
  MenuItem,
  makeStyles
} from '@material-ui/core';
import ReceiptIcon from '@material-ui/icons/ReceiptOutlined';
import type { Order, Lot, Allocation, Shipment, OrderStatus } from 'src/types/simpleorder';
import { Field } from 'formik';
import FormikSelectOrderStatus from "src/components/FormikSelect/FormikSelectOrderStatus";
import type { FormikSelectItem } from "src/types/formik";
import { useForm, Controller, SubmitHandler, useFieldArray } from "react-hook-form";
import NumberFormat from 'react-number-format';
import { DevTool } from "@hookform/devtools";


interface ShipmentInfoProps {
  className?: string;

  //selectedLineItems: string[];
  shipment: Shipment;
}

const orderStatus: FormikSelectItem<OrderStatus>[] = [
  { label: 'Draft', value: 'Draft' },
  { label: 'Open', value: 'Open' },
  { label: 'Canceled', value: 'Canceled' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Rejected', value: 'Rejected' },
  { label: 'Hold', value: 'Hold' }
];

const useStyles = makeStyles(() => ({
  root: {},
  card: {
    padding: 10,
    minHeight: 980,
    maxHeight: 980,
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
}));

const ShipmentInfo: FC<ShipmentInfoProps> = ({ className, shipment, ...rest }) => {
  const classes = useStyles();

  return (
    <Card
      className={classes.card}
      {...rest}
    >
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>

          <Box m={1}>
            <Typography variant="h4">
              SALES SHIPMENT
           </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box m={1}>
            <Typography variant="h4" align="right">
              {shipment.no}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Divider />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box m={1}>

            <FormikSelectOrderStatus
              name="orderStatus"
              items={orderStatus}
              label="Order Status"
              value={shipment.orderStatus}
              required
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box m={1}>
            <Field
              inputProps={{ style: { textAlign: 'right' } }}
              fullWidth
              style={{ marginTop: 5 }}
              component={DatePicker}
              label="Order Date"
              name="orderedAt"
              required
              value={shipment.orderedAt}
              format="MM/DD/yyyy"
              InputProps={{
                startAdornment: (<InputAdornment position="start"> </InputAdornment>),
              }}
            />
          </Box>
        </Grid>
      </Grid>


      <Grid container spacing={1}>
        <Grid item xs={12} sm={12}>
          <Box m={1}>
            <Field
              type="input"
              fullWidth
              required
              name="vendor"
              label="Vendor"
              as={TextField}
              value={shipment.vendor ?? ''}
              InputProps={{
                startAdornment: <InputAdornment position="start"> </InputAdornment>,
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box m={1}>
            <Field
              type="input"
              fullWidth
              name="freightMemo"
              label="freight"
              as={TextField}
              value={shipment.freightMemo ?? ''}
              InputProps={{
                startAdornment: <InputAdornment position="start"> </InputAdornment>,
              }}
            />
          </Box>
        </Grid>


      </Grid>

      <Grid container spacing={1}>
        <Grid item xs={12} sm={12}>
          <Box m={1}>
            <Field
              type="input"
              fullWidth
              multiline
              name="internalMemo"
              label="Internal Note"
              as={TextField}
              value={shipment.internalMemo ?? ''}
              InputProps={{
                startAdornment: <InputAdornment position="start"> </InputAdornment>,
              }}
            />
          </Box>

        </Grid>
      </Grid>
      <Divider />
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <Box m={1}>
            <label>transportType</label>
          </Box>
        </Grid>
      </Grid>

    </Card>
  );
};

ShipmentInfo.propTypes = {
  className: PropTypes.string,
  // @ts-ignore
  // order: PropTypes.object.isRequired
};

export default ShipmentInfo;
