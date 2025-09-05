export interface BulkProcessorOptions {
  size: number;
  timeout: number;
  batchFunc: (items: any[]) => Promise<void>;
}

export declare function BulkProcessor(options: BulkProcessorOptions): {
  push(item: any): void;
  flush(): Promise<void>;
};
