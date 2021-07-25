import React, { useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
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
  makeStyles,
  InputAdornment
} from '@material-ui/core';
import ReceiptIcon from '@material-ui/icons/ReceiptOutlined';
import { useForm, Controller, SubmitHandler, useFieldArray } from "react-hook-form";
import NumberFormat from 'react-number-format';



interface TransportationInfoProps {
  className?: string;
  control: any;
  transportationType: string;

}

const statusOptions = ['Canceled', 'Completed', 'Rejected'];

const useStyles = makeStyles(() => ({
  root: {}
}));

const TransportationInfo: FC<TransportationInfoProps> = ({ className, control, transportationType, ...rest }) => {
  const classes = useStyles();
  const [status, setStatus] = useState<string>(statusOptions[0]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setStatus(event.target.value);
  };

  return (
    <React.Fragment>
      {transportationType === 'Flatbed Truck' && (

        <Box m={1}>
          <Controller
            name="freightRate"
            control={control}

            as={
              <NumberFormat
                label="Freigh Rate"
                fullWidth
                thousandSeparator
                isNumericString
                customInput={TextField}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  )
                }}
              >
              </NumberFormat>
            }
          />
        </Box>
      )}
      {transportationType === 'Container Truck' && (
        <Box m={1}>
          <Controller
            name="freightRate"
            control={control}
            as={
              <NumberFormat
                label="Container No"
                fullWidth
                thousandSeparator
                isNumericString
                customInput={TextField}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"> </InputAdornment>
                  )
                }}
              >
              </NumberFormat>
            }
          />
        </Box>
      )}
    </React.Fragment>

  );
};

TransportationInfo.propTypes = {
  className: PropTypes.string,
  // @ts-ignore
  // order: PropTypes.object.isRequired
};

export default TransportationInfo;
