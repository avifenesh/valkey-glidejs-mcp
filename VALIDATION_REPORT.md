# Glide API Validation Report

- Extracted method candidates: 645
- Entries validated: 114/122

## Missing/Unvalidated Entries

- multi()...exec() -> multi, command, exec (missing: multi)
- pipeline()...exec() -> pipeline, command, exec (missing: pipeline)
- psubscribe(pattern) | punsubscribe(pattern) -> psubscribe, punsubscribe (missing: psubscribe, punsubscribe)
- subscribe(channel, listener) -> subscribe (missing: subscribe)
- jsonSet(key, path, value) -> jsonset, path, value (missing: jsonset)
- jsonGet(key, path) -> jsonget, path (missing: jsonget)
- pSubscribe | pUnsubscribe ->  (missing: -)
- pSubscribe | pUnsubscribe ->  (missing: -)