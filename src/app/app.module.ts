import { BrowserModule } from '@angular/platform-browser';
import { Component, ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { NativeAudio } from '@ionic-native/native-audio';
import { OneSignal } from '@ionic-native/onesignal';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SystemProvider } from '../providers/system/system';
import { CallPage } from '../pages/call/call';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClientModule } from '@angular/common/http';
import { SuccessPage, LottieAnimationSuccess } from '../pages/success/success';
import { LottieAnimationViewModule } from 'ng-lottie';
import { SMS } from '@ionic-native/sms';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { CallNumber } from '@ionic-native/call-number';
import { NewsPage } from '../pages/news/news';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { MapPage } from '../pages/map/map';
import { TestPage } from '../pages/test/test';
import { GestesPage } from '../pages/gestes/gestes';
import { AboutPage } from '../pages/about/about';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CallPage,
    SuccessPage,
    NewsPage,
    MapPage,
    TestPage,
    GestesPage,
    AboutPage,
    LottieAnimationSuccess,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    LottieAnimationViewModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CallPage,
    SuccessPage,
    NewsPage,
    MapPage,
    TestPage,
    GestesPage,
    AboutPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SystemProvider,
    NativeAudio,
    SMS,
    AndroidPermissions,
    CallNumber,
    InAppBrowser,
    OneSignal
  ]
})
export class AppModule {}
