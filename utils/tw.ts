import { ClassValue, clsx } from "$npm:clsx";
import { twMerge } from "$npm:tw-merge";

export const tw = (...args: ClassValue[]) => twMerge(clsx(...args));
