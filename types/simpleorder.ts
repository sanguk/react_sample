export interface Filters {
  orderNo: string[];
  availability?: 'available' | 'unavailable';
  status: string[];
  inStock?: boolean;
  isShippable?: boolean;
  customer: string[];
  salesRep: string[];
  orderClass: string[];
  checkList: string[];
  tag: string[];
  product: string[];
}

export interface IdName {
  id: string,
  name: string
}

export interface Order {
  id: string;
  no: string;

  orderStatus: OrderStatus
  orderClass: OrderClass;

  customerNo: string;
  customerPO: string;

  billTo: Address;
  shipTo: Address[];

  salesRep: SalesRep;

  freightTerm: FreightTerm;
  releaseNumber: string;
  paymentTerm: PaymentTerm;

  discountPercentage: number;
  discountPayIn: number;
  paymentMethod: string;
  termsAndCondition: string;

  note: string;
  internalMemo: string;
  tags: string[];

  checkList: string[];

  proforma: boolean;

  productNoFull: string[];

  ordered: number;
  allocated: number;
  shipped: number;
  invoiced: number;

  lots?: Lot[];

  totalAmount?: number;
  totalWeight?: number;
  //qtyUnit: QtyUnit;

  orderedAt: Date;
  estDeliveryAt: Date;
  createdAt: Date;
}

export interface Lot {
  id: string;
  no: string;
  orderNo: string;

  customerNo: string;
  orderClass: OrderClass;

  fromSite: string;
  siteDescription: string; //NEW

  shipToState: string;
  shipToCity: string;

  // Product
  product: string;

  // Category
  categoryId: string;
  categoryNo: string;
  productGrade: string;
  type: string;
  finish: string;

  // Spec
  specId: string;
  specNo: string;

  //...

  // Attribute
  attributeId: string;
  attributeNo: string;
  paintBrand: string;
  paintType: string;
  paintCode: string;
  paintColor: string;

  qty: number;
  qtyUnit: QtyUnit
  unitPrice: number;
  weight: number;
  amount: number;

  // items: Item[];
  allocations: Allocation[];

  // unAllocated: number;
  allocated: number;
  shipped: number;
  invoiced: number;

  createdAt: number;

  relatedOrders: string[];
  relatedLots: string[]; // other order's lot
}

export interface Allocation {
  id: string;
  orderNo: string;
  lotNo: string;

  fromSite: string;
  siteDescription: string;

  shipToState: string;  //New
  shipToCity: string;  //NEW

  customerNo: string;//NEW

  categoryNo: string;
  specId: string;
  attributeId: string;

  source: string; //NEW
  relatedOrder: string;
  relatedLot: string;


  shipped: number;  //NEW
  invoiced: number;  //NEW
  weight: number;

  items: Item[];

  relatedOrders: string[];
  relatedLots: string[];

  shipments: Shipment[];
}

export interface Item {
  id: string;
  sku: string;
  itemNo: string;
  parentItemNo: string;

  orderNo: string;
  lotNo: string;
  allocationNo: string;

  qty: number;
  qtyUnit: QtyUnit
  unitPrice: number;
  weight: number;
  amount: number;

  shipmentNo: string;
}

export interface Shipment {
  id: string;
  no: string;

  customerNo: string;

  shipmentType: string;
  orderStatus: OrderStatus;

  transportType: string;
  transportation: string;
  vendor: string;
  carrier: string;

  freightTerm: string;
  freightRate: number;
  freightUnit: number; // New
  freightMemo: number; // New

  shipmentQty: number;
  qtyUnit: string;

  inspection: boolean; // New
  arrivalNoticeAt: Date; // New
  shippingDocs: string; // New

  instruction: string;
  internalMemo: string;
  accountingMemo: string;
  tags: string[];
  skid: boolean;
  dateCondition: string;

  lots: ShipmentTableType[];
  //itemRelations: ItemRelation[];

  createdAt: Date;
  orderedAt: Date;
}

//export interface ItemRelation {
//  id: string,
//  source: string,
//  orderNo: string,
//  detailNo: string,
//  from: string,
//  categoryId: number,
//  specId: number,
//  attributeId: number,
//  qty: number,
//  weight: number
//}

export interface ShipmentAssignedItem {
  id: string;
  item: Inventory;
}

export interface NameValue {
  name: string;
  value: string;
}

export interface Customer {
  id: string;
  name: string;

  billTo: Address[];
  shipTo: Address[];

  salesRep: string;

  priceTerm: string;
  freightTerm: FreightTerm;
  paymentTerm: PaymentTerm;
  discountPercentage: number;
  discountPayIn: number;
  paymentMethod: string;
  coreCredit: number;
  additionalCredit: number;
  houseCredit: number;
  openBalance: number;
  avgDaysToPay: number;
  customerMemo: string;

  avatar?: string;
}

export interface Vendor {
  id: string;
  name: string;
}

export interface Address {
  id: number;
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface FromSite {
  id: number;
  site: string;
  desc: string;
  createdAt: Date;
}

export type OrderStatus =

  | 'Canceled'
  | 'Completed'
  | 'Hold'
  | 'Rejected'
  //| 'Confirmed'
  | 'Open'
  | 'Draft';

export type SalesRep =

  | 'CS'
  | 'JJ';

export type OrderClass =

  | 'B'
  | 'C'
  | 'H'
  | 'S'
  | 'P'
  | 'T'
  | 'M';

export type FreightTerm =

  | 'Prepaid'
  | 'CPU'
  | 'Collect'
  | 'Transfer'
  | 'CIA';

export type PaymentTerm =

  | 'Net'
  | 'Net 30'
  | 'CIA'
  | 'CAD';

export type PaymentMethod = 

  | 'Check'
  | 'Wire';

export type QtyUnit =

  | 'LB'
  | 'FT'
  | 'Bundle'
  | 'Each';

export interface vendor {
  id: string;
  name: string;
}

export interface Inventory {
  id: number;
  //parentItemNo: string;
  itemNo: string
  //categoryId: string;
  //product: string;
  //productGrade: string;
  //type: string;
  //finish: string;
  //specId: string;
  //grade: string;
  //alloy: string;
  //gauge: string;
  //thickness: string;
  //thicknessCondition: string;
  //width: string;
  //coatingWeight: string;
  //temper: string;
  //bundlePcs: string;
  //dimension: string;
  //specLength: string;
  //attributeId: string;
  //paintBrand: string;
  //paintType: string;
  //paintCode: string;
  //paintColor: string;
  weight: string;
  length: string;
  //class: string;
  //fobPoint: string;
  currentLocation: string;
  //destination: string;
  //acquiredDocNo: string;
  //acquiredDocDate: string;
  //soNo: string;
  //invoiceNo: string;
  //soLotNo: string;
  //soShipmentNo: string;
  //soShipmentLotNo: string

  shNo: string;
  shlNo: string;
  shlaNo: string;
  siNo: string;
  silNo: string;
  siliNo: string;
}

export interface AssignedItem { 
  id: string; //NEW
  itemNo: string;
  categoryId: number;
  categoryNo: string;
  specId: number;
  specNo: string;
  attributeId: number;
  attributeNo: string; 

  from: string; 
  siteDescription: string; 
  shipToCity: string; 
  shipToState: string; 
  etd: Date; 
  eta: Date; 
  releaseNo: string; 

  weight: number; 
  length: number; 
  qty: number; 
  qtyUnit: QtyUnit;

  soNo: string;

  shipmentNo: string;
  shipmentLotNo: string; 

  invoiceNo: string; 
  performaNo: string; 
}

export interface Invoice { //NEW
  id: string; 
  no: string; 

  status: string; //NEW

  invoiceDate: Date; 
  dueDate: Date; 

  customerNo: string; 
  customerPO: string; 

  billTo: Address; 
  shipTo: Address; 

  soNo: string; 
  salesRep: string; 

  shipmentLotNo: string; 
  shipDate: Date; 
  
  paymentTerm: PaymentTerm; 
  discountPercentage: number; 
  discountPayIn: number;  
  freightTerm: FreightTerm; 

  additionalCharge: AdditionalCharges[]; //NEW

  items: InvoiceItem[]; 

  totalAmount: number; 
  credit: number; 

  internalNote: string; 
  customerNote: string; 
  termsAndCondition: string; 

}

export interface InvoiceItem {
  id: string;
  itemNo: string;
  categoryId: string;
  specId: string;
  attributeId: string;
  weight: number; //NEW
  qty: number; //NEW
  qtyUnit: QtyUnit; //NEW
  length: number; //NEW
  unitPrice: number; //NEW
  amount: number; //NEW
}

export interface ShipmentTableType {
  id: string; // shLotId
  shNo: string;
  shLotNo: string;
  orderStatus: string;
  transportType: string;
  vendor: string;
  freightRate: number;
  fromSite: string;
  siteDescription: string;
  toSite: string;
  eta: Date;
  etd: Date;
  weight: number;
  invoiced: number;
  releaseNo: string;
  soNo: string; 
}

export interface InvoiceTableType {
  id: string; // invoiceItemId
  invoiceNo: string;
  status: string;
  soNo: string;
  reference: string;
  customerNo: string;
  customerPO: string;
  salesRep: string;
  class: string;
  categoryNo: string;
  specNo: string;
  attributeNo: string;
  weight: string;
  qty: number;
  qtyUnit: string;
  length: string;
  amount: number;
}

export interface AdditionalCharges { //NEW
  siNo: string; //NEW
  additionalFreight: number; //NEW
}