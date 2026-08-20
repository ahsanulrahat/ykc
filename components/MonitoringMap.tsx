"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Project {
  id: number;
  title: string;
  location: string;
  status: "completed" | "ongoing";
  progress: number;
  lat: number;
  lng: number;
}

interface MonitoringMapProps {
  projects: Project[];
  onProjectSelect?: (id: number) => void;
}

// Create colored circle markers
function createMarkerIcon(status: "completed" | "ongoing") {
  const color = status === "completed" ? "#0e8a4a" : "#e08a1e";
  const border = status === "completed" ? "#4caf50" : "#ffb74d";

  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: ${color};
      border: 2.5px solid ${border};
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -12],
  });
}

export default function MonitoringMap({ projects, onProjectSelect }: MonitoringMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const onProjectSelectRef = useRef(onProjectSelect);

  // Keep ref in sync
  useEffect(() => {
    onProjectSelectRef.current = onProjectSelect;
  }, [onProjectSelect]);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [24.5833, 90.1667],
      zoom: 12,
      scrollWheelZoom: true,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    // Fix map sizing when it becomes visible
    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when projects change
  useEffect(() => {
    if (!markersRef.current || !mapRef.current) return;

    markersRef.current.clearLayers();

    projects.forEach((p) => {
      const marker = L.marker([p.lat, p.lng], {
        icon: createMarkerIcon(p.status),
      });

      const popupContent = document.createElement("div");
      popupContent.style.fontFamily = "'SolaimanLipi', sans-serif";
      popupContent.style.minWidth = "200px";
      popupContent.innerHTML = `
        <strong style="font-size: 13px; line-height: 1.4; display: block; margin-bottom: 6px; cursor: pointer; color: #006837;" class="popup-title">${p.title}</strong>
        <div style="font-size: 12px; color: #666; margin-bottom: 4px;">📍 ${p.location}</div>
        <div style="display: flex; align-items: center; gap: 6px; margin-top: 6px;">
          <span style="
            display: inline-block;
            padding: 2px 10px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            background: ${p.status === "completed" ? "#e8f5e9" : "#fff3e0"};
            color: ${p.status === "completed" ? "#0e8a4a" : "#e08a1e"};
          ">${p.status === "completed" ? "সম্পন্ন" : "চলমান"}</span>
          <span style="font-size: 11px; font-weight: 700;">${p.progress}%</span>
        </div>
        <button style="
          margin-top: 8px;
          padding: 4px 12px;
          border: none;
          border-radius: 4px;
          background: #006837;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
        " class="popup-detail-btn">বিস্তারিত দেখুন</button>
      `;

      // Add click handler on the detail button
      const detailBtn = popupContent.querySelector(".popup-detail-btn");
      if (detailBtn) {
        detailBtn.addEventListener("click", () => {
          if (onProjectSelectRef.current) {
            onProjectSelectRef.current(p.id);
          }
        });
      }

      // Also make the title clickable
      const titleEl = popupContent.querySelector(".popup-title");
      if (titleEl) {
        titleEl.addEventListener("click", () => {
          if (onProjectSelectRef.current) {
            onProjectSelectRef.current(p.id);
          }
        });
      }

      marker.bindPopup(popupContent);
      marker.addTo(markersRef.current!);
    });
  }, [projects]);

  return (
    <div
      ref={containerRef}
      id="monitoring-leaflet-map"
      style={{ width: "100%", height: "100%", minHeight: 520 }}
    />
  );
}
