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

  // Track handlers for cleanup
  const handlers = {};

  const instance = {
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
     * Gracefully flush remaining items before shutdown
     * @returns {Promise<void>}
     */
    async gracefulShutdown() {
      try {
        if (batch.length > 0) {
          const tmp = batch;
          batch = [];
          await batchFunc(tmp);
          console.log(
            '[BulkProcessor] Flushed remaining batch before shutdown.',
          );
        } else {
          await throttledFunc.flush();
        }
      } catch (err) {
        console.error('[BulkProcessor] Error flushing before shutdown:', err);
      }
    },

    /**
     * Cleanup event listeners and stop the processor
     */
    destroy() {
      throttledFunc.cancel();
      if (handlers.SIGINT) process.removeListener('SIGINT', handlers.SIGINT);
      if (handlers.SIGTERM) process.removeListener('SIGTERM', handlers.SIGTERM);
      if (handlers.beforeExit)
        process.removeListener('beforeExit', handlers.beforeExit);
    },
  };

  // Auto flush on system signals
  const setupGracefulShutdown = () => {
    handlers.SIGINT = async () => {
      console.log(
        '[BulkProcessor] Received SIGINT, flushing remaining items...',
      );
      await instance.gracefulShutdown();
    };

    handlers.SIGTERM = async () => {
      console.log(
        '[BulkProcessor] Received SIGTERM, flushing remaining items...',
      );
      await instance.gracefulShutdown();
    };

    handlers.beforeExit = async () => {
      await instance.gracefulShutdown();
    };

    process.once('SIGINT', handlers.SIGINT);
    process.once('SIGTERM', handlers.SIGTERM);
    process.on('beforeExit', handlers.beforeExit);
  };

  setupGracefulShutdown();

  return instance;
};

module.exports = {
  BulkProcessor,
};
