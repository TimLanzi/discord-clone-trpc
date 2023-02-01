/*
Tim Lanzi
September 2021

Taken from this YouTube video: https://www.youtube.com/watch?v=0c6znExIqRw&t=0s
*/

import { DependencyList, EffectCallback, useEffect } from "react";
import { useTimeout } from "./useTimeout"

export const useDebounce = (
  callback: EffectCallback,
  delay: number,
  dependencies: DependencyList,
) => {
  const { reset, clear } = useTimeout(callback, delay);
  useEffect(reset, [...dependencies, reset]);
  useEffect(clear, []);
}