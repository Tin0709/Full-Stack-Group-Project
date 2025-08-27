/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Nguyen Trung Tin
# ID: s3988418
*/

import { useEffect, useState } from "react";
import { getCartCount, subscribeCart } from "../services/cartService";

export default function useCartCount() {
  const [count, setCount] = useState(getCartCount());

  useEffect(() => {
    const unsub = subscribeCart(() => setCount(getCartCount()));
    const onFocus = () => setCount(getCartCount()); // catch changes after tab switch
    window.addEventListener("focus", onFocus);
    return () => {
      unsub();
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return count;
}
