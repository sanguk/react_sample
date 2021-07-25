export interface Shipment {
  id: string;
  no: string;

  shipmentType: ShipmentType;
  transportationType: TransportType;

  shipmentStatus: ShipmentStatus;

  transportationName: string;
  vendorName: string;
  carrier: string;

  freightTerm: FreightTerm;
  freightRate: number;
  freightUnit: Unit;
  freightMemo: string;

  shipmentLots: ShipmentLot[];
}

export interface ShipmentLot {
  id: string;
  no: string;

  fromTerminal: string;
  fromSite: string;
  etd: Date;

  toTerminal: string;
  toSite: string;
  eta: Date;

 // bl: string;  This belongs to Orders
 // blDate: Date;  This belongs to Orders

  containerNo: string;
  containerPickupDate: Date;
  containerReturnDate: Date;

  release: string;
  releaseDate: Date;
  freetimeExpire: Date;
  pickupFreetimeExpire: Date;
  returnFreetimeExpire: Date;

  deliveryInstructionDate: Date;
  deliveryOrderNo: string;

  arrivalNotice: Date;
  shippingDocs?: boolean;

  skid?: boolean;
  containerSize: number;

  inspection?: boolean;

  orderLots: OrderLot[];

  qty: number;
  qtyUnit: Unit;


}



export interface OrderLot {
  id: string;
  no: string;

  product: string;
  category: string;
  spec: string;
  attribute: string;
  qty: number;
  qtyUnit: Unit;
  amount: number;

  items: Item[];
  orderNo: string;
}

export interface Item {
  id: string;
  no: string;

  qty: number;
  qtyUnit: Unit;
  unitPrice: number;
  amount: number;
}

export type ShipmentType =

  | 'PO Shipment'
  | 'SO Shipment'
  | 'TO Shipment'
  | 'WO Shipment';

export type TransportType =

  | 'Bulk Vessel'
  | 'Container Vessel'
  | 'Flatbed Truck'
  | 'Container Truck'
  | 'Rail Road'
  | 'Barge';

export type ShipmentStatus =

  | 'Not Yet'
  | 'In transit'
  | 'FOB Arrived'
  | 'Destination Completed'
  | 'Canceled';

export type FreightTerm =

  | 'Prepaid'
  | 'CPU'
  | 'Collect'
  | 'Transfer';

export type Unit =

  | 'LB'
  | 'MT'
  | 'FT'
  | 'CWT'
  | 'NT'
  | 'FT'
  | 'Bundle';