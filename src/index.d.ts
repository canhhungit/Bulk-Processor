export interface BulkProcessorOptions {
  size: number;
  timeout: number;
  batchFunc: (items: any[]) => Promise<void>;
}

export declare function BulkProcessor(
  size: number,
  timeout: number,
  batchFunc: (items: any[]) => Promise<void>
): {
  push(item: any): void;
  flush(): Promise<void>;
};
