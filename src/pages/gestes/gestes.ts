import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * Generated class for the GestesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-gestes',
  templateUrl: 'gestes.html',
})
export class GestesPage {

  trustedVideoUrl: SafeResourceUrl;
  gestes:any = [
    {
      title: "Bien se laver les mains",
      vid_link:"https://www.youtube.com/embed/Su0zQ7hWUDk"
    },
    {
      title: "Porter un masque FFP2",
      vid_link:"https://www.youtube.com/embed/avDx5z79Oe8"
    }
  ]


  constructor(public navCtrl: NavController,
              private domSanitizer: DomSanitizer, private platform: Platform, private statusBar: StatusBar) {}

  ionViewWillEnter(): void {
    
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#f8f8f8');
    });

    for(let i of this.gestes){
      i.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(i.vid_link);
    }
  }  

}
