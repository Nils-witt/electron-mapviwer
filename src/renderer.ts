import './index.css';
import 'leaflet/dist/leaflet.css';
import {Control, Map as LeafletMap, TileLayer} from "leaflet";


const map = new LeafletMap("map");

map.setView([50.722818, 7.14545], 13);


const layersControl = new Control.Layers();

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
layersControl.addTo(map);


// @ts-ignore
window.bridge.sendBaseLayer((event, layers: { name: string; path: string; }[]) => {
    console.log(layers);
    let first = true;
    layers.forEach((layerInfo) => {
        const layer = new TileLayer(`my-protocol://${layerInfo.path}`);
        layersControl.addBaseLayer(layer, layerInfo.name);
        if (first){
            layer.addTo(map);
            first = false;
        }
    });
});
// @ts-ignore
window.bridge.sendOverlayLayer((event, layers: { name: string; path: string; }[]) => {
    console.log(layers);
    layers.forEach((layerInfo) => {
        const layer = new TileLayer(`my-protocol://${layerInfo.path}`);
        layersControl.addOverlay(layer, layerInfo.name);
    });
});

// @ts-ignore
window.bridge.sendMessage((event, message: any) => {
    console.log(message);
});