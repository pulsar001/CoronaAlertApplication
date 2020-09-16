import { Component, APP_BOOTSTRAP_LISTENER } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { HomePage } from '../home/home';
import { StatusBar } from '@ionic-native/status-bar';
import { NativeAudio } from '@ionic-native/native-audio';

/**
 * Generated class for the SuccessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-success',
  templateUrl: 'success.html',
})


export class SuccessPage {


  hopital:any;
  contactType:string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private platform: Platform, private statusBar: StatusBar, private nativeAudio: NativeAudio) {
    this.hopital = this.navParams.get('hopital');
    this.contactType = this.navParams.get('contactType');
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#8bc34a');
      this.bip();
    });

    console.log('ionViewDidLoad SuccessPage');
  }

  back() {
    this.navCtrl.push(HomePage);
  }

  bip() {
    this.nativeAudio.preloadComplex('successAudio2', 'assets/sound/just-saying.mp3', 1, 1, 0).then(onSuccess  => {
      this.nativeAudio.play('successAudio2');
    });
  }
}


@Component({
  selector: 'lottie-animation-success',
  template: ` <lottie-animation-view
                  [options]="lottieConfig"
                  (animCreated)="handleAnimation($event)">
            </lottie-animation-view>`,
  styles: ['lottie-animation-success { width:200px; height:200px; }']

})
export class LottieAnimationSuccess {

  public lottieConfig: Object;
  private anim: any;

  constructor() {
    this.lottieConfig = {
        path: 'assets/gif/success.json',
        renderer: 'canvas',
        autoplay: true,
        loop: false
    };
  }

  handleAnimation(anim: any) {
    this.anim = anim;
  }

  ionViewDidLoad() {

    this.anim.play();

    console.log('ionViewDidLoad SuccessPage');
  }

}
