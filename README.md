# Bulk Processor

[![npm version](https://img.shields.io/npm/v/bulk-processor.svg)](https://www.npmjs.com/package/bulk-processor) [![npm downloads](https://img.shields.io/npm/dm/bulk-processor.svg)](https://www.npmjs.com/package/bulk-processor)

A lightweight utility to process items in bulk with size and time constraints.  
Useful for batching operations such as API calls, database writes, or logging.

---

## 📦 Installation

```bash
npm install bulk-processor
# or
yarn add bulk-processor
```

---

## 🚀 Usage

### JavaScript (CommonJS)

```js
const { BulkProcessor } = require('bulk-processor');

const processor = BulkProcessor(5, 2000, async (batch) => {
  console.log('Processing batch:', batch);
});

processor.push(1);
processor.push(2);
processor.push(3);

// Flush manually if needed
await processor.flush();
```

---

### TypeScript / ESM

```ts
import { BulkProcessor } from 'bulk-processor';
const processor = BulkProcessor(5, 2000, async (batch) => {
  console.log('Processing batch:', batch);
});

processor.push(42);
processor.push(99);

await processor.flush();
```

---

## ⚙️ API

### `BulkProcessor(size, timeout, batchFunc)`

| Parameter | Type | Description |
| --- | --- | --- |
| `size` | `number` | Maximum number of items per batch |
| `timeout` | `number` | Maximum time in milliseconds before a batch is processed |
| `batchFunc` | `(items: T[]) => Promise` | Function to process a batch of items (called automatically or on flush) |

### Returns

An object with methods:

- `push(item: T): void` → Add an item to the batch
- `flush(): Promise<void>` → Immediately process current batch

---

## 📘 Example Use Cases

- Buffering API calls to avoid rate limits
- Grouping database inserts for performance
- Logging events in bulk

---

## 📄 License

MIT © [canhhungit](https://github.com/canhhungit/Bulk-Processor)

👉 [View on npm](https://www.npmjs.com/package/bulk-processor)
