import React, { useCallback, useEffect, useState } from 'react';
import type { FC } from 'react';
import {
  //Box,
  //Container,
  makeStyles,
  //Grid,
  //Typography,
  //Tabs,
  //Divider
} from '@material-ui/core';
import type { Theme } from 'src/theme';
//import axios2 from 'src/utils/axios2';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
//import Page from 'src/components/Page';
import { FiltersProvider } from 'src/views/dev/SalesOrder/Main/FiltersContext';
import InvoiceDialog from 'src/views/dev/SalesOrder/InvoiceEdit/InvoiceDialog';

//const useStyles = makeStyles((theme: Theme) => ({
//  root: {
//    //  backgroundColor: theme.palette.background.dark,
//    //  minHeight: '100%',
//    //  paddingTop: theme.spacing(3),
//    //  paddingBottom: theme.spacing(3)
//  }
//}));

const SalesShipmentEdit: FC = () => {
  //const classes = useStyles();

  const isMountedRef = useIsMountedRef();

  const [invoice, setInvoice] = useState<any>(null);

  const getInvoice = useCallback(async () => {
    try {
      //const response = await axios2.get<Order[]>('/SOs');
      //console.log(response);

      //const response = await axios2.get('/sh/SH-210050004');
      //console.log(response);

      if (isMountedRef.current) {
        setInvoice({
          no: 'SI-210010001',
          status: 'Draft',
          soNo: '5s757d5d58',
          salesRep: 'CS',
          billTo: {},
          shipTo: {},
          freightTerm: {},
          paymentTerm: {},
          discountPercentage: 5,
          discountPayIn: 10,
          lots: []
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getInvoice();
  }, [getInvoice]);

  return (

    <FiltersProvider>
      {invoice && <InvoiceDialog
        open={true}
        handleDialog1Close={null}
        invoice={invoice}
        OpenOrderEdit={null}
      //selectedLineItems={selectedLineItems}
      //allocaions={allocaions}
      />}
      
    </FiltersProvider>
  )
};

export default SalesShipmentEdit;