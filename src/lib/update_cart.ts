
import { NotInStockResponseUnAuth } from "@/app/api/checkout/check_stock/route";
import { HaveStockResponse } from "@/app/api/product/get_product_size/route";
import { defaultCartDispatchAction } from "@/app/cart";
import { Cart } from "@/types/cart";
import { Dispatch } from "react";

export default function updateCartUnAuth(
    dispatch: Dispatch<any>,
    r: NotInStockResponseUnAuth
) {
    let cartItems: Cart[] = JSON.parse(localStorage.getItem("cart")!);
    let newCartItems: Cart[] = JSON.parse(localStorage.getItem("cart")!);
    let removedCartIndexs: number[] = [];
    r.data.map((item) => {
        cartItems.forEach((c, i) => {
            if (c.product.id === item.productId && c.size === item.size) {
                if (item.stock === 0) {
                    removedCartIndexs.push(i);
                    c.isMaxStock = true;
                    c.productCount = 0;
                } else {
                    c.isMaxStock = true;
                    c.error = 245;
                    c.errorData = {
                        oldStock: item.productCount,
                        newStock: item.stock,
                    };
                    c.productCount = item.stock;
                    newCartItems[i].productCount = item.stock;
                }
            }
        });
    });

    dispatch({
        type: "set",
        value: {
            ...defaultCartDispatchAction.value,
            cartItems: cartItems,
        },
    });
    localStorage.setItem(
        "cart",
        JSON.stringify(
            newCartItems.filter((c, i) => !removedCartIndexs.includes(i)),
        ),
    );
}