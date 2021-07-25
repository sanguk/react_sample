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
  Tooltip,
  Typography,
  makeStyles,
  Button,
  colors
} from '@material-ui/core';
import numeral from 'numeral';
import type { Shipment, ShipmentTableType,  Filters } from 'src/types/simpleorder';
import useFilters from '../useFilters';
import axios2 from 'src/utils/axios2';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import ShipmentDialog from 'src/views/dev/SalesOrder/ShipmentEdit/Dev/ShipmentDialog';
import moment from 'moment';
import ShipmentFulfillmentCard from '../Card/ShipmentFulfillmentCard';
import ShipmentBulkOperation from '../BulkOperation/ShipmentBulkOperation'
import ItemAssignDialog from 'src/views/dev/SalesOrder/Main/Dialog/ItemAssignDialog';

interface ShipmentTableProps {
  className?: string;
  //selectedLots: string[];
  //paginatedLots: Lot[];
  //// selectedOrders: string[];
  //handleLotClick: (event: React.MouseEvent<unknown>, name: string) => void
  //// getStatusLabel: (paymentStatus: OrderStatus) => JSX.Element
  OpenOrderEdit: (event: React.MouseEvent<unknown>, orderNo: string) => void
  OpenShipmentEdit: (event: React.MouseEvent<unknown>, shipmentNo: string) => void;
  handleCloseShipmentEdit: () => void;
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

const applyFiltersShipment = (shipments: ShipmentTableType[], filters: Filters): ShipmentTableType[] => {
  return shipments.filter((shipment) => {
    let matches = true;
    if (filters.orderNo.length !== 0 && !filters.orderNo.includes(shipment.soNo)) {
      matches = false;
    }
    return matches;
  });
};

const applyPaginationShipments = (shipments: ShipmentTableType[], page: number, limit: number) => {
  return shipments.slice(page * limit, page * limit + limit);
}

const ShipmentTable: FC<ShipmentTableProps> = ({
  OpenOrderEdit,
  OpenShipmentEdit,
  //handleLotClick,
  //selectedLots,
  //handleToggleFulfillment,
  //paginatedLots
}) => {

  const classes = useStyles();
  const { currentFilters, orders, shipments, getOrders } = useFilters();
  //const [selectedLots, setSelectedLots] = useState<string[]>([]);
  //const [shipments, setShipments] = useState<Shipment[]>([]);
  //const [shippable, setShippable] = useState<number>(0);
  //const [invoiceable, setInvoiceable] = useState<number>(0);
  //const filteredOrders1 = applyFiltersOrders(filteredOrders, currentFilters);

  const [openItemAssignDialog, setOpenItemAssignDialog] = useState<boolean>(false);
  const [selectedShipmentTables, setSelectedShipmentTables] = useState<ShipmentTableType[]>([]);

  const isMountedRef = useIsMountedRef('ShipmentTable');

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(25);

  //const getShipments = useCallback(async () => {
  //  try {
  //    const response = await axios2.post<Shipment[]>('/sh/list', orders.map(a => a.no));
  //    console.log('/shipments response', response);
  //    if (isMountedRef.current) {
  //      setShipments(response.data);
  //    }
  //    else {
  //      debugger;
  //    }
  //  } catch (err) {
  //    console.error(err);
  //  }
  //}, [isMountedRef, orders]);

  //useEffect(() => {
  //  getShipments();
  //}, [getShipments]);

  //console.log('filteredOrders', filteredOrders);

  const handleLineItemClick = (event: React.MouseEvent<unknown>, lot: ShipmentTableType): void => {
    if (!selectedShipmentTables.map(shipmentTable => shipmentTable.id).includes(lot.id)) {
      setSelectedShipmentTables((prevSelected) => [...prevSelected, lot]);
    } else {
      setSelectedShipmentTables((prevSelected) => prevSelected.filter((a) => a.id !== lot.id));
    }
  };
  console.log('selectedLots', selectedShipmentTables);

  const enableBulkOperations = selectedShipmentTables.length > 0;
  const handleClearSelectedLineItems = (): void => {
    setSelectedShipmentTables([]);
  };

  
  const handleOpenAssignItem = (event: React.MouseEvent<unknown>) => {
    console.log('handleOpenAssignItem' + selectedShipmentTables.length);

    setOpenItemAssignDialog(true);

    event.stopPropagation();
  };

  const handleCloseAssignItem = (event: React.MouseEvent<unknown>) => {
    console.log('handleCloseAssignItem' + selectedShipmentTables.length);

    setOpenItemAssignDialog(false);

    //getShipments();
    getOrders();

    event.stopPropagation();
  };

  const handleShipmentPageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleShipmentLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredShipments = applyFiltersShipment(shipments, currentFilters);
  const paginatedShipmentTables = applyPaginationShipments(filteredShipments, page, limit);

  return (
    <div>
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small" className={classes.cell}>
          <TableHead>
            <TableRow>
              <TableCell align="center">Shipment</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Transportation</TableCell>
              <TableCell align="center">Vendor</TableCell>
              <TableCell align="center">Freight ($)</TableCell>
              <TableCell align="center">From</TableCell>
              <TableCell align="center">To</TableCell>
              <TableCell align="center">ETA</TableCell>
              <TableCell align="center">ETD</TableCell>
              <TableCell align="center">Release No</TableCell>
              <TableCell align="center">Weight (lb)</TableCell>
              <TableCell align="center">Fulfillment</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedShipmentTables.map((shipmentTable) => {
              const isSelected = selectedShipmentTables.includes(shipmentTable);

              return (
                <TableRow
                  key={shipmentTable.id}
                  onClick={(event) => handleLineItemClick(event, shipmentTable)}
                  tabIndex={-1}
                  role="checkbox"
                  selected={isSelected}
                >
                  <TableCell align="center">
                    <Button
                      color='primary'
                      size="small"
                      onClick={(event) => OpenShipmentEdit(event, shipmentTable.shNo)} >
                      <Typography variant="caption" color="textPrimary" style={{ textDecoration: 'underline', fontWeight: 'lighter' }}>
                        {shipmentTable.shNo}
                      </Typography>
                    </Button>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="caption" color="textSecondary"
                      style={
                        shipmentTable.orderStatus === 'Draft' ? { color: colors.orange['600'] }
                          : shipmentTable.orderStatus === 'Open' ? { color: colors.deepPurple['300'] }
                            : shipmentTable.orderStatus === 'Canceled' ? { color: colors.red['600'] }
                              : shipmentTable.orderStatus === 'Completed' ? { color: colors.green['600'] }
                                : { color: colors.orange['600'] }
                      }>
                      {shipmentTable.orderStatus}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="textSecondary">
                      {shipmentTable.transportType}
                    </Typography>
                  </TableCell>
                  <TableCell style={{ maxWidth: 150, textOverflow: "ellipsis", overflow: "hidden" }}>
                    <Typography variant="caption" color="textSecondary" noWrap>
                      {shipmentTable.vendor}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="caption" color="textSecondary">
                      {numeral(shipmentTable.freightRate).format('0,0')}
                    </Typography>
                  </TableCell>
                  <Tooltip
                    arrow
                    placement="top"
                    title={shipmentTable.siteDescription ?? ''}
                  >
                    <TableCell align="center">
                      <Typography variant="caption" color="textSecondary">
                        {shipmentTable.fromSite}
                      </Typography>
                    </TableCell>
                  </Tooltip>
                  <TableCell align="center">
                    <Typography variant="caption" color="textSecondary">
                      {shipmentTable.toSite}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="caption" color="textSecondary">
                      {moment(shipmentTable.eta).format('MM/DD/yyyy')}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="caption" color="textSecondary">
                      {moment(shipmentTable.etd).format('MM/DD/yyyy')}
                    </Typography>
                  </TableCell>


                  <TableCell >
                    <Typography variant="caption" color="textSecondary">
                      {shipmentTable.releaseNo}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="caption" color="textSecondary">
                      {numeral(shipmentTable.weight).format(`0,00`)}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <ShipmentFulfillmentCard shipmentTable={shipmentTable} />
                  </TableCell>
                  {/* <TableCell >
                          <IconButton size="small"
                          >
                            <SvgIcon fontSize="small">
                              <ArrowRightIcon />
                            </SvgIcon>
                          </IconButton>
                        </TableCell> */}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={shipments.length}
        onChangePage={handleShipmentPageChange}
        onChangeRowsPerPage={handleShipmentLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[25, 50, 100]}
      />

      <ShipmentBulkOperation
        open={enableBulkOperations}
        selectedLineItems={selectedShipmentTables.map(lot => lot.id)}
        handleActionItem1Click={handleOpenAssignItem}
        handleClearSelectedLineItems={handleClearSelectedLineItems}
        shippable={9999}
      />

      {openItemAssignDialog &&
        <ItemAssignDialog
          open={openItemAssignDialog}
          onClose={handleCloseAssignItem}
          shipmentTables={selectedShipmentTables}
           OpenOrderEdit={OpenOrderEdit}
        />
      }
    </div>
  )
};

ShipmentTable.propTypes = {
  //handleLotClick: PropTypes.func,
  //  handleToggleFulfillment: PropTypes.func
};

export default ShipmentTable;
