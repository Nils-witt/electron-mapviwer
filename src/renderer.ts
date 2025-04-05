import './index.css';
import 'leaflet/dist/leaflet.css';
import {Control, Map as LeafletMap, TileLayer} from "leaflet";
import {Config} from "./types/configType";


const map = new LeafletMap("map");

map.setView([50.722818, 7.14545], 13);


const layersControl = new Control.Layers();

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
layersControl.addTo(map);


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.bridge.sendConfig((event, config: Config) => {
    console.log('Received config', config);
    
    for (const mapInfo of config.maps) {
        const layer = new TileLayer(`my-protocol://${mapInfo.path}`);
        layersControl.addBaseLayer(layer, mapInfo.name);
        layer.addTo(map);
    }    
    for (const mapInfo of config.overlays) {
        const layer = new TileLayer(`my-protocol://${mapInfo.path}`);
        layersControl.addOverlay(layer, mapInfo.name);
        layer.addTo(map);
    }
});