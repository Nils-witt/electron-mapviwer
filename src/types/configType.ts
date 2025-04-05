import * as fs from "node:fs";

export class Config {
    overlays: { name: string; path: string }[] = [];
    maps: { name: string; path: string }[] = [];
    mapCenter: [number, number] = [0, 0];


    saveToFile(path: string) {
        fs.writeFileSync(path, JSON.stringify({
            overlays: this.overlays,
            maps: this.maps,
            mapCenter: this.mapCenter
        }));
    }

    loadFromFile(path: string) {
        const data = fs.readFileSync(path).toString();
        const json = JSON.parse(data);
        this.overlays = json.overlays;
        this.maps = json.maps;
    }
}