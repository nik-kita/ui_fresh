import { createMachine } from "npm:xstate";

export const dog = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QQPZQHQHcCGBLALrgHZQDEAMgKICCAapQPoASA8gLKUDaADALqKgADilgFcKIgJAAPRAEYAbABZ03NWoCsADi0alATgDs+gMwAaEAE9EWueg3q5AJhMKn3W9yUBfbxdQYOGIkpNQASmEAkvTM7Fx8UsKihBJSsgiKKuqaOnpGphbWGSZOqupOGnImcjXcGgq+-mhY2AA2ANYtHcRkAMoACpSUACIMAKr9PPxIIEliqTPpTkpZ2dq6BsbmVoiGCgplaobaak5a3E6NIAFdnTjdIb0AKiyTCTNzKZKLiMur6us8ltCogNPoVMdNPslApDCYwVcbvdOgAnACuRCIPVIvTGw2GlAAcgxnq8pokRPNvqB0hoTCZ0IY5Fo9hp6nJjHIlCCEEyNPZ1AoTNxqhVuA0-Ndmsj0OjMdjeuQWAB1BjDFWE8kfSlfNK-FaHHIbfLbIp8gVqIUi5wOCVNQJtTqwfAoQSCHoMF0MWBYgBmvoYUBQKAg3oAtmBWq1YDi8QTiQMhqMJlqhDrxNSZKD6Yzmaz2ZzuTteftDcdzhdzpdJUjHehna73SRPShvX6A0GQ+HI9GcYMRuM3tM08kM3qEAoReh9HS5NolLo3HUeUpDP86hc3E4nM5fJKiCG4FIAhTRwsaYgALQKHnXxHSvCEEinqnjpROHk6dBKRQKUzGOktCUEx9HvB0OhfXUfgQAweRMLQDgcNQTGMNQuW4OQwNuW4ekgsdoKMFddHsJCFEUPY1H0TCawfDpZQxLFn21M9M3SJRxVzFkwVhNxTDpHlDGWVQtBMH8alFdxDCwmUGzdD0vR9XB-UDYNQ1gCMo3gZjX2g447H0HctH0BDKicP8P2LSduHQKzuDhDx8ikmjwPaBgAGMUDDQRWjAfAwDw88swQDRDE-eoLQ8RdTG4Iw928IA */
  id: "dog",
  initial: "waiting",
  states: {
    waiting: {
      on: {
        LEAVE_HOME: {
          target: "#dog.walk",
        },
        ARRIVE_HOME: {
          target: "#dog.walk_complete",
        },
      },
    },
    walk: {
      initial: "walking",
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
