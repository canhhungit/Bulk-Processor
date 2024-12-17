const throttle = require('lodash/throttle');

/**
 * Class representing a batch executor
 * @param {number} size - The maximum size of a batch.
 * @param {number} timeout - The timeout in milliseconds.
 * @param {function} batchFunc - The function to be called with the batch.
 * @returns {object} - An object with push, flush functions.
 */
const BulkProcessor = function (size, timeout, batchFunc) {
  let batch = [];

  // Create an executor function
  const execBatchFunc = async () => {
    // Reset the batch
    const tmp = batch;
    batch = [];

    // Process the batch
    await batchFunc(tmp);
  };

  // Create a throttled executor function
  const throttledFunc = throttle(execBatchFunc, timeout, {
    leading: false,
    trailing: true,
  });

  return {
    /**
     * Push item to batch
     * @param {any} item - An item to add to the batch.
     */
    push(item) {
      batch.push(item);
      if (batch.length >= size) {
        // Flush the batch when the batch is full
        this.flush();
      } else {
        // Run the throttled function when the batch is not full
        throttledFunc();
      }
    },

    /**
     * Flushes any remaining items in the batch.
     * @returns {Promise}
     */
    async flush() {
      return throttledFunc.flush();
    },
  };
};
module.exports = {
  BulkProcessor
};