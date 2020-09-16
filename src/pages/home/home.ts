import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import { CallPage } from '../call/call';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { StatusBar } from '@ionic-native/status-bar';
import { NewsPage } from '../news/news';
import { MapPage } from '../map/map';
import { TestPage } from '../test/test';
import { GestesPage } from '../gestes/gestes';
import { AboutPage } from '../about/about';
import { CallNumber } from '@ionic-native/call-number';
import { SuccessPage } from '../success/success';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  
  apiURL:string = "https://coronavirus-19-api.herokuapp.com/all";
  dataApi:any;
  numeroUrgence:any = "15"; // si rempli ne prend pas en compte la liste des hopitaux et appel direct

  dataPrcDeaths;
  dataPrcRecovers;

  constructor(public navCtrl: NavController, private http: HttpClient, private platform: Platform, private statusBar: StatusBar, private callNumber: CallNumber, public alertController: AlertController) {

  }

  ionViewWillEnter() {
    this.prepareDataRequest()
      .subscribe(
        data => {
          console.log(data);
          this.dataApi = data;
        },
        err => {
          console.log("Erreur API", err.statusText);
        }
      );

      this.platform.ready().then(() => {
        this.statusBar.backgroundColorByHexString('#ae0405');
      });
  }
  private prepareDataRequest(): Observable<object> {
    return this.http.get(this.apiURL);
  }

  call() {
    if(this.numeroUrgence)
      this.phone();
    else
      this.navCtrl.push(CallPage);
  }

  news() {
    this.navCtrl.push(NewsPage);
  }

  map() {
    this.navCtrl.push(MapPage);
  }

  test() {
    this.navCtrl.push(TestPage);
  }

  gestes() {
    this.navCtrl.push(GestesPage);
  }

  about() {
    this.navCtrl.push(AboutPage);
  }


  phone() {
    
    this.callNumber.callNumber(this.numeroUrgence, true).then(() => {


      this.navCtrl.push(SuccessPage, {
        contactType: "direct"
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
}
