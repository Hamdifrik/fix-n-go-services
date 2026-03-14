import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const helperIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="background: hsl(var(--primary)); width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const clientIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="background: hsl(var(--secondary)); width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

interface ServiceLocation {
  id: string;
  title: string;
  price: number;
  category: string;
  lat: number;
  lng: number;
  helperName: string;
  distance?: number;
}

interface ServiceMapProps {
  services: ServiceLocation[];
  clientLocation?: { lat: number; lng: number } | null;
  onServiceClick?: (serviceId: string) => void;
  className?: string;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const ServiceMap = ({ services, clientLocation, onServiceClick, className }: ServiceMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const center: [number, number] = clientLocation 
      ? [clientLocation.lat, clientLocation.lng] 
      : [48.8566, 2.3522]; // Paris default

    const map = L.map(mapRef.current, {
      center,
      zoom: 12,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 18,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // Add client marker
    if (clientLocation) {
      L.marker([clientLocation.lat, clientLocation.lng], { icon: clientIcon })
        .addTo(map)
        .bindPopup('<strong>📍 Votre position</strong>')
        .openPopup();
    }

    // Add service markers
    const bounds: [number, number][] = [];
    if (clientLocation) bounds.push([clientLocation.lat, clientLocation.lng]);

    services.forEach((service) => {
      const dist = clientLocation 
        ? calculateDistance(clientLocation.lat, clientLocation.lng, service.lat, service.lng)
        : null;

      const marker = L.marker([service.lat, service.lng], { icon: helperIcon })
        .addTo(map)
        .bindPopup(`
          <div style="min-width: 180px; font-family: system-ui;">
            <h3 style="font-weight: 600; margin: 0 0 4px; font-size: 14px;">${service.title}</h3>
            <p style="color: #666; margin: 0 0 4px; font-size: 12px;">👤 ${service.helperName}</p>
            <p style="font-weight: 700; color: hsl(142 71% 45%); margin: 0 0 4px; font-size: 14px;">${service.price}€</p>
            ${dist ? `<p style="color: #666; margin: 0; font-size: 12px;">📏 ${dist.toFixed(1)} km</p>` : ''}
          </div>
        `);

      if (onServiceClick) {
        marker.on('click', () => onServiceClick(service.id));
      }

      // Draw line from client to service
      if (clientLocation) {
        const line = L.polyline(
          [[clientLocation.lat, clientLocation.lng], [service.lat, service.lng]],
          { 
            color: 'hsl(221 83% 53%)', 
            weight: 2, 
            opacity: 0.4, 
            dashArray: '8, 8' 
          }
        ).addTo(map);

        // Distance label on midpoint
        const midLat = (clientLocation.lat + service.lat) / 2;
        const midLng = (clientLocation.lng + service.lng) / 2;
        L.marker([midLat, midLng], {
          icon: L.divIcon({
            className: 'distance-label',
            html: `<div style="background: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; box-shadow: 0 1px 4px rgba(0,0,0,0.2); white-space: nowrap; color: hsl(221 83% 53%);">${dist?.toFixed(1)} km</div>`,
            iconSize: [60, 20],
            iconAnchor: [30, 10],
          }),
        }).addTo(map);
      }

      bounds.push([service.lat, service.lng]);
    });

    if (bounds.length > 1) {
      map.fitBounds(bounds as L.LatLngBoundsExpression, { padding: [50, 50] });
    } else if (bounds.length === 1) {
      map.setView(bounds[0] as L.LatLngExpression, 13);
    }
  }, [services, clientLocation, onServiceClick]);

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full rounded-2xl" style={{ minHeight: '400px' }} />
    </div>
  );
};

// Hook to get client location
export const useClientLocation = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('La géolocalisation n\'est pas supportée par votre navigateur');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError('Impossible d\'obtenir votre position. Veuillez autoriser la géolocalisation.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return { location, loading, error, requestLocation };
};

// Location picker component for helpers when creating/editing service
interface LocationPickerProps {
  value?: { lat: number; lng: number } | null;
  onChange: (location: { lat: number; lng: number; address?: string }) => void;
  className?: string;
}

export const LocationPicker = ({ value, onChange, className }: LocationPickerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [address, setAddress] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const center: [number, number] = value 
      ? [value.lat, value.lng] 
      : [48.8566, 2.3522];

    const map = L.map(mapRef.current, {
      center,
      zoom: value ? 15 : 12,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 18,
    }).addTo(map);

    if (value) {
      const marker = L.marker([value.lat, value.lng], { icon: defaultIcon, draggable: true }).addTo(map);
      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        onChange({ lat: pos.lat, lng: pos.lng });
      });
      markerRef.current = marker;
    }

    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        const marker = L.marker([lat, lng], { icon: defaultIcon, draggable: true }).addTo(map);
        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          onChange({ lat: pos.lat, lng: pos.lng });
        });
        markerRef.current = marker;
      }
      onChange({ lat, lng });
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const handleSearchAddress = async () => {
    if (!address.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lon);
        
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latNum, lngNum], 15);
          if (markerRef.current) {
            markerRef.current.setLatLng([latNum, lngNum]);
          } else {
            const marker = L.marker([latNum, lngNum], { icon: defaultIcon, draggable: true }).addTo(mapInstanceRef.current);
            marker.on('dragend', () => {
              const pos = marker.getLatLng();
              onChange({ lat: pos.lat, lng: pos.lng });
            });
            markerRef.current = marker;
          }
        }
        onChange({ lat: latNum, lng: lngNum, address: data[0].display_name });
      }
    } catch (err) {
      console.error('Geocoding error:', err);
    }
    setSearching(false);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lng], 15);
          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          } else {
            const marker = L.marker([lat, lng], { icon: defaultIcon, draggable: true }).addTo(mapInstanceRef.current!);
            marker.on('dragend', () => {
              const p = marker.getLatLng();
              onChange({ lat: p.lat, lng: p.lng });
            });
            markerRef.current = marker;
          }
        }
        onChange({ lat, lng });
      },
      () => {},
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className={className}>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Rechercher une adresse..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchAddress())}
          className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <Button type="button" variant="outline" size="sm" onClick={handleSearchAddress} disabled={searching}>
          <MapPin className="w-4 h-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={handleUseMyLocation} title="Ma position">
          <Navigation className="w-4 h-4" />
        </Button>
      </div>
      <div ref={mapRef} className="w-full rounded-xl border border-border overflow-hidden" style={{ height: '280px' }} />
      <p className="text-xs text-muted-foreground mt-2">
        Cliquez sur la carte ou cherchez une adresse pour définir la localisation
      </p>
    </div>
  );
};

export default ServiceMap;
