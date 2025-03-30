import { Controller } from "@hotwired/stimulus"
import { loadGoogleMaps } from "../google_maps_loader";

// Connects to data-controller="spots"
export default class extends Controller {
  static targets = [
    "map",
    "address",
    "latitude",
    "longitude",
    "link",
  ];

  static values = {
    apiKey: String,
    records: Array,
  };

  connect() {
    loadGoogleMaps(this.apiKeyValue).then(() => this.initMap());
  }

  async initMap() {
    // 東京駅の緯度・経度
    const tokyoStation = {lat: 35.6812996, lng: 139.7670658};

		// 使用するライブラリのインポート
		// 「google.maps.～」と書かずにすむようになる。
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
    const { Geocoder } = await google.maps.importLibrary("geocoding");

		// Googleマップ初期表示
    this.map = new Map(this.mapTarget, {
      center: tokyoStation, // マップの中心座標
      zoom: 15, // マップの拡大(0:広域 ... 拡大:18？)
      disableDefaultUI: true,
      zoomControl: true,
      fullscreenControl: true,
      mapId: this.mapIdValue,
    });

    // マーカー表示
    // 操作用
    const pin = new PinElement({});
    const marker= new AdvancedMarkerElement({
      map: this.map,
      position: tokyoStation,
      content: pin.element,
      gmpClickable: true,
      gmpDraggable: true,
      title: "Tokyo Station",
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
        title: record.address,
      });
    });
    // マーカーウィンドウ
    const infoWindow = new InfoWindow({
      content: `lat:${tokyoStation['lat']}, lnt: ${tokyoStation['lng']}`,
    });

    // マーカーイベント
    // click: ウィンドウ表示
    marker.addListener('click', () => {
      infoWindow.open(this.map, marker);
    });

    // dragend: 座標変更
    marker.addListener('dragend', e => {
      const position = marker.position;
      // Reverse geocode
      new Geocoder().geocode({
        location: position,
      },
      (results, status) => {
        if (status !== 'OK') {
          alert(`リバースジオコーディング失敗：${status}`);
          return;
        }
        // results[0].formatted_addressに詳細な住所がある
        if (results[0]) {
          marker.title = results[0].formatted_address;
          this.addressTarget.value = results[0].formatted_address;
          this.latitudeTarget.value = position.lat;
          this.longitudeTarget.value = position.lng;
        } else {
          alert(`リバースジオコーディング失敗：結果なし}`);
          return;
        }
      });

      infoWindow.close();
      infoWindow.setContent(`drag lat: ${position['lat']}, lnt: ${position['lng']}`);
      // infoWindow.open(marker.map, marker);
    });
  }

  handleClick(event) {
    event.preventDefault();

    const latitude = this.latitudeTarget.value;
    const longitude = this.longitudeTarget.value;
    // const link = this.linkTarget;

    // リンクのhrefを更新
    // link.href = `/spots/search?latitude=${latitude}&longitude=${longitude}`;

    // クリックを処理して遷移
    window.location.href = `/spots/search?latitude=${latitude}&longitude=${longitude}`;
  }
}
