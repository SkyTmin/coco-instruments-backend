declare class HistoryItemDto {
    id: number;
    scale: number;
    textHeight: number;
    timestamp: string;
}
export declare class SyncHistoryDto {
    history: HistoryItemDto[];
}
export {};
