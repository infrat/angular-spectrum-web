import { IncomingData } from "src/app/types/data.type";

export type DataOrigin = 'background' | 'spectrum';
export type ParsedData = { x: number, y: number };
export type DataBuffer = {
    background: Array<ParsedData>,
    spectrum: Array<ParsedData>
}
export type IncomingDataBuffer = {
    background: IncomingData,
    spectrum: IncomingData
}
export const BufferMapping = {
    'background': 1,
    'spectrum': 0
}