import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { InAppBrowser } from '@ionic-native/in-app-browser'

/**
 * Generated class for the NewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {
  
  loading;
  feedNews:any;
  feedURL:string = "https://news.google.com/rss/topics/CAAqIggKIhxDQkFTRHdvSkwyMHZNREZqY0hsNUVnSm1jaWdBUAE?hl=fr&gl=BE&ceid=BE:fr";

  constructor(public navCtrl: NavController, public navParams: NavParams, private platform: Platform, private statusBar: StatusBar, private http: HttpClient, private iab: InAppBrowser, private loadingController: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsPage');
    this.presentLoadingWithOptions();
  }

  ionViewWillEnter() {

    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#f8f8f8');
    });

    this.prepareDataRequest()
      .subscribe(
        data => {
          if(data['status'] == "ok") {
            this.feedNews = data['items'];
            this.loading.dismiss();
            console.log(this.feedNews);
          }
        },
        err => {
          console.log("Erreur API", err.statusText);
        }
      );

  }
  private prepareDataRequest(): Observable<object> {
    return this.http.get("https://api.rss2json.com/v1/api.json?rss_url=" + this.feedURL);
  }

  web(url:string) {
    const browser = this.iab.create(url);
    browser.show();
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
