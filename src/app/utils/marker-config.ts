import * as L from 'leaflet';

export const configureMarkerIconOptions = () => {
  const iconDefault = L.icon({
    iconRetinaUrl: 'assets/marker_images/marker-icon-2x.png',
    iconUrl: 'assets/marker_images/marker-icon.png',
    shadowUrl: 'assets/marker_images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
  });
  L.Marker.prototype.options.icon = iconDefault;
};