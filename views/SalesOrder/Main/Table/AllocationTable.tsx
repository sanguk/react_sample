import React, { useState } from 'react';
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
import type { Order, Filters, Allocation, Shipment } from 'src/types/simpleorder';
import AllocationFulfillmentCard from '../Card/AllocationFulfillmentCard';
import AllocationBulkOperation from '../BulkOperation/AllocationBulkOperation';
import ShipmentDialog from 'src/views/dev/SalesOrder/ShipmentEdit/Dev/ShipmentDialog';
import axios2 from 'src/utils/axios2';
import useFilters from '../useFilters';
import numeral from 'numeral';

interface AllocationTableProps {
  className?: string;
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

const applyFiltersAllocaion = (allocaions: Allocation[], filters: Filters): Allocation[] => {
  return allocaions.filter((allocation) => {
    let matches = true;

    if (filters.orderNo.length !== 0 && !filters.orderNo.includes(allocation.orderNo)) {
      matches = false;
    }
    return matches;
  });
};


const applyPaginationAllocation = (allocations: Allocation[], page: number, limit: number) => {
  return allocations.slice(page * limit, page * limit + limit);
};


const createAllocationFromOrder = (orders: Order[]) => {
  const lotArr = orders.map(order => order.lots)
  const lots = ([].concat(...lotArr))

  const allocationArr = lots.map(lot => lot.allocations)
  const allocations = ([].concat(...allocationArr))

  return allocations
};


const AllocationTable: FC<AllocationTableProps> = ({
  OpenOrderEdit,
  OpenShipmentEdit,
}) => {

  const classes = useStyles();
  const { currentFilters, allocations } = useFilters();
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(25);
  const [selectedLineItems, setSelectedLineItems] = useState<string[]>([]);
  // const [toggle, setToggle] = useState<boolean>(false);
  const [openShipmentEdit, setOpenShipmentEdit] = useState<boolean>(false);
  const [shipment, setShipment] = useState<any>(null);
  const [shippable, setShippable] = useState<number>(0);
  const [invoiceable, setInvoiceable] = useState<number>(0);


  const handleLineItemClick = (event: React.MouseEvent<unknown>, id: string, unShipped: number, unInvoiced: number): void => {

    var addShippable = shippable + unShipped
    var subShippable = shippable - unShipped

    var addInvoiceable = invoiceable + unInvoiced
    var subInvoiceable = invoiceable - unInvoiced

    if (!selectedLineItems.includes(id)) {
      setSelectedLineItems((prevSelected) => [...prevSelected, id]);
      setShippable(addShippable)
      setInvoiceable(addInvoiceable)
    } else {
      setSelectedLineItems((prevSelected) => prevSelected.filter((a) => a !== id));
      setShippable(subShippable)
      setInvoiceable(subInvoiceable)

    }
    console.log(unShipped)

  };

  // const handleToggleFulfillment = (event: React.MouseEvent): void => {
  //   setToggle(true)
  //   event.stopPropagation();
  // };

  // Shipment Edit Dialog Functions
  // server한테 selectedLineItems invoiceable을 줘서 shipment object를 받는다.
  // shipment object는 2개의 param을 이용해서 no 뿐만아니라 detail-allocation까지 만들어서 response한다.
  // shipment를 dialog로 보내서 edit 및 submit할 수 있게 한다.
  const handleOpenShipmentEdit = (event: React.MouseEvent<unknown>, shipmentNo: string) => {
    // New sales order has below default values
    if (shipmentNo == null) {
      axios2.post(`/sh/draft`, selectedLineItems).then((response) => {
        console.log(`/ShipmentDraft`, response);
        setShipment(response.data);
        setOpenShipmentEdit(true);
      });
    }
    else {
      axios2.get(`/sh/${shipmentNo}`).then((response) => {
        setShipment(response.data);
        setOpenShipmentEdit(true);
      });
    }
    event.stopPropagation();
  };

  // Shipment Edit Dialog Functions
  const handleCloseShipmentEdit = (): void => {
    setOpenShipmentEdit(false);
  };


  const handleClearSelectedLineItems = (): void => {
    setSelectedLineItems([])
  };

  const handleLotPageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLotLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  //const allocations = createAllocationFromOrder(orders)
  const filteredAllocations = applyFiltersAllocaion(allocations, currentFilters);
  const paginatedAllocations = applyPaginationAllocation(filteredAllocations, page, limit);

  // const enableFulfillment = toggle
  const enableBulkOperations = selectedLineItems.length > 0;

  const capitalizeFirstLetter = (a): string => {
    return (
      a.charAt(0).toUpperCase() + a.slice(1).toLowerCase()
    );
  };


  const LotBody = (allocationId: string, allocation: Allocation, isSelected: boolean): JSX.Element => {

    return (

      <TableRow
        key={allocation.id}
        onClick={(event) => handleLineItemClick(
          event,
          allocationId,
          allocation.weight - allocation.shipped,
          allocation.weight - allocation.invoiced)}
        tabIndex={-1}
        role="checkbox"
        selected={isSelected}
      >

        <TableCell align="center">
          <Button
            color='primary'
            size="small"
            onClick={(event) => OpenOrderEdit(event, allocation.orderNo)} >
            <Typography variant="caption" color="textPrimary" style={{ textDecoration: 'underline', fontWeight: 'lighter' }}>
              {allocation.orderNo}
            </Typography>
          </Button>
        </TableCell>

        <TableCell >
          <Typography variant="caption" color="textSecondary">
            {allocation.relatedOrder}
          </Typography>
        </TableCell>

        <Tooltip
          arrow
          placement="top"
          title={allocation.siteDescription ?? ''}
        >
          <TableCell align="center">
            <Typography variant="caption" color="textSecondary">
              {allocation.fromSite}
            </Typography>
          </TableCell>
        </Tooltip>

        <TableCell align="center">
          <Typography variant="caption" color="textSecondary">
            {allocation.shipToState}
                    ,
                    {' '}
            {capitalizeFirstLetter(allocation.shipToCity)}
          </Typography>
        </TableCell>
        {/* <TableCell >
          <Typography variant="caption" color="textSecondary">
            {allocation.categoryNo}
          </Typography>
        </TableCell> */}
        <TableCell >
          <Typography variant="caption" color="textSecondary">
            {allocation.specId}
          </Typography>
        </TableCell>
        <TableCell >
          <Typography variant="caption" color="textSecondary">
            {allocation.attributeId}
          </Typography>
        </TableCell>


        <TableCell align="right">
          <Typography variant="caption" color="textSecondary">
            {numeral(allocation.weight).format(`0,0`)}

          </Typography>
        </TableCell>

        <TableCell align="center">
          <AllocationFulfillmentCard allocation={allocation} />
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
                Related Order
              </TableCell>
              <TableCell align="center">
                From Site
              </TableCell>
              <TableCell align="center">
                Ship To
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
                Weight (lb)
              </TableCell>
              <TableCell align="center">
                Fulfillment
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedAllocations.map((allocation) => {
              //console.log('allocation', allocation)
              const isSelected = selectedLineItems.includes(allocation.id);
              return (
                LotBody(allocation.id, allocation, isSelected)
              )
            })}

          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredAllocations.length}
        onChangePage={handleLotPageChange}
        onChangeRowsPerPage={handleLotLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[25, 50, 100]}
      />

      <AllocationBulkOperation
        open={enableBulkOperations}
        selectedLineItems={selectedLineItems}
        handleActionItem1Click={handleOpenShipmentEdit}
        handleClearSelectedLineItems={handleClearSelectedLineItems}
        shippable={shippable}
        invoiceable={invoiceable}
      />

      {shipment &&
        <ShipmentDialog
        open={openShipmentEdit}
        handleCloseShipmentEdit={handleCloseShipmentEdit}
        shipment={shipment}
        OpenShipmentEdit={OpenShipmentEdit}
        OpenOrderEdit={OpenOrderEdit}
        handleDialog1Close={handleCloseShipmentEdit}
        //selectedLineItems={selectedLineItems}
        //allocaions={allocaions}
        />
      }
    </div>
  )
};

AllocationTable.propTypes = {

  //handleLotClick: PropTypes.func,
  //  handleToggleFulfillment: PropTypes.func
};

export default AllocationTable;
