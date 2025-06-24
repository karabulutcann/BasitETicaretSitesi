import { Product } from "./product";


export const cartErrMessages = {
    "_345":"* Sepete daha fazla ekleyemezsiniz.",
    "_346":"* Sepet bilgileri alınırken bir hata oluştu.",	
    "_500":"* Sepet bilgileri alınırken bir hata oluştu."
}

export interface LocalCart{
    productId: string;
    productCount: number;
    size: string;
    product:Product;
}

export interface Cart {
    id: string;
    productCount: number;
    size: string;
    isMaxStock: boolean;
    error: number | undefined;
    errorData:StockUpdateError|undefined;
    product: Product;
}

interface StockUpdateError{
    oldStock: number;
    newStock: number;
}
  

