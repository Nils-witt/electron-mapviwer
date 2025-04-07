import './index.css';
import 'leaflet/dist/leaflet.css';
import {Control, Map as LeafletMap, TileLayer} from "leaflet";
import {Config} from "./types/configType";


const map = new LeafletMap("map");

map.setView([50.722818, 7.14545], 13);
map.setMaxZoom(22);

const layersControl = new Control.Layers({},{},{
    autoZIndex: false, 
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
layersControl.addTo(map);


const osm_online = new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxNativeZoom: 19,
    maxZoom: 21,
});
layersControl.addBaseLayer(osm_online, 'OSM Online');
osm_online.addTo(map);


const loadedMaps: string[] = []


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.bridge.sendConfig((event, config: Config) => {
    console.log('Received config', config);
    let firstBaseLayer = true;

    for (const mapInfo of config.maps) {
        console.log('MapInfo', mapInfo);
        if (loadedMaps.includes(mapInfo.name)) {
            continue;
        }else {
            loadedMaps.push(mapInfo.name);
        }
        
        if (mapInfo.path) {
            const layer = new TileLayer(`my-protocol://${mapInfo.path}`);
            if (mapInfo.type == 'overlay') {
                layersControl.addOverlay(layer, mapInfo.name);
            } else {
                layersControl.addBaseLayer(layer, mapInfo.name);
                if (firstBaseLayer) {
                    layer.addTo(map);
                    firstBaseLayer = false;
                }
            }
        } else if (mapInfo.url) {
            const layer = new TileLayer(mapInfo.url);
            if (mapInfo.type == 'overlay') {
                layersControl.addOverlay(layer, mapInfo.name);
            } else {
                layersControl.addBaseLayer(layer, mapInfo.name);
                if (firstBaseLayer) {
                    layer.addTo(map);
                    firstBaseLayer = false;
                }
            }
        }
    }
});