import React, {
  useCallback,
  useEffect,
  useState
} from 'react';
import type { FC, ChangeEvent } from 'react';
import {
  makeStyles,

} from '@material-ui/core';
import type { Theme } from 'src/theme';
import axios from 'src/utils/axios';
import axios2 from 'src/utils/axios2';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import Page from 'src/components/Page';
import type { Order, Lot, Shipment, Filters } from 'src/types/simpleorder';

import MainResults from './Main/MainResults';
import type { Customer } from 'src/types/customer1';
import { FiltersProvider } from './Main/FiltersContext';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),

  },
}));

const SalesOrder: FC = () => {
  //console.log('index Render...');

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  // const getShipments = useCallback(async () => {
  //   try {
  //     const response = await axios.get<{ shipments: Shipment[]; }>('/api/shipment');
  //     if (isMountedRef.current) {
  //       setShipments(response.data.shipments);
  //     }
  //     else {
  //       debugger;
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }, [isMountedRef]);

  // useEffect(() => {
  //   getShipments();
  // }, [getShipments]);



  // const getOrders = useCallback(async () => {
  //   try {
  //     const response = await axios2.get<Order[]>('/sos');
  //     //const response = await axios2.get<Order[]>('/ordersfromgoogle');
  //     console.log('/sos1', response);

  //     if (isMountedRef.current) {
  //       setOrders(response.data);


  //     }
  //     else {
  //       debugger;
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }, [isMountedRef]);

  // useEffect(() => {
  //   getOrders();
  // }, [getOrders]);


  return (

    <FiltersProvider>
      <Page
        title="Sales Order"
      >
        <MainResults customers={customers} shipments={shipments} />
      </Page>
    </FiltersProvider >
  );
};

export default SalesOrder;
