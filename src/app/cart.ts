import { Dispatch, createContext, useContext } from "react";
import { baseUrl } from "@/local.env";
import { AddToCartRequest, AddToCartResponse } from "./api/cart/add_to_cart/route";
import { UpdateCartData } from "./api/cart/update_cart/route";
import { Cart } from "@/types/cart";
import { DeleteFromCartData } from "./api/cart/delete_from_cart/route";
import { Product } from "@/types/product";
import { ProductSize } from "@/db/schema";
import { HaveStockRequest, HaveStockResponse } from "./api/product/get_product_size/route";


export function isOpenReducer(prev: boolean, action: string) {
  if (prev === false) {
    return true;
  } else {
    return false;
  }
}

export const IsOpenDispatchContext = createContext<Function>(isOpenReducer);
export const IsOpenContext = createContext<boolean>(false);

interface CartDispatchAction {
  type: string;
  value: {
    cartIndex: number | undefined;
    cartId: string | undefined;
    productId: string | undefined;
    size: string | undefined;
    cartItems: Cart[];
    hasOldCart: boolean;
    product: Product | undefined;
    stock: number | undefined;
  };
}

export const defaultCartDispatchAction: CartDispatchAction = {
  type: "",
  value: {
    cartIndex: undefined,
    cartId: undefined,
    productId: undefined,
    size: undefined,
    cartItems: [],
    hasOldCart: false,
    product: undefined,
    stock: undefined
  },
};

export interface CartReducerState {
  totalPrice: number;
  cartItems: Cart[];
  error: number | undefined;
}

function getPrice(cartItem: Cart): number {
  return parseFloat(cartItem.product.discount! > 0
    ? cartItem.product.discountedPrice!
    : cartItem.product.price!);
}

function calculateTotalPrice(cart: Cart[]): number {
  let newPrice = 0;
  cart.forEach((c) => {
    newPrice = newPrice + getPrice(c) * c.productCount;
  });
  return newPrice;
}


// TODO : local storage a kaydetmeyi hallet 
export function cartReducer(
  prevState: CartReducerState,
  action: CartDispatchAction,
): CartReducerState {
  switch (action.type) {
    case "set": {
      return {
        totalPrice: calculateTotalPrice(action.value.cartItems!),
        cartItems: [...action.value.cartItems!],
        error: undefined,
      };
    }

    case "add": {
      const cartItem = action.value.cartItems[0];

      if (action.value.hasOldCart === true) {
        return {
          totalPrice: prevState.totalPrice + getPrice(cartItem),
          cartItems: [...prevState.cartItems.filter(
            (_, i) => prevState.cartItems[i].id !== cartItem.id,
          ), cartItem],
          error: undefined,
        } as CartReducerState;
      }

      return {
        totalPrice: prevState.totalPrice + getPrice(cartItem),
        cartItems: [...prevState.cartItems, cartItem],
        error: undefined,
      } as CartReducerState;

    }

    case "updateAdd": {
      const cartItem = prevState.cartItems[action.value.cartIndex!];
      let newCartItems = [...prevState.cartItems];
      const newCount = newCartItems[action.value.cartIndex!].productCount + 1;

      newCartItems[action.value.cartIndex!] = {
        ...cartItem,
        productCount: newCount,
        error: undefined,
        errorData: undefined
      };
      return {
        ...prevState,
        totalPrice: prevState.totalPrice + getPrice(cartItem),
        cartItems: [...newCartItems],
      };
    }

    case "updateSub": {
      let cartItem = prevState.cartItems[action.value!.cartIndex!];
      cartItem.isMaxStock = false;

      let totalPrice = prevState.totalPrice - getPrice(cartItem);

      if (cartItem.productCount === 1) {
        return {
          totalPrice: totalPrice,
          cartItems: prevState.cartItems.filter(
            (_, i) => i !== action.value!.cartIndex,
          ),
          error: undefined,
        };
      }
      let newCartItems = [...prevState.cartItems];
      const newCount = newCartItems[action.value!.cartIndex!].productCount - 1;

      newCartItems[action.value!.cartIndex!] = {
        ...cartItem,
        productCount: newCount,
        error: undefined,
        errorData: undefined
      };
      return {
        totalPrice: totalPrice,
        cartItems: [...newCartItems],
        error: undefined,

      };
    }
    case "updateMaxStock": {
      let cartItem :Cart;
      if(action.value.cartId !== undefined){
        cartItem = {...prevState.cartItems.find((c)=>c.id === action.value.cartId)!};
      }else{
        cartItem = {...prevState.cartItems[action.value!.cartIndex!]};
      }
      cartItem.isMaxStock = true;
      if (action.value.stock === cartItem.productCount) {
        return {
          ...prevState,
          cartItems: [...prevState.cartItems],
          error: undefined,
        };
      } else {
        cartItem.error = 245;
        cartItem.errorData = {
          newStock: action.value.stock!,
          oldStock: cartItem.productCount
        };

        let totalPrice = prevState.totalPrice -
          getPrice(cartItem)
          *
          (cartItem.productCount - action.value.stock!);
          cartItem.productCount = action.value.stock!;
        return {
          ...prevState,
          totalPrice: totalPrice,
          cartItems: [...prevState.cartItems],
          error: 245,
        }
      }
    }
    case "updateNotInStock": {
      let cartItem :Cart;
      if(action.value.cartId !== undefined){
        cartItem = prevState.cartItems.find((c)=>c.id === action.value.cartId)!;
      }else{
        cartItem = prevState.cartItems[action.value!.cartIndex!];
      }

      let totalPrice = prevState.totalPrice -
        getPrice(cartItem) * cartItem.productCount;

      cartItem.productCount = 0;
      cartItem.isMaxStock = true;

      return {
        totalPrice,
        cartItems: [...prevState.cartItems.filter(
          (_, i) => i !== action.value!.cartIndex,
        ), cartItem],
        error: 246,
      };
    }
    case "checkoutUpdate": {
      let cartItem = prevState.cartItems.find((c) => c.id === action.value.cartId);
      if (action.value.stock === 0) {
        let totalPrice = prevState.totalPrice -
          getPrice(cartItem!) * cartItem!.productCount;

        cartItem!.productCount = 0;
        cartItem!.isMaxStock = true;

        return {
          totalPrice,
          cartItems: [...prevState.cartItems.filter(
            (_, i) => i !== action.value!.cartIndex,
          ), cartItem!],
          error: undefined,
        };
      } else {
        let totalPrice = prevState.totalPrice -
          getPrice(cartItem!) * (cartItem!.productCount - action.value.stock!);

        cartItem!.productCount = action.value.stock!;
        cartItem!.isMaxStock = true;

        return {
          totalPrice,
          cartItems: [...prevState.cartItems.filter(
            (_, i) => i !== action.value!.cartIndex,
          ), cartItem!],
          error: undefined,
        };
      }
    }

    case "delete": {
      return {
        totalPrice:
          prevState.totalPrice -
          getPrice(prevState.cartItems[action.value!.cartIndex!]) *
          prevState.cartItems[action.value!.cartIndex!].productCount,
        cartItems: [
          ...prevState.cartItems.filter(
            (c) => c.id !== prevState.cartItems[action.value!.cartIndex!].id,
          ),
        ],
        error: undefined,
      };
    }

    case "deleteNotInStock": {
      let cartItems = prevState.cartItems.map((c) => {
        return { ...c };
      });
      return {
        ...prevState,
        cartItems: [
          ...cartItems.filter((c) => c.size !== prevState.cartItems[action.value!.cartIndex!].size || c.product.id !== prevState.cartItems[action.value!.cartIndex!].product.id),
        ],
      }
    }

    case "server_err": {
      return { ...prevState, error: 500 };
    }
    case "error": {
      return { ...prevState, error: 1 };
    }
    default: {
      return { ...prevState };
    }
  }
}

export function deleteCartDispatch(
  dispatch: Dispatch<CartDispatchAction>,
  cartId: string,
  cartIndex: number,
  callBack: (status: number) => any,
) {
  fetch(baseUrl + "/api/cart/delete_from_cart", {
    method: "POST",
    body: JSON.stringify({
      cartId: cartId,
    } as DeleteFromCartData),
  }).then((r) => {
    callBack(r.status);
    if (r.ok) {
      dispatch({
        type: "delete",
        value: {
          ...defaultCartDispatchAction.value,
          cartIndex: cartIndex,
        },
      });
    }
  });
}

export function updateCartDispatch(
  dispatch: Dispatch<CartDispatchAction>,
  oldItem: Cart,
  oldCartIndex: number,
  countToAdd: number,
  callBack: (errCode: number | undefined) => void,
) {
  fetch(baseUrl + "/api/cart/update_cart", {
    method: "POST",
    body: JSON.stringify({
      cartId: oldItem.id,
      productId: oldItem.product.id,
      countToAdd: countToAdd,
      size: oldItem.size,
    } as UpdateCartData),
  }).then((r) => {
    callBack(r.status);
    if (r.ok) {
      if (r.status === 245) {
        return r.json();
      }
      if (r.status === 246) {
        dispatch({
          type: "updateNotInStock",
          value: {
            ...defaultCartDispatchAction.value,
            cartIndex: oldCartIndex,
          },
        });
        return;
      }

      if (countToAdd === -1) {
        dispatch({
          type: "updateSub",
          value: {
            ...defaultCartDispatchAction.value,
            cartIndex: oldCartIndex,
          },
        });
        return;
      }
      dispatch({
        type: "updateAdd",
        value: {
          ...defaultCartDispatchAction.value,
          cartIndex: oldCartIndex,
        },
      });
    }
  }).then((r) => {
    if(r !== undefined){
      if (r.code === 245) {
        dispatch({
          type: "updateMaxStock",
          value: {
            ...defaultCartDispatchAction.value,
            cartIndex: oldCartIndex,
            stock: r.stock
          },
        });
      }
    }
  });
}

export function addToCartDispatch(
  dispatch: Dispatch<CartDispatchAction>,
  productId: string,
  productSize: string,
  callback: (status: number) => void,
) {
  fetch(baseUrl + "/api/cart/add_to_cart", {
    method: "POST",
    body: JSON.stringify({
      productId,
      productSize,
    } as AddToCartRequest),
  })
    .then((r) => {
      callback(r.status);
      if (r.ok) {
        if (r.status === 200) {
          return r.json();
        }
        return undefined;
      }
    })
    .then((r: AddToCartResponse) => {
      console.log(r);
      if (r !== undefined) {
        dispatch({
          type: "add",
          value: {
            ...defaultCartDispatchAction.value,
            cartItems: [r.cartItem],
            hasOldCart: r.hasOldCart,
          },
        });
      }
    });
}

export function setCartDispatch(dispatch: Dispatch<CartDispatchAction>) {
  fetch(baseUrl + "/api/cart/get_cart", {
    method: "GET",
  })
    .then((r) => {
      if (r.ok) {
        return r.json();
      } else {
        throw new Error("there was an error");
      }
    })
    .then((r: Cart[]) => {
      dispatch({
        type: "set",
        value: {
          ...defaultCartDispatchAction.value,
          cartItems: r,
        },
      });
    }).catch((err) => {
      dispatch({
        type: "server_err",
        value: {
          ...defaultCartDispatchAction.value,
        },
      });
    });
}

export function localSetCartDispatch(
  dispatch: Dispatch<CartDispatchAction>,
) {
  let cartItems = localStorage.getItem("cart");
  if (cartItems === null || cartItems === "") {
    localStorage.setItem("cart", "[]");
    dispatch({
      type: "set",
      value: {
        ...defaultCartDispatchAction.value,
        cartItems: [],
      },
    })
  } else {
    let cartItemsParsed = JSON.parse(cartItems!);
    if (cartItemsParsed.length === 0) {
      dispatch({
        type: "set",
        value: {
          ...defaultCartDispatchAction.value,
          cartItems: [],
        },
      })
    }
    dispatch({
      type: "set",
      value: {
        ...defaultCartDispatchAction.value,
        cartItems: cartItemsParsed,
      },
    })
  }
}

export function localAddToCartDispatch(
  dispatch: Dispatch<CartDispatchAction>,
  product: Product,
  productSize: ProductSize,
  size: string,
  callBack: (status: number) => void,
) {
  let cartItems: Cart[] = JSON.parse(localStorage.getItem("cart")!);
  let cartItemIndex: number | undefined = undefined;

  cartItems.map((c, i) => {
    if (c.product.id === product.id && c.size === size) {

      cartItemIndex = i;
    }

  });
  if (cartItemIndex === undefined) {
    const newItem: Cart = {
      id: "",
      productCount: 1,
      size: size,
      product: product,
      isMaxStock: false,
      error: undefined,
      errorData: undefined
    };
    cartItems.push(newItem);
    localStorage.setItem("cart", JSON.stringify(cartItems));
    dispatch({
      type: "set",
      value: {
        ...defaultCartDispatchAction.value,
        cartItems: cartItems,
      },
    })
    callBack(200);
  } else {

    cartItems[cartItemIndex].productCount = cartItems[cartItemIndex].productCount + 1;
    
    if (cartItems[cartItemIndex].productCount > productSize.stock) {
      callBack(245)
    } else {
      cartItems[cartItemIndex].isMaxStock = false;
      cartItems[cartItemIndex].error = undefined;
      cartItems[cartItemIndex].errorData = undefined;
      if (cartItems[cartItemIndex].productCount === productSize.stock) {
        cartItems[cartItemIndex].isMaxStock = true;
        cartItems[cartItemIndex].error = 246;
        cartItems[cartItemIndex].errorData = undefined;
      }
      localStorage.setItem("cart", JSON.stringify(cartItems));
      dispatch({
        type: "set",
        value: {
          ...defaultCartDispatchAction.value,
          cartItems: cartItems,
        },
      })
      callBack(200);
    }


  }
}

export function localUpdateSubCartDispatch(
  dispatch: Dispatch<CartDispatchAction>,
  cartIndex: number,
  callBack: (status: number) => any,
) {
  let cartItems: Cart[] = JSON.parse(localStorage.getItem("cart")!);
  cartItems[cartIndex].isMaxStock = false;
  cartItems[cartIndex].productCount = cartItems[cartIndex].productCount - 1;
  cartItems[cartIndex].error = undefined;
  cartItems[cartIndex].errorData = undefined;
  if (cartItems[cartIndex].productCount === 0) {
    cartItems.splice(cartIndex, 1);
  }
  localStorage.setItem("cart", JSON.stringify(cartItems));
  dispatch({
    type: "set",
    value: {
      ...defaultCartDispatchAction.value,
      cartItems: cartItems,
    },
  })
  callBack(200);
}

export function localUpdateAddCartDispatch(
  dispatch: Dispatch<CartDispatchAction>,
  cartIndex: number,
  callBack: (status: number) => any,
) {
  let cartItems: Cart[] = JSON.parse(localStorage.getItem("cart")!);
  fetch(baseUrl + "/api/product/get_product_size", {
    method: "POST",
    body: JSON.stringify({
      productId: cartItems[cartIndex].product.id,
      size: cartItems[cartIndex].size
    } as HaveStockRequest),
  }).then((r) => {
    if (r.ok) {
      return r.json();
    }
    callBack(500);
  }).then((r: HaveStockResponse) => {
    cartItems[cartIndex].product = r.product;
    if (r.stock === 0) {
      // burde cartItemları kopyalamak gerekiyor çünkü kopyalamadan bir itemi arraydan splice ile çıkardığım zaman
      // dispatch teki cartItemsdaki itemde değişiyor
      let newCartItems = [...cartItems];
      cartItems[cartIndex].productCount = 0;
      cartItems[cartIndex].isMaxStock = true;
      cartItems[cartIndex].error = 246;
      cartItems[cartIndex].errorData = undefined;
      dispatch({
        type: "set",
        value: {
          ...defaultCartDispatchAction.value,
          cartItems: cartItems,
        }
      })
      newCartItems.splice(cartIndex, 1);
      localStorage.setItem("cart", JSON.stringify(newCartItems));
      callBack(246)
      return;
    } else if (r.stock <= cartItems[cartIndex].productCount) {
      if (r.stock < cartItems[cartIndex].productCount) {
        const oldStock = cartItems[cartIndex].productCount;
        cartItems[cartIndex].productCount = r.stock;
        localStorage.setItem("cart", JSON.stringify(cartItems));
        cartItems[cartIndex].errorData = {
          newStock: r.stock,
          oldStock: oldStock
        };
        cartItems[cartIndex].isMaxStock = true;
        cartItems[cartIndex].productCount = r.stock;
        cartItems[cartIndex].error = 245;
      } else {
        cartItems[cartIndex].isMaxStock = true;
      }
      dispatch({
        type: "set",
        value: {
          ...defaultCartDispatchAction.value,
          cartItems: cartItems,
        }
      })
      callBack(245);
    } else {
      cartItems[cartIndex].productCount = cartItems[cartIndex].productCount + 1;
      cartItems[cartIndex].error = undefined;
      cartItems[cartIndex].errorData = undefined;
      localStorage.setItem("cart", JSON.stringify(cartItems));
      dispatch({
        type: "set",
        value: {
          ...defaultCartDispatchAction.value,
          cartItems: cartItems,
        }
      })
      callBack(200);
    }

  })

}
export function localDeleteCartDispatch(
  dispatch: Dispatch<CartDispatchAction>,
  cartIndex: number,
  callBack: (status: number) => any,
) {
  let cartItems: Cart[] = JSON.parse(localStorage.getItem("cart")!);
  cartItems.splice(cartIndex, 1);
  localStorage.setItem("cart", JSON.stringify(cartItems));
  dispatch({
    type: "set",
    value: {
      ...defaultCartDispatchAction.value,
      cartItems: cartItems,
    },
  })
  callBack(200);
}
export const CartContext = createContext<CartReducerState>({
  totalPrice: 0,
  cartItems: [],
  error: undefined,
});

export const CartDispatchContext = createContext<Dispatch<CartDispatchAction>>(
  () => { },
);

export function useCartDispatcher() {
  return useContext(CartDispatchContext);
}
