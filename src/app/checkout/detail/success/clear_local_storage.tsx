"use client";
import { useEffect } from "react";

export default function ClearLocalStorage(){

    useEffect(()=>{
         localStorage.setItem("cart","");
    },[])

    return(<div>
        
    </div>)
}