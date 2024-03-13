import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { camelize, getCurrentInstance, toHandlerKey } from "vue";

type AnyFunction = (...args: any[]) => any;

function debounce(fn: AnyFunction, wait: number): AnyFunction {
  let timer: ReturnType<typeof setTimeout>;

  return function (this: any, ...args: any[]) {
    if (timer) {
      clearTimeout(timer); // clear any pre-existing timer
    }
    const context = this; // get the current context
    timer = setTimeout(() => {
      fn.apply(context, args); // call the function if time expires
    }, wait);
  };
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { debounce };
