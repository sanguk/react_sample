export interface Category {
  categoryId: number,
  categoryNo: string,
  type: string,
  finish: string,
  product: string,
}

export interface Spec {
  specId: number,
  specNo: string,
}

export interface Attribute {
  id: number,
  attributeNo: string,
  paintBrand: string,
  paintType: string,
  paintCode: string,
  paintColor: string
}