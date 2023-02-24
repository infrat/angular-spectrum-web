import { IncomingData } from "src/app/types/data.type";

export enum DataOriginEnum {
    BACKGROUND = 'background',
    SPECTRUM = 'spectrum'
}
export type DataOrigin = DataOriginEnum.BACKGROUND | DataOriginEnum.SPECTRUM;
export type ParsedData = { x: number, y: number };
export type DataBuffer = {
    [DataOriginEnum.BACKGROUND]: Array<ParsedData>,
    [DataOriginEnum.SPECTRUM]: Array<ParsedData>
}
export type IncomingDataBuffer = {
    [DataOriginEnum.BACKGROUND]: IncomingData,
    [DataOriginEnum.SPECTRUM]: IncomingData
}
export const BufferMapping = {
    [DataOriginEnum.BACKGROUND]: 1,
    [DataOriginEnum.SPECTRUM]: 0
}