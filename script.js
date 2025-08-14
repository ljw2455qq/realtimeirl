(function(){
  const params = new URLSearchParams(location.search);
  const lang = params.get("lang") || "ko";
  const initZoom = Number(params.get("zoom") || 15);
  const weatherKey = params.get("owmKey") || ""; // OpenWeather API Key (옵션)
  const mapStyle = params.get("style") || "mapbox/streets-v11";
  const follow = params.get("follow") !== "0";
  const drawLine = params.get("path") !== "0";

  // Map init
  mapboxgl.accessToken = window.pk.eyJ1IjoiaG9vbmNvbSIsImEiOiJjbWNjM3R4enUwM3pnMmlxMWJvZTVrMWIzIn0.h_-BNK4FuriEfFWXvE1pmw;
const map = new mapboxgl.Map({
    container: 'map', // HTML div id
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [126.9780, 37.5665], // 초기 좌표 (서울 시청)
    zoom: 14,
    dragPan: true,       // 마우스 드래그로 지도 이동 허용
    scrollZoom: true,    // 마우스 휠로 확대/축소 허용
    doubleClickZoom: true, // 더블클릭 확대 허용
    keyboard: true       // 키보드 화살표로 지도 이동
});

  let last = null;     // {lng, lat, ts}
  let totalKm = 0;
  let lastSpeed = 0;
  let lastWeatherTs = 0;

  // 날짜별/driver별 누적거리 저장 키
  const storageKey = `dist:${window.DRIVER_ID}:${new Date().toISOString().slice(0,10)}`;
  const saved = Number(localStorage.getItem(storageKey) || "0");
  if (!isNaN(saved)) totalKm = saved;

  const $clock = document.getElementById("clock");
  const $distance = document.getElementById("distance");
  const $speed = document.getElementById("speed");
  const $weather = document.getElementById("weather");

  function fmt(n, d=2){ return (Math.round(n*10**d)/10**d).toFixed(d); }
  function tickClock(){
    const now = new Date();
    const hh = String(now.getHours()).padStart(2,'0');
    const mm = String(now.getMinutes()).padStart(2,'0');
    const ss = String(now.getSeconds()).padStart(2,'0');
    $clock.textContent = `${hh}:${mm}:${ss}`;
  }
  setInterval(tickClock, 1000); tickClock();

  // 경로 라인
  let coords = [];
  map.on("load", () => {
    map.addSource("track", {
      type: "geojson",
      data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: coords } }
    });
    map.addLayer({
      id: "track-line",
      type: "line",
      source: "track",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: { "line-color": "#00FFFF", "line-width": 4, "line-opacity": 0.9 }
    });
  });
  function updatePath(){
    if (!drawLine) return;
    const src = map.getSource("track");
    if (!src) return;
    src.setData({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: coords } });
  }
  function updateHUD(){
    $distance.textContent = `${fmt(totalKm,2)} km`;
    $speed.textContent = `${fmt(lastSpeed,1)} km/h`;
  }

  function calcDistanceKm(a, b){
    const from = turf.point([a.lng, a.lat]);
    const to = turf.point([b.lng, b.lat]);
    return turf.distance(from, to, { units: "kilometers" });
  }

  async function updateWeather(lng, lat){
    if (!weatherKey) return;
    const now = Date.now();
    if (now - lastWeatherTs < 120000) return; // 2분 간격
    lastWeatherTs = now;
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&lang=${lang}&appid=${weatherKey}`;
      const r = await fetch(url);
      const j = await r.json();
      const desc = j.weather && j.weather[0] ? j.weather[0].description : "";
      const t = j.main && typeof j.main.temp !== "undefined" ? `${Math.round(j.main.temp)}°C` : "";
      $weather.textContent = `${desc} ${t}`.trim() || "-";
    } catch(e){ $weather.textContent = "-"; }
  }

  function onLocation(v){
    if (!v || typeof v.lat !== "number" || typeof v.lon !== "number") return;
    const cur = { lng: v.lon, lat: v.lat, ts: v.ts || Date.now() };

    if (follow) map.easeTo({ center: [cur.lng, cur.lat], duration: 600 });

    if (last){
      let d = calcDistanceKm(last, cur);
      // 3m 미만 무시 (드리프트 제거)
      if (d < 0.003) d = 0;
      const dtH = Math.max((cur.ts - last.ts)/3600000, 1e-6);
      const spd = d / dtH;
      if (spd < 200){ // 비현실 속도 컷
        totalKm += d;
        lastSpeed = spd;
        localStorage.setItem(storageKey, String(totalKm));
        coords.push([cur.lng, cur.lat]);
        if (coords.length > 5000) coords = coords.slice(-2000);
        updatePath();
        updateHUD();
      }
    } else {
      coords.push([cur.lng, cur.lat]);
      updatePath();
    }
    last = cur;
    updateWeather(cur.lng, cur.lat);
  }

  // Firebase 구독
  const ref = window.db.ref(window.DB_PATH);
  ref.on("value", snap => {
    const v = snap.val();
    onLocation(v);
  });

  updateHUD();
})();
