import React, { useCallback, useState, useEffect, Attributes, useRef } from 'react';
import {
  Formik,
  Field,
  Form,
  useField,
  FieldAttributes,
  FieldArray,
  FastField
} from "formik";
import type { FC } from 'react';
import PropTypes from 'prop-types';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import axios2 from 'src/utils/axios2';
import clsx from 'clsx';
import numeral from 'numeral';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
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
  Button,
  TextField,
  Grid,
  SvgIcon,
  Checkbox,
} from '@material-ui/core';
import type { Order, Lot, OrderStatus } from 'src/types/simpleorder';
import type { Spec, Attribute } from 'src/types/spec';
import { Autocomplete } from '@material-ui/lab';
import { X as XIcon } from 'react-feather';

interface AssignedItemProps {
  className?: string;
  order: Order;
  onClose?: () => void;
}

const useStyles = makeStyles(() => ({
  root: {},
  card: {
    padding: 10,
    minHeight: 840,
  },
  cell: {
    //paddingTop:1,
    //paddingBottom:1,
    '& th.MuiTableCell-sizeSmall': {
      padding: 'none'
    },
    '& td.MuiTableCell-sizeSmall': {
      padding: 'none'
    },
    '& tr.MuiTableCell-sizeSmall': {
      padding: 'none'
    },
  },
}));

const AssignedItem: FC<AssignedItemProps> = ({ className, order, onClose, ...rest }) => {
  const isMountedRef = useIsMountedRef('OrderItemProps');
  const [spec, setSpec] = React.useState<Spec>(null);
  const [attribute, setAttribute] = React.useState<Attribute>(null);

  const classes = useStyles();

  const [selectedLot, setSelectedLot] = useState<string[]>([]);
  const [specs, setSpecs] = useState<Spec[]>([]);
  const getSpecs = useCallback(async () => {
    try {
      const response = await axios2.get<Spec[]>('/spec/list');
      console.log('response.data', response.data);

      if (isMountedRef.current) {
        setSpecs(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const getAttributes = useCallback(async () => {
    try {
      const response = await axios2.get<Attribute[]>('/attribute/list');
      console.log('response.data', response.data);

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
    getSpecs();
  }, [getSpecs]);

  useEffect(() => {
    if (spec == null) {
      setAttribute(null);
    }
  }, [spec]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //console.log(event.target.value);
    const lotId = event.target.value;

    if (!selectedLot.includes(lotId)) {
      setSelectedLot((prevSelected) => [...prevSelected, lotId]);
    } else {
      setSelectedLot((prevSelected) => prevSelected.filter((id) => id !== lotId));
    }

    console.log(selectedLot);
  };

  return (
    <React.Fragment>
      {/* <CardHeader title="Order items" /> */}
      {/* <Divider /> */}

      <FieldArray name="lots">
        {arrayHelpers => (
          <Box style={{ paddingTop: 13 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} lg={4}>
                <Autocomplete
                  id="select1"
                  value={spec}
                  options={specs}
                  onChange={(event: any, newValue: Spec | null) => {
                    setSpec(newValue);
                    setAttribute(null);
                  }}
                  getOptionLabel={(option) => option.specNo}
                  style={{ width: 350 }}
                  renderInput={(params) => <TextField {...params} label="Spec" variant="outlined" />}
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
              <Grid item xs={12} sm={12} lg={4}>
                <Autocomplete
                  id="select2"
                  value={attribute}
                  options={attributes == undefined ? [] : attributes}
                  onChange={(event: any, newValue: Attribute | null) => {
                    setAttribute(newValue);
                  }}
                  getOptionLabel={(option) => option.id + '|' + option.paintColor + '|' + option.paintBrand + '|' + option.paintCode + '|' + option.paintType}
                  style={{ width: 350 }}
                  renderInput={(params) => <TextField {...params} label="Attributes" variant="outlined" />}
                  noOptionsText='No selected spec'

                  renderOption={(option) => {
                    return (
                      <Grid container alignItems="center">
                        <Grid item>
                          {option.id + '|' + option.paintColor + '|' + option.paintBrand + '|' + option.paintCode + '|' + option.paintType}
                        </Grid>
                      </Grid>
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={4}>
                <Box mt={2} textAlign="right">
                  {selectedLot.length == 0 &&
                    <Button
                      color="secondary"
                      size="large"
                      variant="contained"
                      onClick={() =>
                        arrayHelpers.push({
                          id: "" + Math.random(),
                          orderNo: order?.no,
                          no: "SoLot" + ((order.lots == null || order.lots == undefined) ? 0 : order.lots.length),

                          //fromSite: null,
                          shipToState: order.shipTo[0].state,

                          //product: spec.productGrade,

                          //productGrade: spec.productGrade,
                          //type: spec.type,
                          //finish: spec.finish,

                          specId: spec.specId,
                          specNo: spec.specNo,

                          attributeId: attribute.id,
                          paintBrand: attribute.paintBrand,
                          paintType: attribute.paintType,
                          paintCode: attribute.paintCode,
                          paintColor: attribute.paintColor,

                          //relatedOrders: null,

                          //qty: 0,
                          //qtyUnit: null,
                          //amount: 0,
                        })
                      }
                    >
                      add lot
                   </Button>
                  }
                  {selectedLot.length > 0 &&
                    <Button color="secondary"
                      size="large"
                      variant="contained"

                    >
                      Fulfill
                    </Button>
                  }
                </Box>
              </Grid>
            </Grid>

            <Box mt={2}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>SO</TableCell>
                    <TableCell>Lot</TableCell>
                    <TableCell>Spec</TableCell>
                    <TableCell>From</TableCell>
                    <TableCell>To</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>QtyUnit</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Remove</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {order.lots && order.lots.map((lot, index) => {
                    return (
                      <TableRow key={lot.id}>
                        <TableCell>
                          <Checkbox
                            name={`lots.${index}.cb`}
                            onChange={handleChange}
                            value={lot.id}
                          />
                        </TableCell>
                        <TableCell>
                          {lot.orderNo}
                        </TableCell>
                        <TableCell>
                          {lot.no}
                        </TableCell>
                        <TableCell>
                          {lot.specNo}
                        </TableCell>

                        <TableCell>
                          <FastField
                            autoComplete="off"
                            as={TextField}
                            type="input"
                            label="From Site"
                            name={`lots.${index}.fromSite`}
                            value={lot.fromSite || ''}
                            fullWidth
                          />
                        </TableCell>

                        <TableCell>
                          {lot.shipToState}
                        </TableCell>

                        <TableCell>
                          <FastField
                            autoComplete="off"
                            as={TextField}
                            type="input"
                            label="Qty"
                            name={`lots.${index}.qty`}
                            value={lot.qty || ''}
                            required
                            fullWidth
                          />
                        </TableCell>

                        <TableCell>
                          <FastField
                            autoComplete="off"
                            as={TextField}
                            type="input"
                            label="qtyUnit"
                            name={`lots.${index}.qtyUnit`}
                            value={lot.qtyUnit || ''}
                            required
                            fullWidth
                          />
                        </TableCell>

                        <TableCell>
                          <FastField
                            autoComplete="off"
                            as={TextField}
                            type="input"
                            label="amount"
                            name={`lots.${index}.amount`}
                            value={lot.amount || ''}
                            required
                            fullWidth
                          />
                        </TableCell>

                        <TableCell>
                          <Button onClick={() => arrayHelpers.remove(index)}>
                            <SvgIcon fontSize="small">
                              <XIcon />
                            </SvgIcon>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                  }
                </TableBody>
              </Table>
            </Box>
          </Box>
        )}
      </FieldArray>

      <br />
      <div><pre>{JSON.stringify(order.lots, null, 2)}</pre></div>
      <div>{`spec: ${spec !== null ? `'${JSON.stringify(spec, null, 2)}'` : 'null'}`}</div>
      <div>{`attribute: ${attribute !== null ? `'${JSON.stringify(attribute, null, 2)}'` : 'null'}`}</div>
    </React.Fragment>
  );
};

AssignedItem.propTypes = {
  className: PropTypes.string,
};

AssignedItem.defaultProps = {

};

export default AssignedItem;