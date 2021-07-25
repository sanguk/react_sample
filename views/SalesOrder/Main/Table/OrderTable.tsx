import React, { useEffect, useState } from 'react';
import type { FC, ChangeEvent, } from 'react';
import type { Theme } from 'src/theme';
import {
  Box,
  Grid,
  Typography,
  Table,
  TableBody,
  TableHead,
  TableContainer,
  TableCell,
  TableRow,
  TablePagination,
  makeStyles,
  Button,
} from '@material-ui/core';
import SalesOrderCard from '../Card/SalesOrderCard';
import type { Order, OrderStatus } from 'src/types/simpleorder';

import useFilters from '../useFilters';

interface OrderTableProps {
  className?: string;
  handleToggleFulfillment: (event: React.MouseEvent) => void;
  getStatusLabel: (orderStatus: OrderStatus) => JSX.Element;
  OpenOrderEdit: (event: React.MouseEvent<unknown>, orderNo: string) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  box: {
    background: 'rgba(255,255,255, 0.1);',
    'padding-left': 20,
    'padding-top': 10,
    'padding-bottom': 10,
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3)
  },
  container: {
    height: 690,
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
      padding: '2px 5px 2px 5px',
    },
    '& tr.MuiTableCell-sizeSmall': {
      padding: '2px 5px 2px 5px',
    },
  },
}));

// Calculate current pagination limit
const applyPaginationOrder = (orders: Order[], page: number, limit: number): Order[] => {
  return orders.slice(page * limit, page * limit + limit);
};

let renderCount = 0;

const OrderTable: FC<OrderTableProps> = ({
  handleToggleFulfillment,
  getStatusLabel,
  OpenOrderEdit,
  // paginatedOrders,
}) => {
  renderCount++;
  //console.log('OrderTable Render...' + renderCount);

  const classes = useStyles();
  const { handleSelect, orders, filteredOrders, handleClearOrderNo } = useFilters();
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // Table Pagination apply to SO order table
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(25);

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const handleOrderClick = (event: React.MouseEvent<unknown>, orderId: string, orderNo: string, name: string): void => {
    applyOrderSelect(orderId)
    handleSelect(orderNo, name)
  }

  const applyOrderSelect = (orderId: string) => {

    if (!selectedOrders.includes(orderId)) {
      setSelectedOrders((prevSelected) => [...prevSelected, orderId]);
    } else {
      setSelectedOrders((prevSelected) => prevSelected.filter((id) => id !== orderId));
    }
  }

  const paginatedOrders = applyPaginationOrder(filteredOrders, page, limit)

  // useEffect(() => {
  //   console.log('OrderTable, useEffect', orders)
  // }, [orders]);


  return (

    <React.Fragment>
      <TableContainer className={classes.container} >
        <Table stickyHeader size="small" className={classes.cell}>

          <TableHead>
            <TableRow>
              <TableCell style={{ paddingTop: 5, paddingBottom: 5 }}>
                <Grid container justify="space-evenly">
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h4">
                      SALES ORDER
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="caption">
                      {selectedOrders.length}{' '}Order(s) Selected
                    </Typography>

                    <Button
                      color='primary'
                      size="small"
                      onClick={(event) => {
                        setSelectedOrders([]);
                        setPage(0);
                        handleClearOrderNo(event);
                      }} >
                      <Typography variant="caption" color="textPrimary" style={{ textDecoration: 'underline', fontWeight: 'lighter' }}>
                        Clear
                      </Typography>
                    </Button>
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody >
            {paginatedOrders.map((order) => {
              const isOrderSelected = selectedOrders.includes(order.id);
              return (
                <TableRow
                  className={classes.root}
                  key={order.id}
                  onClick={(event) => handleOrderClick(event, order.id, order.no, 'orderNo')}
                  role="checkbox"
                  tabIndex={-1}
                  selected={isOrderSelected}
                >
                  <TableCell>
                    <SalesOrderCard
                      order={order}
                      getStatusLabel={getStatusLabel}
                      OpenOrderEdit={OpenOrderEdit}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>

        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={orders.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[25, 50, 100]}
      />

    </React.Fragment>
  )

};

OrderTable.propTypes = {
  //order: PropTypes.any.isRequired,
  // handleOpenLot: PropTypes.func
};

export default OrderTable;
