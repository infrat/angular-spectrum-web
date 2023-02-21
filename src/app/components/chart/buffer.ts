export type DataOrigin = 'background' | 'spectrum';
export type DataBuffer = {
    background: Array<any>,
    spectrum: Array<any>
}
export const BufferMapping = {
    'background': 1,
    'spectrum': 0
}