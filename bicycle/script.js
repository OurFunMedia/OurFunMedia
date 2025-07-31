// 使用 'DOMContentLoaded' 事件確保在執行腳本前，整個 HTML 文件已完全載入並解析。
// 這是一個良好的開發習慣，可以避免因腳本在 DOM 元素建立前執行而導致的錯誤。
document.addEventListener('DOMContentLoaded', function () {

    // ========================================
    // 1. 地圖初始化 (Map Initialization)
    // ========================================
    // 初始化 Leaflet 地圖，並將其附加到 id 為 'map' 的 div 容器中。
    // setView 方法設定地圖的初始中心點 (香港的地理中心) 和縮放級別。
    // 縮放級別 11 大致可以將整個香港納入視野。
    const map = L.map('map').setView([22.3964, 114.1095], 11);


    // ========================================
    // 2. 定義基礎圖層 (Base Tile Layers)
    // ========================================
    // 我們將提供兩種不同的地圖樣式供使用者選擇。

    // 圖層 A: CyclOSM - 專為單車優化的地圖圖層
    // 這個圖層會特別突顯單車徑和相關設施，是我們的首選預設圖層。
    const cyclOSM = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Tiles: &copy; <a href="https://www.cyclosm.org">CyclOSM</a>'
    });

    // 圖層 B: OpenStreetMap (Standard) - 標準的開放街道地圖
    // 提供一個更通用、傳統的地圖外觀作為備用選項。
    const osmStandard = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    
    // 將預設的 CyclOSM 圖層添加到地圖上。
    cyclOSM.addTo(map);


    // ========================================
    // 3. 載入並渲染地理數據 (Loading & Rendering GeoJSON Data)
    // ========================================
    // 我們使用 Promise.all 來並行異步加載兩個 GeoJSON 檔案，以提升載入效率。

    Promise.all([
        fetch('cycle_routes.geojson'),
        fetch('pois.geojson')
    ])
    .then(responses => Promise.all(responses.map(res => res.json()))) // 將所有回應轉換為 JSON
    .then(([routesData, poisData]) => {
        
        // --- 渲染單車徑路線 ---
        const routesLayer = L.geoJSON(routesData, {
            style: function (feature) {
                // 為單車徑設定鮮明的橙色樣式，使其在地圖上清晰可見。
                return {
                    color: "#ff7800",
                    weight: 5,
                    opacity: 0.85
                };
            },
            onEachFeature: function (feature, layer) {
                // 如果 GeoJSON 的 properties 中有名稱 (name) 屬性，就為其綁定一個彈出視窗。
                if (feature.properties && feature.properties.name) {
                    layer.bindPopup(`<h3>${feature.properties.name}</h3>`);
                }
            }
        }).addTo(map); // 直接將路線圖層添加到地圖

        // --- 渲染興趣點 (POIs) 並使用 MarkerCluster ---
        // 初始化 MarkerClusterGroup，這是處理大量標記的關鍵。
        const poisLayer = L.markerClusterGroup({
            // 調整一些選項讓聚合效果更佳
            chunkedLoading: true, // 啟用分塊載入，提升性能
            maxClusterRadius: 60  // 聚合半徑，數值越小，越早散開
        });

        const poisGeoJsonLayer = L.geoJSON(poisData, {
            onEachFeature: function (feature, layer) {
                // 為每個 POI 綁定彈出視窗，顯示其名稱。
                // 這裡的 'name' 屬性需要與您在 pois.geojson 中定義的屬性鍵名一致。
                if (feature.properties && feature.properties.name) {
                    layer.bindPopup(`<b>${feature.properties.name}</b>`);
                }
            }
        });
        
        // 將 POIs 的 GeoJSON 圖層添加到聚合圖層中，而不是直接添加到地圖。
        poisLayer.addLayer(poisGeoJsonLayer);
        map.addLayer(poisLayer); // 最後將整個聚合圖層添加到地圖。

        // ========================================
        // 4. 新增圖層控制器 (Add Layer Control)
        // ========================================
        // 讓使用者可以自由切換基礎地圖和開關數據圖層。
        
        const baseLayers = {
            "單車地圖 (CyclOSM)": cyclOSM,
            "標準地圖 (Standard)": osmStandard
        };

        const overlayLayers = {
            "單車徑路線": routesLayer,
            "沿途設施 (POI)": poisLayer
        };

        // 創建圖層控制器並添加到地圖的右上角。
        L.control.layers(baseLayers, overlayLayers, { position: 'topright' }).addTo(map);

    })
    .catch(error => {
        // 如果數據載入失敗，在控制台打印錯誤信息，方便除錯。
        console.error('無法載入地理數據:', error);
        alert('抱歉，無法載入地圖數據，請稍後再試。');
    });

});
