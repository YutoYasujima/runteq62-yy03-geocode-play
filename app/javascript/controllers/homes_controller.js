import { Controller } from "@hotwired/stimulus"
import { loadGoogleMaps } from "../google_maps_loader";

// Connects to data-controller="homes"
export default class extends Controller {
  static targets = [
    "map",
    // "counter",
  ];

  static values = {
    apiKey: String,
    coordinate: Array,
    address: String,
    test: Object,
    // counter: Number,
  };

  connect() {
    console.log(this.addressValue);
    console.log(this.testValue);
    console.log("Maps Controller Connected");
    loadGoogleMaps(this.apiKeyValue).then(() => this.initMap());
  }

  async initMap() {
    console.log("Initializing Tutorial Map...");

    // 東京駅の緯度・経度
    const tokyoStation = {lat: this.coordinateValue[0], lng: this.coordinateValue[1]};

		// 使用するライブラリのインポート
		// 「google.maps.～」と書かずにすむようになる。
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
    const { Geocoder } = await google.maps.importLibrary("geocoding");

		// Googleマップ初期表示
    this.map = new Map(this.mapTarget, {
      center: tokyoStation, // マップの中心座標
      zoom: 15, // マップの拡大(0:広域 ... 拡大:18？)
      zoomControl: true,
      mapId: "DEMO_MAP_ID", // マップID(とりあえず付けておいた方が良さそう)
    });

    // マーカー表示
    const pin = new PinElement({});
    const marker= new AdvancedMarkerElement({
      map: this.map,
      position: tokyoStation,
      content: pin.element,
      gmpClickable: true,
      gmpDraggable: true,
      title: "Tokyo Station",
    });
  }

  async getCurrentLocation() {
    console.log('getCurrentLocation');
    if (!navigator.geolocation) {
      console.error('ブラウザが現在地取得に対応していません');
      return;
    }

    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

    // 現在地の取得
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude, // 現在地の緯度取得
          lng: position.coords.longitude, // 現在地の経度取得
        };
        // マップの位置修正
        this.map.setCenter(pos);
        this.map.setZoom(16);

        // マーカー表示
        const pin = new PinElement({});
        const marker= new AdvancedMarkerElement({
        map: this.map,
        position: pos,
        content: pin.element,
        gmpClickable: true,
        gmpDraggable: true,
        title: "current location",
    });
      },
      // ユーザーが位置情報の取得を拒否した場合
      () => {
        console.error('位置情報の取得が許可されていません');
      },
      {
        enableHighAccuracy: true, // 高精度モードを有効化
        timeout: 10000, // 10秒でタイムアウト
        maximumAge: 0, // キャッシュを使わない
      }
    );
  }

  // increment() {
  //   this.counterValue += 1;
  //   this.counterTarget.textContent = this.counterValue;
  // }

  // valuesに登録しておくことで、値が変更されたときに発火する
  // changedイベントを監視できる(Reactのstateみたいなこと？)
  // counterValueChanged(value, previousValue) {
  //   console.log(`value: ${value}, previousValue: ${previousValue}`);
  // }
}
