import * as fs from "node:fs";
import {MapInfo} from "./MapInfo";

export class Config {
    maps: MapInfo[] = [];
    mapCenter: [number, number] = [0, 0];


    saveToFile(path: string) {
        fs.writeFileSync(path, JSON.stringify({
            maps: this.maps,
            mapCenter: this.mapCenter
        }));
    }

    loadFromFile(path: string) {
        const data = fs.readFileSync(path).toString();
        const json = JSON.parse(data);
        this.maps = json.maps;
    }
}