export interface Product {
    name: string;
    id: string;
    link: string;
    description: string | null;
    price: string;
    discount: number | null;
    discountedPrice: string | null;
    imageUrls: string[] | any;
    detail: ProductDetail|unknown | null;
    sizeChartId: number |null;
  }

export interface ProductDetail {
  description: ProductDetailElement[];
  materialAndCare: ProductDetailElement[];
  exchangeAndReturn: ProductDetailElement[];
}


export interface ProductDetailElement{
  tag: string;
  className: string;
  children: ProductDetailElement[];
  text: string;
} 