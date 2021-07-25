import React, { useState } from 'react';
import type {
  FC,
  ChangeEvent
} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Divider,
  Grid,
  makeStyles,
  Tab,
  Tabs
} from '@material-ui/core';
import type { Theme } from 'src/theme';
import type { OrderStatus, Shipment } from 'src/types/simpleorder';
import Fulfillment from './Drawer/Fulfillment';
//import LotBulkOperation from './BulkOperation/LotBulkOperation';
import Label from 'src/components/Label';
import MainHeader from './MainHeader';
import OrderTable from './Table/OrderTable';
import LotTable from './Table/LotTable';
import AllocationTable from './Table/AllocationTable';
//import ShipmentTable from '../ShipmentEdit/Dev/ShipmentTable';
import OrderEditResult from '../OrderEdit/OrderEditResult'
import type { Customer } from 'src/types/customer1';
import axios2 from 'src/utils/axios2';
//import { filter } from 'lodash';
//import FormikSelectOrderStatus from '../../../../components/FormikSelect/FormikSelectOrderStatus';
import ShipmentTable from './Table/ShipmentTable';
import InvoiceTable from './Table/InvoiceTable';
import AssignedItemTable from './Table/AssignedItemTable';
import useFilters from './useFilters';
import ShipmentDialog from '../ShipmentEdit/Dev/ShipmentDialog';

//demo data//

// 1.Interface 
interface MainResultsProps {
  className?: string;
  customers: Customer[];
  shipments: Shipment[];
}

// 2.Static variables
const getStatusLabel = (orderStatus: OrderStatus): JSX.Element => {
  const map = {
    Canceled: {
      text: 'Canceled',
      color: 'error'
    },
    Completed: {
      text: 'Completed',
      color: 'success'
    },
    Hold: {
      text: 'Hold',
      color: 'warning'
    },
    Open: {
      text: 'Open',
      color: 'primary'
    },
    Draft: {
      text: 'Draft',
      color: 'warning'
    },
    Rejected: {
      text: 'Rejected',
      color: 'error'
    }
  };
  // console.log(orderStatus);
  const { text, color }: any = map[orderStatus];

  return (
    <Label color={color}>
      {text}
    </Label>
  );
};

const tabs = [
  { value: 'order', label: 'Order Detail', id: '1' },
  { value: 'allocation', label: 'Allocation', id: '2' },
  { value: 'shipment', label: 'Shipment', id: '3' },
  { value: 'assignedItem', label: 'Assigned Item', id: '4' },
  { value: 'invoice', label: 'Invoice', id: '5' },
];

/* const sortOptions = [
  {
    value: 'updatedAt|desc',
    label: 'Last update (newest first)'
  },
  {
    value: 'updatedAt|asc',
    label: 'Last update (oldest first)'
  },
  {
    value: 'createdAt|desc',
    label: 'Creation date (newest first)'
  },
  {
    value: 'createdAt|asc',
    label: 'Creation date (oldest first)'
  }
]; */

// 3.CSS
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  card: {
    margin: 5
  }
}));

//let renderCount = 0;


// 5.Render Function
const MainResults: FC<MainResultsProps> = ({ className, ...rest }) => {

  //renderCount++;
  //console.log('MainResults Render...' + renderCount);

  // State Hooks
  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState<string>('order');
  const [toggle, setToggle] = useState<boolean>(false);
  const [openOrderEdit, setOpenOrderEdit] = useState<boolean>(false);
  const [salesOrder, setSalesOrder] = useState<any>(null);
  const [shipment, setShipment] = useState<any>(null);
  const [openShipmentEdit, setOpenShipmentEdit] = useState<boolean>(false);
  const { getOrders } = useFilters();

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  const OpenOrderEdit = (event: React.MouseEvent<unknown>, orderNo: string) => {
    // New sales order has below default values
    if (orderNo == null) {
      axios2.get(`/so/soSeq`).then((response) => {
        console.log('SOSeq', response);
        setSalesOrder({
          no: response.data.No,
          orderStatus: 'Draft',
          salesRep: 'CS',
          orderClass: 'B',
          paymentTerm: 'Net',
          freightTerm: 'Prepaid',
          lots: [],

          customerNo: '',
          customerPO: '',
          billTo: {},
          shipTo: [],
          //paymentMethod: '',
        });
        setOpenOrderEdit(true);
      });
    }
    else {
      axios2.get(`/so/${orderNo}`).then((response) => {
        setSalesOrder({
          no: response.data.no,
          orderedAt: response.data.orderedAt,
          orderStatus: response.data.orderStatus ?? "Draft",
          customerNo: response.data.customerNo,
          billTo: response.data.billTo,
          shipTo: response.data.shipTo,
          salesRep: response.data.salesRep,
          orderClass: response.data.orderClass,
          paymentTerm: response.data.paymentTerm,
          freightTerm: response.data.freightTerm,
          discountPayIn: response.data.discountPayIn,
          estDeliveryAt: response.data.estDeliveryAt,
          discountPercentage: response.data.discountPercentage,
          customerPO: response.data.customerPO ?? '',
          releaseNumber: response.data.releaseNumber ?? '',
          termsAndCondition: response.data.termsAndCondition ?? '',
          internalMemo: response.data.internalMemo ?? '',
          tags: response.data.tags,
          lots: response.data.lots?.map(u => {
            return {
              id: u.id,
              product: u.product,

              categoryId: u.categoryId,
              categoryNo: u.categoryNo,

              specId: u.specId,
              specNo: u.specNo,

              attributeId: u.attributeId,
              attributeNo: u.attributeNo,

              qty: u.qty,
              qtyUnit: u.qtyUnit,
              unitPrice: u.unitPrice,
              weight: u.weight,
              amount: u.amount,

              allocations: u.allocations.map(allocation => {
                return {
                  id: allocation.id,
                  source: allocation.source,
                  relatedOrder: allocation.relatedOrder,
                  fromSite: allocation.fromSite,
                  weight: allocation.weight,
                }
              }),
            };
          }),
        });
        setOpenOrderEdit(true);
      });
    }
    event.stopPropagation();
  };

  const OpenShipmentEdit = (event: React.MouseEvent<unknown>, shipmentNo: string) => {
    console.log('OpenShipmentEdit', shipmentNo);

    if (shipmentNo == null) {
    } else {
      axios2.get(`/sh/${shipmentNo}`).then((response) => {
        var shipment = response.data as Shipment;
        console.log(`/sh/${shipmentNo}`, shipment);
        setShipment(shipment);
        setOpenShipmentEdit(true);
      });
    }
    event.stopPropagation();
  };

  const handleCloseShipmentEdit = (): void => {
    setOpenShipmentEdit(false);
    getOrders();
  };

  const handleCloseOrderEdit = (): void => {
    getOrders();
    setOpenOrderEdit(false);
  };

  const unToggleFulfillment = (event: React.MouseEvent): void => {
    setToggle(false);
  };

  const handleToggleFulfillment = (event: React.MouseEvent): void => {
    setToggle(true)
    event.stopPropagation();
  };

  // const selectedSomeOrders = selectedOrders.length > 0 && selectedOrders.length < paginatedOrders.length;
  // const allOrderSelected = selectedOrders.length === paginatedOrders.length;
  const enableFulfillment = toggle

  return (
    <div
      className={clsx(classes.root, className)}
      onClick={unToggleFulfillment}
      style={{ minWidth: 1920 }}
      {...rest}
    >
      <Card className={classes.card}>
        <Box>
          <MainHeader
            // handleQueryChange={handleQueryChange}
            OpenOrderEdit={OpenOrderEdit}
          />
        </Box>
      </Card>

      <Grid container >
        <Grid item xs={3} style={{ padding: 5 }}>
          <Card>
            <OrderTable
              handleToggleFulfillment={handleToggleFulfillment}
              getStatusLabel={getStatusLabel}
              OpenOrderEdit={OpenOrderEdit}
            />
          </Card>
        </Grid>
        <Grid item xs={9} style={{ padding: 5 }}>
          <Card >
            <Box>
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
            </Box>
            <Divider />
            {currentTab === 'order' &&
              <LotTable
                OpenOrderEdit={OpenOrderEdit}
                currentTab={currentTab}
              />}
            {currentTab === 'allocation' &&
              <AllocationTable
                OpenOrderEdit={OpenOrderEdit}
                OpenShipmentEdit={OpenShipmentEdit}
                handleCloseShipmentEdit={handleCloseShipmentEdit}
              />}
            {currentTab === 'shipment' &&
              <ShipmentTable
                OpenOrderEdit={OpenOrderEdit}
                OpenShipmentEdit={OpenShipmentEdit}
                handleCloseShipmentEdit={handleCloseShipmentEdit}
              />}
            {currentTab === 'assignedItem' &&
              <AssignedItemTable
                OpenOrderEdit={OpenOrderEdit}
                OpenShipmentEdit={OpenShipmentEdit}
              />}
            {currentTab === 'invoice' &&
              <InvoiceTable
                OpenOrderEdit={OpenOrderEdit}
              />}
          </Card>
        </Grid>
      </Grid>

      <Fulfillment
        open={enableFulfillment}
      />

      <OrderEditResult
        open={openOrderEdit}
        handleCloseOrderEdit={handleCloseOrderEdit}
        salesOrder={salesOrder}
        OpenOrderEdit={OpenOrderEdit}
      />

      {shipment &&
        <ShipmentDialog
          open={openShipmentEdit}
          handleCloseShipmentEdit={handleCloseShipmentEdit}
          shipment={shipment}
          OpenShipmentEdit={OpenShipmentEdit}
          OpenOrderEdit={OpenOrderEdit}
          handleDialog1Close={handleCloseShipmentEdit}
        />
      }
    </div>
  );
};

MainResults.propTypes = {
  className: PropTypes.string,
};

export default MainResults;