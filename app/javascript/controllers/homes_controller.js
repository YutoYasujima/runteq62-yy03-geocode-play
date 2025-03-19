import { Controller } from "@hotwired/stimulus"
import { loadGoogleMaps } from "../google_maps_loader";

// Connects to data-controller="homes"
export default class extends Controller {
  static targets = ["map"];

  connect() {
    console.log("Maps Controller Connected");
    loadGoogleMaps(this.element.dataset.apiKey).then(() => this.initMap());
  }

  async initMap() {
    console.log("Initializing Tutorial Map...");

    // 東京駅の緯度・経度
    const tokyoStation = {lat: 35.6812996, lng: 139.7670658};

		// 使用するライブラリのインポート
		// 「google.maps.～」と書かずにすむようになる。
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
    const { Geocoder } = await google.maps.importLibrary("geocoding");

		// Googleマップ初期表示
		// 第１引数はGoogleマップを表示する要素を指定する
    this.map = new Map(this.mapTarget, {
      center: tokyoStation, // マップの中心座標
      zoom: 15, // マップの拡大(0:広域 ... 拡大:18？)
      mapId: "DEMO_MAP_ID", // マップID(とりあえず付けておいた方が良さそう)
      // disableDefaultUI: true, // マップに表示されている全UIの無効化
      // zoomControl: true, // ズーム用UIの有効化
    });
  }
}
