import React, { useCallback, useEffect, useState, createContext, ReactNode, SetStateAction } from 'react';
import type { FC, ChangeEvent } from 'react';

import * as signalR from "@microsoft/signalr";

import axios2 from 'src/utils/axios2';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import _ from 'lodash';

import type { Order, Lot, Allocation, Filters, Shipment, ShipmentTableType, InvoiceTableType, AssignedItem } from 'src/types/simpleorder';
import { current } from '@reduxjs/toolkit';

export interface FiltersContextValue {
  currentFilters: Filters;
  orders: Order[];
  filteredOrders: Order[];
  lots: Lot[];
  allocations: Allocation[];
  shipments: ShipmentTableType[];
  invoices: InvoiceTableType[];
  assignedItems: AssignedItem[];
  //orderPage: number;
  //setOrderPage: React.Dispatch<SetStateAction<number>>;
  //orderLimit: number;
  //setOrderLimit: React.Dispatch<SetStateAction<number>>;
  //orderTotal: number;
  // selectedOrders: string[];
  handleAutocomplete: (event: React.ChangeEvent<{}>, newValue: string[], id: string) => void;
  handleCheckbox: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClear: (event: React.MouseEvent<unknown>) => void;
  handleClearOrderNo: (event: React.MouseEvent<unknown>) => void;
  handleSelect: (orderNo: string, id: string) => void;
  getOrders: () => void;
  //applyFilterOrder: (lots: Lot[], filters: Filters) => void;
  //applyPaginationOrder: (lots: Lot[], page: number, limit: number) => void;
  //handleOrderPageChange: (event: any, newPage: number) => void;
  //handleOrderLimitChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface FiltersProviderProps {
  children?: ReactNode;
}

const defaultFilters: Filters = {
  status: [],
  availability: null,
  inStock: null,
  isShippable: null,
  customer: [],
  orderNo: [],
  salesRep: [],
  orderClass: [],
  checkList: [],
  tag: [],
  product: [],
};

const FiltersContext = createContext<FiltersContextValue>({
  currentFilters: defaultFilters,
  orders: null,
  filteredOrders: null,
  lots: null,
  allocations: null,
  shipments: null,
  invoices: null,
  assignedItems: null,
  //orderPage: 0,
  //setOrderPage: null,
  //orderLimit: 25,
  //setOrderLimit: null,
  //orderTotal: 0,


  // selectedOrders: null,
  handleAutocomplete: () => { },
  handleCheckbox: () => { },
  handleClearOrderNo: () => { },
  handleClear: () => { },
  handleSelect: () => { },
  getOrders: () => { },
  //applyFilterOrder: () => { },
  //applyPaginationOrder: () => { },
  //handleOrderPageChange: () => { },
  //handleOrderLimitChange: () => { },
});

export const FiltersProvider: FC<FiltersProviderProps> = ({ children }) => {

  const isMountedRef = useIsMountedRef();
  const [currentFilters, setCurrentFilters] = useState<Filters>(defaultFilters);

  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  const [lots, setLots] = useState<Lot[]>([]);

  const [allocations, setAllocations] = useState<Allocation[]>([]);

  const [shipments, setShipments] = useState<ShipmentTableType[]>([]); // ShipmentTable
  //const [filteredShipment, setFilteredShipment] = useState<Shipment[]>([]);

  const [invoices, setInvoices] = useState<InvoiceTableType[]>([]);
  const [assignedItems, setAssignedItems] = useState<AssignedItem[]>([]);

  const [connection, setConnection] = useState<any>(null);

  //const [orderPage, setOrderPage] = useState<number>(0);
  //const [orderLimit, setOrderLimit] = useState<number>(25);
  //const [orderTotal, setOrderTotal] = useState<number>(0);
  //const [allocationPages, setAllocationPages] = useState<number>(0);
  //const [shipmentPages, setShipmentPages] = useState<number>(0);
  //const [itemPages, setItemPages] = useState<number>(0);
  //const [invoicePages, setInvoicePages] = useState<number>(0);
  //const [allocationLimits, setAllocationLimits] = useState<number>(25);
  //const [shipmentLimits, setShipmentLimits] = useState<number>(25);
  //const [itemLimits, setItemLimits] = useState<number>(25);
  //const [invoiceLimtis, setInvoiceLimits] = useState<number>(25);

  //const applyPaginationLot = (lots: Lot[], page: number, limit: number) => {
  //  return lots.slice(page * limit, page * limit + limit);
  //};

  // const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  //useEffect(() => {
  //  const connection1 = new signalR.HubConnectionBuilder()
  //    .withUrl(
  //      //"https://localhost:44324/hub"
  //      "https://localhost:44320/hub"
  //      //"https://universal-steel.service.signalr.net/hub"
  //      , {
  //        headers: { 'Access-Control-Allow-Origin': '*' },
  //        skipNegotiation: true,
  //        transport: signalR.HttpTransportType.WebSockets,
  //        //accessTokenFactory: () => "TeKtuxRKnqDwBl6lozrOeIJTrDM5IE/FC2WE5psLo0I="
  //      }
  //    )
  //    .withAutomaticReconnect()
  //    .build();

  //  connection1.on("ReceiveMessage", function (user, message) {
  //    console.log(`ReceiveMessage ${user} ${message}`);
  //  });

  //  connection1.start().catch(err => console.error(err.toString()))
  //    .then(() => {
  //      connection1.send("SendMessage", 'sam', 'value1').then(() => console.log('SendMessage then'));
  //    });
  //  ;
  //  //connection.invoke('JoinGroup', 'ClientAccountTransaction').catch(err => console.error(err.toString()));

  //  setConnection(connection1);

  //}, [setConnection]);
  

  const getOrders = useCallback(async () => {
    try {
      // console.log('currentFilters', currentFilters);
      // console.log('currentFilters orderPage', orderPage);
      // console.log('currentFilters orderLimit', orderLimit);
      // console.log('currentFilters orderTotal', orderTotal);

      //var requestData = {
      //  status: currentFilters.status ?? [],
      //  customers: currentFilters.customer ?? [],
      //  sonos: currentFilters.orderNo ?? [],
      //  products: currentFilters.product ?? [],
      //  Tags: currentFilters.tag ?? [],
      //  salesReps: currentFilters.salesRep ?? [],
      //  backToBack: currentFilters.isShippable ?? false,
      //  stock: currentFilters.inStock ?? false,
      //  //pageNo: orderPage + 1,
      //  //pageCount: orderLimit ?? ''
      //};

      // console.log('requestData', requestData);

      const response = await axios2.post<Order[]>('/so/list');
      // console.log('FiltersProvider /so/list', response);
      var sos = response.data['sos'];
      var soLots = response.data['soLots'];
      var allocations = response.data['allocations'];
      var shs = response.data['shs'];
      var sis = response.data['sis'];
      var assignedItems = response.data['assignedItems'];
      if (isMountedRef.current) {
        setOrders(sos);
        setFilteredOrders(applyFiltersOrder(sos, currentFilters))
        setLots(soLots);
        setAllocations(allocations);
        setShipments(shs);
        setInvoices(sis);
        setAssignedItems(assignedItems);
        //setOrderTotal(response.data['totalCount']);
      }
      else {
        debugger;
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  //useEffect(() => {
  //  console.log('useEffect currentFilters')
  //}, [currentFilters, setCurrentFilters]);

  //useEffect(() => {
  //  console.log('FilterContext orderPage', orderPage);
  //  getOrders();
  //}, [orderPage]);

  const handleAutocomplete = (event: React.ChangeEvent<{}>, newValue: string[], id: string): void => {
    console.log('filterContext handleAutocomplete', newValue, id);
    var _filters = currentFilters;
    var column = id
    _filters[column] = newValue;
    setCurrentFilters(_filters)
    setFilteredOrders(applyFiltersOrder(orders, _filters))
    // getOrders();
  };

  const handleCheckbox = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();

    var _filters = currentFilters;
    var column = event.target.name;

    if (!_filters[column].includes(event.target.value)) {
      _filters[column] = [..._filters[column], event.target.value]
    } else {
      _filters[column] = (_filters[column].filter((id: string) => id !== event.target.value))
    }
    setCurrentFilters(_filters)
    setFilteredOrders(applyFiltersOrder(orders, _filters))
    // getOrders();
  };

  const handleSelect = (orderNo: string, name: string): void => {

    var _filters = currentFilters;
    var column = name;

    if (!_filters[column].includes(orderNo)) {
      _filters[column] = [..._filters[column], orderNo]
    } else {
      _filters[column] = (_filters[column].filter((id: string) => id !== orderNo))
    }
    setCurrentFilters(_filters);
    setFilteredOrders(applyFiltersOrder(orders, _filters));
    //getOrders();
  };

  const handleClear = (event: React.MouseEvent<unknown>): void => {
    console.log('filterContext handleClear');

    //connection.send("SendMessage", 'sam2', 'value2')
      //.then(() => console.log('SendMessage then'));

    var filter = {
      status: [],
      availability: null,
      inStock: null,
      isShippable: null,
      customer: [],
      orderNo: currentFilters.orderNo,// orderNo´Â ³ÀµÖ¾ß ÇÔ
      salesRep: [],
      orderClass: [],
      checkList: [],
      tag: [],
      product: [],
    };

    setCurrentFilters(filter);
    setFilteredOrders(applyFiltersOrder(orders, filter));
  }

  const handleClearOrderNo = (event: React.MouseEvent<unknown>): void => {
    console.log('handleClearOrderNo');
    var filter = {
      status: currentFilters.status,
      availability: currentFilters.availability,
      inStock: currentFilters.inStock,
      isShippable: currentFilters.isShippable,
      customer: currentFilters.customer,
      orderNo: [],
      salesRep: currentFilters.salesRep,
      orderClass: currentFilters.orderClass,
      checkList: currentFilters.checkList,
      tag: currentFilters.tag,
      product: currentFilters.product,
    };

    setCurrentFilters(filter);
    setFilteredOrders(applyFiltersOrder(orders, filter));
  }

  const applyFiltersOrder = (orders: Order[], _filters: Filters): Order[] => {
    return orders.filter((order) => {
      //console.log('applyFiltersOrder _filters', _filters)
      let matches = true;
      if (_filters.status.length !== 0 && !_filters.status.includes(order.orderStatus)) {
        matches = false;
      }
      if (_filters.salesRep.length !== 0 && !_filters.salesRep.includes(order.salesRep)) {
        matches = false;
      }
      if (_filters.customer.length !== 0 && !_filters.customer.includes(order.customerNo)) {
        matches = false;
      }
      if (_filters.orderClass.length !== 0 && !_filters.orderClass.includes(order.orderClass)) {
        matches = false;
      }
      if (_filters.checkList.length !== 0 && !order.checkList.filter(list => _filters.checkList.includes(list))) {
        matches = false;
      }
      if (_filters.tag.length !== 0 && order.tags.filter(list => _filters.tag.includes(list)).length == 0) {
        matches = false;
      }

      // if (query && !order.customerNo.toLowerCase().includes(query.toLowerCase())) {
      //   matches = false;
      // }

      return matches;

    });
  };
  

  return (
    <FiltersContext.Provider
      value={{
        currentFilters: currentFilters,
        orders: orders,
        filteredOrders: filteredOrders,
        lots: lots,
        allocations: allocations,
        shipments: shipments,
        invoices: invoices,
        assignedItems: assignedItems,

        //orderPage: orderPage,
        //setOrderPage: setOrderPage,
        //orderLimit: orderLimit,
        //setOrderLimit: setOrderLimit,
        //orderTotal: orderTotal,

        //selectedOrders: selectedOrders,
        handleAutocomplete: handleAutocomplete,
        handleCheckbox: handleCheckbox,
        handleClear: handleClear,
        handleClearOrderNo: handleClearOrderNo,
        handleSelect: handleSelect,
        getOrders: getOrders,

        //applyFilterOrder: applyFilterOrder,
        //applyPaginationOrder: applyPaginationOrder,
        //handleOrderPageChange: handleOrderPageChange,
        //handleOrderLimitChange: handleOrderLimitChange
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};

export const FiltersConsumer = FiltersContext.Consumer;

export default FiltersContext;