import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform, AlertController } from 'ionic-angular';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SuccessPage } from '../success/success';
import { StatusBar } from '@ionic-native/status-bar';
import { SMS, SmsOptions } from '@ionic-native/sms';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { CallNumber } from '@ionic-native/call-number';

/**
 * Generated class for the CallPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-call',
  templateUrl: 'call.html',
})
export class CallPage {

  options : GeolocationOptions;
  lat;
  lng;
  hopitaux:any = [];
  hopitauxPays:string = "france"; // congo / france / belgique
  hopitauxLimit:number = 100;
  hopitauxURL = 'assets/data/hopitaux_' + this.hopitauxPays + '.json';
  dataTemp:any = [];

  contactType:string = "sms"; // sms / phone
  
  loading;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public loadingController: LoadingController, 
    private geolocation: Geolocation, 
    private statusBar: StatusBar, 
    private platform: Platform, 
    public alertController: AlertController, 
    private http: HttpClient, 
    private sms: SMS,
    private callNumber: CallNumber,
    private androidPermissions: AndroidPermissions
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CallPage');
    this.presentLoadingWithOptions();
    this.getUserPosition();
  }

  ionViewDidEnter(){

    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#f8f8f8');
    });
  }

  // 2: 
  getHopitaux() {
    this.prepareDataRequest()
    .subscribe(
      data => {

        this.dataTemp = [];

        for(var key in data) {

          if(this.hopitauxPays == "congo") 
          {
            if(data[key]['Latitude'] && data[key]['Longitude'])
            {
              this.dataTemp.push({
                Distance: this.calcCrow(this.lat, this.lng, data[key]['Latitude'], data[key]['Longitude']).toFixed(1),
                Nom: data[key]['Nom'],
                Numero: data[key]['Numero'],
                Adresse: data[key]['Adresse'],
                Lat: data[key]['Latitude'],
                Lng: data[key]['Longitude'],
                Type: data[key]['Type'],
                Urgence: data[key]['Urgence'],
              });
            }
          }

          else if(this.hopitauxPays == "france") 
          {
            if(data[key]['fields']['lat'] && data[key]['fields']['lng'])
            {
              this.dataTemp.push({
                Distance: this.calcCrow(this.lat, this.lng, data[key]['fields']['lat'], data[key]['fields']['lng']).toFixed(1),
                Nom: data[key]['fields']['raison_sociale'],
                Numero: data[key]['fields']['num_tel'],
                Adresse: data[key]['fields']['adresse_complete'] + ", " + data[key]['fields']['cp_ville'],
                Lat: data[key]['fields']['lat'],
                Lng: data[key]['fields']['lng'],
                Type: data[key]['fields']['categorie_de_l_etablissement'],
                Urgence: "",
              });           
            }
          }

        }

        this.dataTemp = this.dataTemp.sort(function(a,b) {
          return a['Distance'] - b['Distance'];
        });


        this.hopitaux = this.dataTemp.slice(0, this.hopitauxLimit);

        this.loading.dismiss();

      },
      err => {
        console.log("Erreur API", err.statusText);
      }
    );
  }
  private prepareDataRequest(): Observable<object> {
    return this.http.get(this.hopitauxURL);
  }

  // 1:
  getUserPosition(){
    this.options = {
        enableHighAccuracy : true
    };

    this.geolocation.getCurrentPosition(this.options).then((pos) => {

            this.lat  = pos.coords.latitude;
            this.lng = pos.coords.longitude;

            this.getHopitaux();

    },(err : PositionError)=>{
        console.log("error : " + err.message);
        const alert = this.alertController.create({
          message: 'Active your GPS.',
          buttons: ['OK']
        });
    
        alert.present();
    });
  }

  // 3: 
  contact(hopital) {
    this.presentLoadingWithOptions();
    //this.checkSMSPermission();

    //this.platform.ready().then(() => {

    if(this.contactType == "sms")
    {

      const options:SmsOptions = {
          replaceLineBreaks: false, // true to replace \n by a new line, false by default
          android: {
              intent: ''  // send SMS with the native android SMS messaging
          }
      };
      
      var msg = "URGENT! Je suis un patient avec tous les symptômes du COVID-19, je me trouve aux coordonnées " + this.lat + "," + this.lng + " ~ https://maps.google.com/maps?q=" + this.lat + "," + this.lng;
      this.sms.send(hopital.Numero, msg, options).then(() => {

          this.loading.dismiss();

          this.navCtrl.push(SuccessPage, {
            hopital: hopital,
            contactType: this.contactType
          });

      }).catch(err => {

        console.log("this is error = ", err)
        const alert = this.alertController.create({
          message: "Vous n'avez plus de crédit",
          buttons: ['OK']
        });
    
        alert.present();

      });

    }

    else if(this.contactType == "phone") {

      
      this.callNumber.callNumber(hopital.Numero, true).then(() => {

          this.loading.dismiss();

          this.navCtrl.push(SuccessPage, {
            hopital: hopital,
            contactType: this.contactType
          });

      }).catch(err => {

        console.log("this is error = ", err)
        const alert = this.alertController.create({
          message: "Vous n'avez plus de crédit",
          buttons: ['OK']
        });
    
        alert.present();

      });


    }

    //});
    
  }

  checkSMSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.SEND_SMS).then(
      result => console.log('Has permission?', result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS)
    );
  }
  requestSMSPermission() {
    // tslint:disable-next-line: max-line-length
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.SEND_SMS, this.androidPermissions.PERMISSION.BROADCAST_SMS]);
  }


  presentLoadingWithOptions() {
    this.loading = this.loadingController.create({
      spinner: null,
      duration: 10000,
      cssClass: 'custom-class custom-loading',
    });
    this.loading.present();
  }
  
  //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
  calcCrow(lat1, lon1, lat2, lon2) 
  {
    var R = 6371; // km
    var dLat = this.toRad(lat2-lat1);
    var dLon = this.toRad(lon2-lon1);
    lat1 = this.toRad(lat1);
    lat2 = this.toRad(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
  }

  // Converts numeric degrees to radians
  toRad(Value) 
  {
      return Value * Math.PI / 180;
  }

  
}
