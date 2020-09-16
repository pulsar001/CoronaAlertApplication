import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingCmp, LoadingController, Platform } from 'ionic-angular';
import { Map, latLng, tileLayer, Layer, marker } from 'leaflet';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';
import * as L from 'leaflet';
import * as esri from 'esri-leaflet';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',  
})
export class MapPage {
  
  loading;
  map: Map;
  propertyList = [];
  options : GeolocationOptions;
  lat;
  lng;

  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation, private loadingController: LoadingController, private platform: Platform, private statusBar: StatusBar) {
  }
  
  ionViewDidLoad() {
    this.presentLoadingWithOptions();
    this.getUserPosition();
  }

  ionViewWillEnter() {

    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#f8f8f8');
    });

  }

  // 1:
  getUserPosition(){
    this.options = {
        enableHighAccuracy : true
    };

    this.geolocation.getCurrentPosition(this.options).then((pos) => {

            this.lat  = pos.coords.latitude;
            this.lng = pos.coords.longitude;

            this.leafletMap();

    },(err : PositionError)=>{
        console.log("error : " + err.message);
    });
  }
  
  leafletMap() {

    var iconPoint = L.icon({
      iconUrl: 'assets/imgs/map_pin.png',
      iconSize: [8, 8],
      iconAnchor: [4, 4],
      popupAnchor: [0, -11]
    });
    var iconMy = L.icon({
      iconUrl: 'assets/imgs/map_pin_my.png',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      popupAnchor: [0, -11],
    });

    var map = L.map('mapId', {
      center: [this.lat, this.lng],
      zoom: 3,
    });
    L.marker([this.lat, this.lng], {icon: iconMy}).addTo(map);

    esri.basemapLayer('DarkGray', {
      attribution: 'CoronAlert',
      detectRetina: true
    }).addTo(map);

    var point = esri.featureLayer({
      url: "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/ArcGIS/rest/services/ncov_cases/FeatureServer/1",
      style: function () {
        return { color: "#70ca49", weight: 2 };
      },
      pointToLayer: function (geojson, latlng) {
        return L.marker(latlng, {
          icon: iconPoint
        });
      }
    }).addTo(map);

    var popupTemplate = "<h3>{Country_Region}</h3>Cas confirmés: {Confirmed}<br>Morts: {Deaths}<br>Rétablis: {Recovered}<small>";
    point.bindPopup(function(e){
      return L.Util.template(popupTemplate, e.feature.properties)
    });

    this.loading.dismiss();

  }

  presentLoadingWithOptions() {
    this.loading = this.loadingController.create({
      spinner: null,
      duration: 10000,
      cssClass: 'custom-class custom-loading',
    });
    this.loading.present();
  }
}
