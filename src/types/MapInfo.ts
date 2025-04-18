export enum MapType {
    MAP = 'map',
    OVERLAY = 'overlay',
}

export type MapInfo = {
    name: string;
    url?: string;
    path?: string;
    type: MapType;
    z?: number;
}