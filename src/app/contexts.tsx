"use client";

import { ReactNode, useReducer } from "react";
import {
  IsOpenContext,
  IsOpenDispatchContext,
  isOpenReducer,
  CartContext,
  CartDispatchContext,
  cartReducer,
  CartReducerState,
} from "./cart";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next"




export default function Contexts({ children }: { children: ReactNode }) {
  const [isOpen, dispatch] = useReducer(isOpenReducer, false);

  const [cart, cartDispatch] = useReducer(cartReducer, {
    totalPrice: 0,
    cartItems: [],
    error: undefined,
  } as CartReducerState);
  
  return (
    <>
        <IsOpenContext.Provider value={isOpen}>
          <IsOpenDispatchContext.Provider value={dispatch}>
            <CartContext.Provider value={cart}>
              <CartDispatchContext.Provider value={cartDispatch}> 
                {children}
              </CartDispatchContext.Provider>
            </CartContext.Provider>
          </IsOpenDispatchContext.Provider>
        </IsOpenContext.Provider>
      <Analytics />
        <SpeedInsights/>
    </>
  );
}
