// @deno-types="npm:xstate"
import { createMachine } from "https://esm.sh/xstate@4.38.3/dist/xstate.js";

export const dog = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QQPZQHQHcCGBLALrgHZQDEAMgKICCAapQPoASA8gLKUDaADALqKgADilgFcKIgJAAPRAEYAbAA50ATgDsqxau5alqgMwAmJQBoQAT0QG5AFnRHVRgKwGljo7ddKFAX1-mqBg4YiSk1ABKEQCS9MzsXHxSwqKEElKyCHLqKhpaCjp6hibmVgju6Lbctqq2SvW1znIG-oFoWNgANgDWpGzUANKMAArRozz8SCApYulTmdm5mtq6cvrGZpaIRgr2ddzcBuoGxXIu6q0gQR09N93EZADKw5SUACIMAKrDE8kis5J5ohnNx1GoFAZnDV1OpXEY7LZSsDuEYHLZ1FVquoFAodn4Ald2jhbsT7mFHgAVFg-JJTGZpQGgTIgsGqCFQjSw4wIpEIAzGdAonw1M4w3b4trBLrddAAJwArkQiA9SI9Pm83pQAHIMSnU350-4MjKITQKcG6JoeE47XleVG2Ax1VSqZwwtyuS7XUlyxXK8nkFgAdQYb2DWoNQiN4kZMmRrPZ0K58NsiK2CHtlSd+ld7qUnoJ3ul6Fg+BQgkEDwYZYYsGVADN6wwoCgUBBawBbMCdTqwVXqzU656vD7fSPTaNzJmmtkW11nJw2hS8kGozwYg7onF4r1E4ul8uVkjVlC1htNlttzvd3uql7vL40yZR1Ixk3lBRguSu4xmnYw9ReXhOR0FxIwTh8HI7BtfwCSINs4CkII-lfKc4wQABaZd0yw3cpVCKAUIBd9bCMXlDCzepDiMbEdBoi5Cz3HoiONIE+TONQlEdJRuGUJ0TDI9MznsRxaiUORQQhORnCUPC7juB4WLfNiDAUbhOO43ilH49w7XqdAfG-bTnBogxuBkuSfQVJVFMNVDY0yHFVE4xYjCMTcXQMO1Z3cdQdjsGiF0dSz9zLCsqxrOtcEbZtW3bWAux7eA7OItiJLsSpjg0cUFGyZxnDtdE0Sy2oAJdbSQp6BgAGMUA7QROjAfAwCUtDMmzBwIRRHF9HzJxeXE9BjEcbI1LWEw5Fg3wgA */
  id: "dog",
  initial: "waiting",
  states: {
    waiting: {
      on: {
        LEAVE_HOME: {
          target: "#dog.walk",
        },
      },
    },
    walk: {
      initial: "walking",
      on: {
        ARRIVE_HOME: {
          target: "#dog.walk_complete",
        },
      },
      states: {
        walking: {
          on: {
            SPEED_UP: {
              target: "#dog.walk.running",
            },
            STOP: {
              target: "#dog.walk.stopping_to_sniff_good_smells",
            },
          },
        },
        running: {
          on: {
            SUDDEN_STOP: {
              target: "#dog.walk.stopping_to_sniff_good_smells",
            },
            SLOW_DOWN: {
              target: "#dog.walk.walking",
            },
          },
        },
        stopping_to_sniff_good_smells: {
          on: {
            SUDDEN_SPEED_UP: {
              target: "#dog.walk.running",
            },
            SPEED_UP: {
              target: "#dog.walk.walking",
            },
          },
        },
      },
    },
    walk_complete: {
      type: "final",
    },
  },
  predictableActionArguments: true,
});
