import React, { useState, ChangeEvent, FC } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableContainer,
  TablePagination,
  TableCell,
  TableRow,
  Typography,
  makeStyles,
  Button,
} from '@material-ui/core';

import numeral from 'numeral';
import type { Lot, Order, Filters } from 'src/types/simpleorder';
import LotFulfillmentCard from '../Card/LotFulfillmentCard';
import LotBulkOperation from '../BulkOperation/LotBulkOperation';
import AllocationDialog from '../Dialog/AllocationDialog';
import useFilters from '../useFilters';
import { Page } from '@react-pdf/renderer';

interface LotTableProps {
  className?: string;
  currentTab: string;
  // paginatedLots: Lot[];
  OpenOrderEdit: (event: React.MouseEvent<unknown>, orderNo: string) => void
  //applyFilterOrder: (lots: Lot[], filters: Filters) => Lot[];
  //applyPaginationOrder: (lots: Lot[], page: number, limit: number) => { };
  //handleOrderPageChange: (event: any, newPage: number) => void;
  //handleOrderLimitChange: (event: ChangeEvent<HTMLInputElement>) => void;
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


const createLotFromOrder = (orders: Order[]) => {
  const lotArr = orders.map(order => order.lots)
  const lots = ([].concat(...lotArr))
  return lots
};

const applyFiltersLot = (lots: Lot[], filters: Filters): Lot[] => {
  return lots.filter((lot) => {
    let matches = true;

    if (filters.orderNo.length !== 0 && !filters.orderNo.includes(lot.orderNo)) {
      matches = false;
    }
    return matches;
  });
};

const applyPaginationLot = (lots: Lot[], page: number, limit: number) => {
  return lots.slice(page * limit, page * limit + limit);
};




const LotTable: FC<LotTableProps> = ({ currentTab, OpenOrderEdit, }) => {
  const classes = useStyles();
  const { currentFilters, lots, getOrders } = useFilters();

  const [selectedLineItems, setSelectedLineItems] = useState<string[]>([]);
  //const [toggle, setToggle] = useState<boolean>(false);
  const [dialog1, setDialog1] = useState<boolean>(false);
  //const [selectedObject, setSelectedObject] = useState<Lot[]>([]);
  const [allocatable, setAllocatable] = useState<number>(0);

  // Table Pagination apply to SO Detail table
  const [lotPage, setLotPage] = useState<number>(0);
  const [lotLimit, setLotLimit] = useState<number>(25);
  const handleLotPageChange = (event: any, newPage: number): void => {
    setLotPage(newPage);
  };
  const handleLotLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLotLimit(parseInt(event.target.value));
  };

  const handleLineItemClick = (event: React.MouseEvent<unknown>, lotId: string, unAllocated: number): void => {

    var addAllocatable = allocatable + unAllocated
    var subAllocatable = allocatable - unAllocated

    if (!selectedLineItems.includes(lotId)) {
      setSelectedLineItems((prevSelected) => [...prevSelected, lotId]);
      setAllocatable(addAllocatable)
    } else {
      setSelectedLineItems((prevSelected) => prevSelected.filter((id) => id !== lotId));
      setAllocatable(subAllocatable)

    }
  };

  // const handleToggleFulfillment = (event: React.MouseEvent): void => {
  //   setToggle(true)
  //   event.stopPropagation();
  // };

  const handleActionItem1Click = (): void => {
    if (!dialog1) {
      setDialog1(true);
    } else {
      setDialog1(false);
      getOrders()
    }
  };

  const handleClearSelectedLineItems = (): void => {
    setSelectedLineItems([])
  };

  const createObjectFromSelected = (): Lot[] => {
    //setSelectedObject(paginatedLots.filter(lot => id.includes(lot.id)))
    return (
      lots.filter(lot => selectedLineItems.includes(lot.id))
    )
  };

  //const lots = createLotFromOrder(orders)
  const filteredLots = applyFiltersLot(lots, currentFilters);
  const paginatedLots = applyPaginationLot(filteredLots, lotPage, lotLimit);

  // const enableFulfillment = toggle
  const enableBulkOperations = selectedLineItems.length > 0;

  const capitalizeFirstLetter = (a): string => {
    return (
      //a.charAt(0).toUpperCase() + a.slice(1).toLowerCase()
      a
    );
  };


  const LotBody = (lotId: string, lot: Lot, isLotSelected: boolean): JSX.Element => {
    return (
      <TableRow
        key={lot.id}
        onClick={(event) => handleLineItemClick(event, lotId, lot.weight - lot.allocated)}
        tabIndex={-1}
        role="checkbox"
        selected={isLotSelected}
      >
        <TableCell align="center">
          <Button
            color='primary'
            size="small"
            onClick={(event) => OpenOrderEdit(event, lot.orderNo)} >
            <Typography variant="caption" color="textPrimary" style={{ textDecoration: 'underline', fontWeight: 'lighter' }}>
              {lot.orderNo}
            </Typography>
          </Button>
        </TableCell>
        <TableCell align="center">
          <Typography variant="caption" color="textSecondary">
            {lot.orderClass}
          </Typography>
        </TableCell>
        <TableCell style={{ maxWidth: 170, textOverflow: "ellipsis", overflow: "hidden" }} >
          <Typography variant="caption" color="textSecondary" noWrap>
            {lot.customerNo}
          </Typography>
        </TableCell>
        {/* <TableCell >
          <Typography variant="caption" color="textSecondary">
            {lot.categoryNo}
          </Typography>
        </TableCell> */}
        <TableCell >
          <Typography variant="caption" color="textSecondary">
            {lot.specNo}
          </Typography>
        </TableCell>
        <TableCell >
          <Typography variant="caption" color="textSecondary">
            {lot.attributeNo}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="caption" color="textSecondary">
            {lot.shipToState} {',  '} {capitalizeFirstLetter(lot.shipToCity)}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Typography variant="caption" color="textSecondary">
            {numeral(lot.weight).format(`0,00`)}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <LotFulfillmentCard
            lot={lot}
          />
        </TableCell>

        {/* <TableCell >
          <IconButton size="small"
            onClick={handleToggleFulfillment}
          >
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          </IconButton>
        </TableCell> */}

      </TableRow>
    )
  }

  return (
    <div>
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small" className={classes.cell}>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                Sales Order
              </TableCell>
              <TableCell align="center">
                Class
              </TableCell>
              <TableCell align="center"
              //style={{ maxWidth: 170 }}
              >
                Customer
              </TableCell>
              {/* <TableCell align="center">
                Product
              </TableCell> */}
              <TableCell align="center">
                Spec
              </TableCell>
              <TableCell align="center">
                Attribute
              </TableCell>
              <TableCell align="center">
                Ship To
              </TableCell>
              <TableCell align="center">
                Weight (lb)
              </TableCell>
              <TableCell align="center">
                Fulfillment
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedLots.map((lot) => {
              // console.log("Lot map..")
              const isSelected = selectedLineItems.includes(lot.id);
              return (
                LotBody(lot.id, lot, isSelected)
              )
            })}

          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={lots.length}
        onChangePage={handleLotPageChange}
        onChangeRowsPerPage={handleLotLimitChange}
        page={lotPage}
        rowsPerPage={lotLimit}
        rowsPerPageOptions={[25, 50, 100]}
      />

      <LotBulkOperation
        open={enableBulkOperations}
        selectedLineItems={selectedLineItems}
        allocatable={allocatable}
        handleActionItem1Click={handleActionItem1Click}
        handleClearSelectedLineItems={handleClearSelectedLineItems}
      />

      <AllocationDialog
        open={dialog1}
        selectedLots={createObjectFromSelected()}
        handleActionItem1Click={handleActionItem1Click}
        OpenOrderEdit={OpenOrderEdit}
      />
    </div>
  )
};

LotTable.propTypes = {
  //handleLotClick: PropTypes.func,
  //  handleToggleFulfillment: PropTypes.func
};

export default LotTable;
