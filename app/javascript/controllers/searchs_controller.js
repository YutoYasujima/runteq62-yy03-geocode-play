import { Controller } from "@hotwired/stimulus"
import { loadGoogleMaps } from "../google_maps_loader";

// Connects to data-controller="searchs"
export default class extends Controller {
  static targets = [
    "map",
    "address",
    "latitude",
    "longitude",
  ];

  static values = {
    apiKey: String,
    records: Array,
    spot: Object,
  };

  connect() {
    loadGoogleMaps(this.apiKeyValue).then(() => this.initMap());
  }

  async initMap() {
    // 検索に使ったマーカーの座標
    const spot = {lat: this.spotValue.latitude, lng: this.spotValue.longitude};

		// 使用するライブラリのインポート
		// 「google.maps.～」と書かずにすむようになる。
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
    const { Geocoder } = await google.maps.importLibrary("geocoding");

		// Googleマップ初期表示
    this.map = new Map(this.mapTarget, {
      center: spot, // マップの中心座標
      zoom: 15, // マップの拡大(0:広域 ... 拡大:18？)
      disableDefaultUI: true,
      zoomControl: true,
      fullscreenControl: true,
      mapId: "DEMO_MAP_ID", // マップID("DEMO_MAP_ID"はお試しで使える制限付きのIDらしい)
    });

    // マーカー表示
    // 操作用
    const pin = new PinElement({});
    const marker= new AdvancedMarkerElement({
      map: this.map,
      position: spot,
      content: pin.element,
      gmpClickable: true,
      gmpDraggable: true,
      title: this.spotValue.address,
    });
    // 登録済み用
    this.recordsValue.forEach(record => {
      const pin = new PinElement({
        background: "#5d5df5", // 背景
        borderColor: "#0000ff", // 枠線
        glyphColor: "#5d5df5",
      });
      new AdvancedMarkerElement({
        map: this.map,
        position: { lat: record.latitude, lng: record.longitude },
        content: pin.element,
        gmpClickable: true,
        gmpDraggable: true,
        title: record.address,
      });
    });
    // マーカーウィンドウ
    const infoWindow = new InfoWindow({
      content: `lat:${spot['lat']}, lnt: ${spot['lng']}`,
    });

    // マーカーイベント
    // click: ウィンドウ表示
    marker.addListener('click', () => {
      infoWindow.open(this.map, marker);
    });

    // 円描画
    const cityCircle = new google.maps.Circle({
      strokeColor: "#00FF00",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#00FF00",
      fillOpacity: 0.35,
      map: this.map, // マップのインスタンス
      center: spot,
      radius: 500,
    });
  }
}
