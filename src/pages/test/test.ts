import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import { CallPage } from '../call/call';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * Generated class for the TestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class TestPage {
  
  loading;

  questions:any = [
    "Avez-vous de la fievre et une température suppérieur à 38° ?",
    "Avez-vous de la toux séche et/ou difficultés respiratoire ?",
    "Avez-vous de la fatigue et/ou des douleurs articulaires ?",
    "Avez-vous récemment voyagé dans un pays touché ?",
    "Avez-vous récemment eu un contact avec une personne venant d'un pays touché et/ou potentiellement infecté ?"
  ];

  step:number;
  stepMax:number = this.questions.length;

  score:number;
  scoreMax:number = this.stepMax;
  scoreProb:number;

  viewResult:boolean;


  constructor(public navCtrl: NavController, public navParams: NavParams, private platform: Platform, private statusBar: StatusBar, private loadingController: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestPage');
    this.step = 1;
    this.score = 0;
    this.viewResult = false;
  }

  ionViewWillEnter() {

    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#f8f8f8');
    });

  }

  chose(type:string) {

    this.presentLoadingWithOptions();

    if(type == "yes")
      this.yes();

    this.next();
  }

  yes() {
    if(this.score < this.scoreMax) 
      this.score++;

    console.log("Yes", this.score);
  }

  next() {
    if(this.step < this.stepMax) 
      this.step++;
    else {
      this.viewResult = true;
      this.scoreProb = (this.score * (100 / this.scoreMax));
      if(this.scoreProb <= 0) this.scoreProb = 1;
      if(this.scoreProb >= 100) this.scoreProb = 99;
    }

    console.log("Next", this.step);
  }

  back() {
    if(this.step > 1) this.step--;

    if(this.score > 0) this.score--;

    console.log("Back", this.step);
  }


  call() {
    this.navCtrl.push(CallPage);
  }

  presentLoadingWithOptions() {
    this.loading = this.loadingController.create({
      spinner: null,
      duration: 200,
      cssClass: 'custom-class custom-loading',
    });
    this.loading.present();
  }
}
