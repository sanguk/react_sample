import React, { useCallback, useState, useEffect } from 'react';
import type { FC, ChangeEvent } from 'react';
import {
  //IconButton,
  //SvgIcon,
  Table,
  TableBody,
  TableHead,
  TableContainer,
  TablePagination,
  TableCell,
  TableRow,
  //Tooltip,
  Typography,
  makeStyles,
  Button,
  colors
} from '@material-ui/core';
//import numeral from 'numeral';
import type { Filters, Order, InvoiceTableType, InvoiceItem } from 'src/types/simpleorder';
import useFilters from '../useFilters';
import axios2 from 'src/utils/axios2';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import InvoiceDialog from '../../InvoiceEdit/InvoiceDialog';
//import moment from 'moment';
//import InvoiceFulfillmentCard from '../Card/InvoiceFulfillmentCard';
import InvoiceBulkOperation from '../BulkOperation/InvoiceBulkOperation'

interface InvoiceTableProps {
  className?: string;
  //selectedLots: string[];
  //paginatedLots: Lot[];
  //// selectedOrders: string[];
  //handleLotClick: (event: React.MouseEvent<unknown>, name: string) => void
  //// getStatusLabel: (paymentStatus: OrderStatus) => JSX.Element
  OpenOrderEdit: (event: React.MouseEvent<unknown>, orderNo: string) => void
}

const useStyles = makeStyles(() => ({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
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

//interface LotBodyProps {
//  lot: Lot,
//  isLotSelected: boolean
//  selectedLots: string[];
//};

//const applyFiltersOrders = (orders: Order[], filters: Filters): Order[] => {
//  //console.log(orders);
//  return orders.filter((order) => {
//    let matches = true;

//    if (filters.orderNo.length !== 0 && !filters.orderNo.includes(order.no)) {
//      matches = false;
//    }

//    return matches;
//  });
//};

const applyFiltersInvoice = (invoices: InvoiceTableType[], filters: Filters): InvoiceTableType[] => {
  return invoices.filter((invoice) => {
    let matches = true;
    if (filters.orderNo.length !== 0 && !filters.orderNo.includes(invoice.soNo)) {
      matches = false;
    }
    return matches;
  });
};

const applyPaginationInvoices = (invoices: InvoiceTableType[], page: number, limit: number) => {
  return invoices.slice(page * limit, page * limit + limit);
};

const InvoiceTable: FC<InvoiceTableProps> = ({
  OpenOrderEdit,
  //handleLotClick,
  //selectedLots,
  //handleToggleFulfillment,
  //paginatedLots
}) => {

  const classes = useStyles();
  const { currentFilters, orders, invoices, getOrders } = useFilters();
  //const [selectedLots, setSelectedLots] = useState<string[]>([]);
  //const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoice, setInvoice] = useState<any>(null);
  const [openInvoiceEdit, setOpenInvoiceEdit] = useState<boolean>(false);
  //const [shippable, setShippable] = useState<number>(0);
  //const [invoiceable, setInvoiceable] = useState<number>(0);
  //const filteredOrders1 = applyFiltersOrders(filteredOrders, currentFilters);
  const isMountedRef = useIsMountedRef('InvoiceTable');

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(25);
  const [selectedLineItems, setSelectedLineItems] = useState<string[]>([]);

  //const getInvoices = useCallback(async () => {
  //  try {
  //    const response = await axios2.post('/si/list', {
  //      SONos: orders.map(a => a.no)
  //    });
  //    console.log('/invoices response', response);
  //    if (isMountedRef.current) {
  //      setInvoices(response.data as Invoice[]);
  //    }
  //    else {
  //      debugger;
  //    }
  //  } catch (err) {
  //    console.error(err);
  //  }
  //}, [isMountedRef, orders]);

  //useEffect(() => {
  //  getInvoices();
  //}, [getInvoices]);

  //console.log('filteredOrders', filteredOrders);

  const handleLineItemClick = (event: React.MouseEvent<unknown>, lot: InvoiceTableType): void => {
    if (!selectedLineItems.includes(lot.id)) {
      setSelectedLineItems((prevSelected) => [...prevSelected, lot.id]);
    } else {
      setSelectedLineItems((prevSelected) => prevSelected.filter((a) => a !== lot.id));
    }
  };
  console.log('selectedLineItems', selectedLineItems);

  const enableBulkOperations = selectedLineItems.length > 0;
  const handleClearSelectedLineItems = (): void => {
    setSelectedLineItems([]);
  };

  const handleOpenInvoiceEdit = (event: React.MouseEvent<unknown>, invoiceNo: string) => {
    // New sales order has below default values
    if (invoiceNo == null) {
      //axios2.post(`/sh/draft`, selectedLineItems).then((response) => {
      //  console.log(`/InvoiceDraft`, response);
      //  setInvoice(response.data as InvoiceUseFormMethods);
      //  setOpenInvoiceEdit(true);
      //});
    }
    else {
      axios2.get(`/si/draft/${invoiceNo}`).then((response) => {
        setInvoice(response.data as any);
        setOpenInvoiceEdit(true);
      });
    }
    event.stopPropagation();
  };

  // Invoice Edit Dialog Functions
  const handleCloseInvoiceEdit = (): void => {
    setOpenInvoiceEdit(false);
    //getInvoices();
    getOrders();
  };

  const handleOpenAssignItem = (event: React.MouseEvent<unknown>) => {
    alert('handleOpenAssignItem Open-ItemAssignDialog' + selectedLineItems.length);
    event.stopPropagation();
  };

  const handleInvoicePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleInvoiceLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  //const LotBody = (lotid: string, lot: Lot, isLotSelected: boolean): JSX.Element => {
  //  return (
  //  )
  //}

  const filteredInvoices = applyFiltersInvoice(invoices, currentFilters);
  const paginatedInvoiceTables = applyPaginationInvoices(filteredInvoices, page, limit);

  return (
    <div>
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small" className={classes.cell}>
          <TableHead>
            <TableRow>
              <TableCell align="center">Invoice</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">SO</TableCell>
              <TableCell align="center">Reference</TableCell>
              <TableCell align="center">Customer</TableCell>
              <TableCell align="center">Customer PO</TableCell>
              <TableCell align="center">Sales Rep</TableCell>
              <TableCell align="center">Class</TableCell>
              <TableCell align="center">Product</TableCell>
              <TableCell align="center">Spec</TableCell>
              <TableCell align="center">Attribute</TableCell>
              <TableCell align="center">Weight</TableCell>
              <TableCell align="center">Qty</TableCell>
              <TableCell align="center">Unit</TableCell>
              <TableCell align="center">Length</TableCell>
              <TableCell align="center">Amount</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedInvoiceTables.map((invoice) => {
              const isSelected = selectedLineItems.includes(invoice.id);

              return (
                <TableRow
                  key={invoice.id + invoice.id}
                  onClick={(event) => handleLineItemClick(event, invoice)}
                  tabIndex={-1}
                  role="checkbox"
                  selected={isSelected}
                >
                  <TableCell align="center">
                    <Button
                      color='primary'
                      size="small"
                      onClick={(event) => handleOpenInvoiceEdit(event, invoice.invoiceNo)} >
                      <Typography variant="caption" color="textPrimary" noWrap style={{ textDecoration: 'underline', fontWeight: 'lighter' }}>
                        {invoice.invoiceNo}
                      </Typography>
                    </Button>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="caption" color="textSecondary"
                      style={
                        invoice.status === 'Draft' ? { color: colors.orange['600'] }
                          : invoice.status === 'Open' ? { color: colors.deepPurple['300'] }
                            : invoice.status === 'Canceled' ? { color: colors.red['600'] }
                              : invoice.status === 'Completed' ? { color: colors.green['600'] }
                                : { color: colors.orange['600'] }
                      }>
                      {invoice.status}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      color="primary"
                      size="small"
                      onClick={(event) => OpenOrderEdit(event, invoice.soNo)}>
                      <Typography variant="caption" color="textPrimary" style={{ textDecoration: 'underline', fontWeight: 'lighter' }} noWrap>
                        {invoice.soNo}
                      </Typography>
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="caption" color="textSecondary">
                      {invoice.reference}
                    </Typography>
                  </TableCell>
                  <TableCell style={{ maxWidth: 150, textOverflow: "ellipsis", overflow: "hidden" }}>
                    <Typography variant="caption" color="textSecondary" noWrap>
                      {invoice.customerNo}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="textSecondary">
                      {invoice.customerPO}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="caption" color="textSecondary" noWrap>
                      {invoice.salesRep}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="caption" color="textSecondary">
                      {invoice.class}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="textSecondary" noWrap>
                      {invoice.categoryNo}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="textSecondary" noWrap>
                      {invoice.specNo}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="textSecondary" noWrap>
                      {invoice.attributeNo}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Typography variant="caption" color="textSecondary">
                      {invoice.weight}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="caption" color="textSecondary">
                      {invoice.qty}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="caption" color="textSecondary">
                      {invoice.qtyUnit}
                    </Typography>
                    {/*<InvoiceFulfillmentCard invoiceLot={lot} />*/}
                  </TableCell>
                  {/* <TableCell >
                          <IconButton size="small"
                          >
                            <SvgIcon fontSize="small">
                              <ArrowRightIcon />
                            </SvgIcon>
                          </IconButton>
                        </TableCell> */}

                  <TableCell align="right">
                    <Typography variant="caption" color="textSecondary">
                      {invoice.length}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Typography variant="caption" color="textSecondary">
                      {invoice.amount}
                    </Typography>
                  </TableCell>

                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={invoices.length}
        onChangePage={handleInvoicePageChange}
        onChangeRowsPerPage={handleInvoiceLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[25, 50, 100]}
      />

      <InvoiceBulkOperation
        open={enableBulkOperations}
        selectedLineItems={selectedLineItems}
        handleActionItem1Click={handleOpenAssignItem}
        handleClearSelectedLineItems={handleClearSelectedLineItems}
        shippable={9999}
      />

      {invoice &&
        <InvoiceDialog
          open={openInvoiceEdit}
          handleDialog1Close={handleCloseInvoiceEdit}
          invoice={invoice}
          OpenOrderEdit={OpenOrderEdit}

        //selectedLineItems={selectedLineItems}
        //allocaions={allocaions}
        />
      }
    </div>
  )
};

InvoiceTable.propTypes = {
  //handleLotClick: PropTypes.func,
  //  handleToggleFulfillment: PropTypes.func
};

export default InvoiceTable;
