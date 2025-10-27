const { BulkProcessor } = require('../src/index');

jest.useFakeTimers();

describe('BulkProcessor', () => {
  let batchFunc;

  beforeEach(() => {
    batchFunc = jest.fn().mockResolvedValue();
  });

  test('should call batchFunc when batch is full', async () => {
    const processor = BulkProcessor(3, 1000, batchFunc);

    processor.push(1);
    processor.push(2);
    processor.push(3); // batch full → flush ngay

    expect(batchFunc).toHaveBeenCalledTimes(1);
    expect(batchFunc).toHaveBeenCalledWith([1, 2, 3]);
  });

  test('should call batchFunc after timeout when batch not full', async () => {
    const processor = BulkProcessor(5, 1000, batchFunc);

    processor.push(1);
    processor.push(2);

    jest.advanceTimersByTime(1000); // chạy thời gian giả lập

    expect(batchFunc).toHaveBeenCalledTimes(1);
    expect(batchFunc).toHaveBeenCalledWith([1, 2]);
  });

  test('should reset batch after each execution', async () => {
    const processor = BulkProcessor(2, 1000, batchFunc);

    processor.push('a');
    processor.push('b'); // full → gọi batchFunc
    processor.push('c');
    processor.push('d'); // full → gọi lần 2

    expect(batchFunc).toHaveBeenCalledTimes(2);
    expect(batchFunc).toHaveBeenNthCalledWith(1, ['a', 'b']);
    expect(batchFunc).toHaveBeenNthCalledWith(2, ['c', 'd']);
  });

  test('should flush manually', async () => {
    const processor = BulkProcessor(10, 1000, batchFunc);

    processor.push('x');
    await processor.flush();

    expect(batchFunc).toHaveBeenCalledTimes(1);
  });

  test('should throttle multiple pushes', async () => {
    const processor = BulkProcessor(10, 2000, batchFunc);

    for (let i = 0; i < 5; i++) processor.push(i);

    jest.advanceTimersByTime(2000);

    expect(batchFunc).toHaveBeenCalledWith([0, 1, 2, 3, 4]);
  });
});
