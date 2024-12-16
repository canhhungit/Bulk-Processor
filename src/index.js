const _ = require('lodash');

/**
 * Class representing a batch executor
 * @param {number} size - The maximum size of a batch.
 * @param {number} timeout - The timeout in milliseconds.
 * @param {function} batchFunc - The function to be called with the batch.
 * @returns {object} - An object with push, flush, and getCounter functions.
 */
module.exports = function (size, timeout, batchFunc) {
  let batch = [];
  let counter = 0;

  // Create an executor function
  const execBatchFunc = async () => {
    // Reset the batch
    const tmp = batch;
    batch = [];

    // Process the batch
    await batchFunc(tmp);
    counter += tmp.length;
    console.log(`Processed ${tmp.length} records`);
  };

  // Create a throttled executor function
  const throttledFunc = _.throttle(execBatchFunc, timeout, {
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

    /**
     * Gets the total number of items processed so far.
     * @returns {number} - The total number of items processed.
     */
    getCounter() {
      return counter;
    },
  };
};
