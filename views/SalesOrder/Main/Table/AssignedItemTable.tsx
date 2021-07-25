import React, { useState, useCallback, useEffect } from 'react';
import type { FC, ChangeEvent } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableContainer,
  TablePagination,
  TableCell,
  TableRow,
  Typography,
  Tooltip,
  makeStyles,
  Button,
} from '@material-ui/core';
import type { Order, Filters, Lot, OrderStatus, Allocation, Shipment, Inventory, AssignedItem } from 'src/types/simpleorder';
import useFilters from '../useFilters';
import axios2 from 'src/utils/axios2';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import ShipmentDialog from 'src/views/dev/SalesOrder/ShipmentEdit/Dev/ShipmentDialog';
import moment from 'moment';
import AssignedItemBulkOperation from '../BulkOperation/AssignedItemBulkOperation';
import InvoiceDialog from 'src/views/dev/SalesOrder/InvoiceEdit/InvoiceDialog';

interface AssignedItemTableProps {
  className?: string;
  OpenOrderEdit: (event: React.MouseEvent<unknown>, orderNo: string) => void
  OpenShipmentEdit: (event: React.MouseEvent<unknown>, shipmentNo: string) => void;
}

const useStyles = makeStyles(() => ({
  root: {
    '& > *': {
      borderBottom: 'unset'
    }
  },
  container: {
    height: 640,
    '&::-webkit-scrollbar': {
      width: '0.5em',
    },
    '&::-webkit-scrollbar-track': {
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,0.00)',
    },
    '&:hover::-webkit-scrollbar-thumb': {
      backgroundColor: 'gray'
    }
  },
  cell: {
    '& th.MuiTableCell-sizeSmall': {
      padding: '2px 5px 2px 5px',
    },
    '& td.MuiTableCell-sizeSmall': {
      padding: 0,
    },
    '& tr.MuiTableCell-sizeSmall': {
      padding: 0,
    },
  },
}));

const applyFiltersAssignedItem = (assignedItems: AssignedItem[], filters: Filters): AssignedItem[] => {
  return assignedItems.filter((assignedItem) => {
    let matches = true;
    if (filters.orderNo.length !== 0 && !filters.orderNo.includes(assignedItem.soNo)) {
      matches = false;
    }
    return matches;
  });
};

const applyPaginationAssignedItems = (assignedItems: AssignedItem[], page: number, limit: number) => {
  return assignedItems.slice(page * limit, page * limit + limit);
}

const AssignedItemTable: FC<AssignedItemTableProps> = ({
  OpenOrderEdit,
  OpenShipmentEdit,
}) => {
  const classes = useStyles();
  const { currentFilters, orders, assignedItems, getOrders } = useFilters();
  //const filteredOrders1 = applyFiltersOrders(orders, currentFilters);

  const isMountedRef = useIsMountedRef('AssignedItemTable');
  //const [Item, setItems] = useState<Inventory[]>([]);
  //const [assignedItems, setAssingedItems] = useState<AssignedItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [invoice, setInvoice] = useState<any>(null);
  const [openInvoiceEdit, setOpenInvoiceEdit] = useState<boolean>(false);

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(25);


  //const getItems = useCallback(async () => {
  //  try {
  //    const response = await axios2.post<AssignedItem[]>('/sh/assignedItems', filteredOrders1.map(a => a.no));
  //    console.log('/sh/assignedItems', response);
  //    if (isMountedRef.current) {
  //      setAssingedItems(response.data);
  //    }
  //    else {
  //      debugger;
  //    }
  //  } catch (err) {
  //    console.error(err);
  //  }
  //}, [isMountedRef, orders]);

  //useEffect(() => {
  //  getItems();
  //}, [getItems, orders]);

  const handleLineItemClick = (event: React.MouseEvent<unknown>, item: AssignedItem): void => {
    if (!selectedItems.includes(item.id)) {
      setSelectedItems((prevSelected) => [...prevSelected, item.id]);
    } else {
      setSelectedItems((prevSelected) => prevSelected.filter((a) => a !== item.id));
    }
  };
  console.log('assignedItems', assignedItems);

  const enableBulkOperations = selectedItems.length > 0;
  const handleClearSelectedLineItems = (): void => {
    setSelectedItems([]);
  };

  // Shipment Edit Dialog Functions
  const handleCloseInvoiceEdit = (): void => {
    setOpenInvoiceEdit(false);
    //getItems();
    getOrders();
  };

  const handleOpenInvoiceEdit = (event: React.MouseEvent<unknown>): void => {
    //alert('handleOpenInvoiceEdit');
    console.log('selectedItems', selectedItems);
    axios2.post(`/si/draft`, selectedItems).then((response) => {
      console.log(`/si/draft`, response);
      setInvoice(response.data as any);
      setOpenInvoiceEdit(true);
    });
  };

  const handleAssignedItemPageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleAssignedItemLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredAssignedItems = applyFiltersAssignedItem(assignedItems, currentFilters);
  const paginatedAssignedItems = applyPaginationAssignedItems(filteredAssignedItems, page, limit);

  return (
    <div>
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small" className={classes.cell}>
          <TableHead>
            <TableRow>
              <TableCell align="center">Shipment</TableCell>
              <TableCell align="center">Item Number</TableCell>
              <TableCell align="center">Product</TableCell>
              <TableCell align="center">Spec</TableCell>
              <TableCell align="center">Attribute</TableCell>
              <TableCell align="center">From</TableCell>
              <TableCell align="center">To</TableCell>
              <TableCell align="center">Performa</TableCell>
              <TableCell align="center">Invoice</TableCell>
              <TableCell align="center">Weight (lb)</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <React.Fragment>
              {paginatedAssignedItems.map((item) => {
                const isSelected = selectedItems.includes(item.id);

                /*  {assignedItems.map((item) => {
                   console.log('assignedItems item', item);
                   const isSelected = selectedItems.includes(item.id); */

                return (
                  <TableRow
                    key={item.id}
                    onClick={(event) => handleLineItemClick(event, item)}
                    selected={isSelected}
                  >
                    <TableCell align="center">
                      <Button
                        color="primary"
                        size="small"
                        onClick={(event) => OpenShipmentEdit(event, item.shipmentNo)}
                      >
                        <Typography variant="caption" color="textPrimary" style={{ textDecoration: 'underline', fontWeight: 'lighter' }}>
                          {item.shipmentNo}
                        </Typography>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="textSecondary">
                        {item.itemNo}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="textSecondary">
                        {item.categoryNo}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="textSecondary">
                        {item.specNo}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="textSecondary">
                        {item.attributeNo}
                      </Typography>
                    </TableCell>
                    <Tooltip
                      arrow
                      placement="top"
                      title={item.siteDescription ?? ''}>
                      <TableCell>
                        <Typography variant="caption" color="textSecondary">
                          {item.from}
                        </Typography>
                      </TableCell>
                    </Tooltip>
                    <TableCell>
                      <Typography variant="caption" color="textSecondary">
                        {item.shipToCity}, {item.shipToState}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="textSecondary">
                        {item.performaNo}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="textSecondary">
                        {item.invoiceNo}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="caption" color="textSecondary">
                        {item.weight}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )
                /* })} */
              })}
            </React.Fragment>
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={assignedItems.length}
        onChangePage={handleAssignedItemPageChange}
        onChangeRowsPerPage={handleAssignedItemLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[25, 50, 100]}
      />

      <AssignedItemBulkOperation
        open={enableBulkOperations}
        selectedLineItems={selectedItems}
        handleActionItemClick={handleOpenInvoiceEdit}
        handleClearSelectedLineItems={handleClearSelectedLineItems}
        shippable={9999}
        invoiceable={1234}
      />

      { invoice && <InvoiceDialog
        open={openInvoiceEdit}
        handleDialog1Close={handleCloseInvoiceEdit}
        invoice={invoice}
        OpenOrderEdit={null}
      //selectedLineItems={selectedLineItems}
      //allocaions={allocaions}
      />}
    </div>
  );
};

export default AssignedItemTable;
