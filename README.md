# Bulk Processor

A simple and efficient bulk processor with size and timeout control, powered by `lodash`'s throttle function. This package helps you process items in batches, improving performance and reducing the load on resources when dealing with large datasets or asynchronous operations.

## Features

- **Batching:** Groups items into batches of a configurable size.
- **Throttling:** Executes batches with a configurable time interval to avoid overloading resources.
- **Asynchronous:** Supports asynchronous processing of batches.
- **Flexible:** Highly customizable for various use cases.
- **Simple API:** Easy to integrate into your projects.

## Installation

Install the package using npm:

```bash
npm install bulk-processor
```

## Usage

Here's a simple example of how to use the bulk processor:

```javascript
const { BulkProcessor } = require('bulk-processor');

// Example batch processing function
async function processBatch(batch) {
  console.log('Processing batch:', batch);
  // Simulate some asynchronous work
  await new Promise((resolve) => setTimeout(resolve, 100));
}

// Create a bulk processor with a batch size of 5 and a 500ms timeout
const processor = BulkProcessor(5, 500, processBatch);

// Push some items into the batch
for (let i = 0; i < 20; i++) {
  processor.push(i);
}

// Flush remaining items and log the total processed count after 1 second
setTimeout(async () => {
  await processor.flush();
}, 1000);
```

## API

### `BulkProcessor(size, timeout, batchFunc)`

Creates a new bulk processor instance.

- **`size`**: `number` - The maximum size of a batch.
- **`timeout`**: `number` - The minimum time interval in milliseconds between batch executions.
- **`batchFunc`**: `async function` - The function to call with each batch. This function receives the batch as a single argument (an array of items).

### `push(item)`

Adds an item to the current batch. If the batch reaches the maximum size, it will be flushed, or if a timeout expires, it also will be flushed.

- **`item`**: `any` - The item to add to the batch.

### `flush()`

Forces the current batch to be processed immediately. If you don't call `flush()` manually, the final batch might not be processed. This method returns a `Promise` which resolves when the batch is processed.

- **Returns**: `Promise`

## Examples

### Basic Usage

This example shows the basic usage of the processor with the default configuration.

```javascript
const { BulkProcessor } = require('bulk-processor');

async function processBatch(batch) {
  console.log('Processing batch:', batch);
  await new Promise((resolve) => setTimeout(resolve, 100));
}

const processor = BulkProcessor(3, 200, processBatch);

for (let i = 0; i < 10; i++) {
  processor.push(i);
}
```

### Using Different Batch Sizes and Timeouts

This example demonstrates how to customize the batch size and timeout.

```javascript
const { BulkProcessor } = require('bulk-processor');

async function processBatch(batch) {
  console.log('Processing batch:', batch);
  await new Promise((resolve) => setTimeout(resolve, 50));
}

const processor = BulkProcessor(10, 1000, processBatch); // Batch size 10, timeout 1 second

for (let i = 0; i < 30; i++) {
  processor.push(i);
}

// If you want to flush immediately even when there is data in batch
setTimeout(async () => {
  await processor.flush();
}, 1000);
```

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License.

## Changelog

### v1.0.0

- Initial Release

