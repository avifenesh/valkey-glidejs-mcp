# Glide API Validation Tracking

This document tracks verification that every referenced Valkey Glide client method in the source tree matches a real method extracted from the installed `@valkey/valkey-glide` package.

## Inventory Summary

- Extracted methods (all files): 294
- Inventory file: `glide-api-inventory.json`
- Scan output: `glide-usage-scan.json`

## Scanning Approach

1. Extract `.d.ts` method signatures from `node_modules/@valkey/valkey-glide/build-ts/*`.
2. AST scan `src/**/*.ts` for `this.client.<method>(...)` (case-insensitive on `client` identifier part, property name exact).
3. Classify each discovered method against extracted inventory.
4. Flag unknowns for review.

> NOTE: Current scanner focuses on direct property access off an identifier containing `client`. If additional wrapper abstractions or dynamic dispatch patterns are added (e.g., bracket access `this.client[cmd]`), extend the scanner accordingly.

## Per-File Status

| File                                               | Valid Methods                                    | Unknown Methods | Status      | Notes |
| -------------------------------------------------- | ------------------------------------------------ | --------------- | ----------- | ----- |
| tools/enhanced/system-tools/health-diagnostics.ts  | `configGet`, `del`, `get`, `info`, `ping`, `set` | _(none)_        | ✅ Verified |       |
| tools/enhanced/system-tools/performance-metrics.ts | `info`, `ping`                                   | _(none)_        | ✅ Verified |       |

## Totals

- Files with Glide usage: 2
- Total unique referenced methods: 6
- Unknown methods: 0

## Result

All currently detected client method usages correspond to real extracted Glide API methods. No hallucinated or non-existent APIs were found in the scanned patterns.

## Next Steps (Optional Enhancements)

- Expand scanner to catch: additional local client variable usages (e.g., `await myClient.get(...)`).
- Include cluster / JSON / FT specialized modules if used via separate instances.
- Add CI script step: run extraction + scan; fail if any unknown methods discovered.
- Enhance inventory to capture parameter lists for stricter arity validation.

---

_Last updated: automated scan on current commit._
