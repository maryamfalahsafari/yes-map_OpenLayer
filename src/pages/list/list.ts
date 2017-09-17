import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams,LoadingController } from 'ionic-angular';

import { OpenLayersService } from '../../providers/openLayersService';


@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;
  @ViewChild('map') mapElement: ElementRef;
  mapInfo:any;
  map:any;

  constructor(public navCtrl: NavController,
                public loadingCtrl: LoadingController,
                public navParams: NavParams,
                private _gisService:OpenLayersService) {}
  ionViewDidLoad(){
      this.mapInfo = {  lat:3.1390 , lng: 101.6869, zoom: 8};
      //this._gisService.loadBingMap();
      //this._gisService.loadWMSWithOSM();
      this._gisService.testTileLayer();
      // this.map = this._gisService.loadAndReturnMap(this.mapElement,this.mapInfo);
      // let loader = this.loadingCtrl.create({
      //     content: "Loading"
      // });
      // loader.present().then(() => {
      //   this._gisService.loadGeoJsonOnMap(this.map,loader);
      //   this._gisService.loadPoints(this.map);
      // });

     //this._gisService.loadGeoJsonOnMap_( this.mapInfo);
      //this._gisService.loadBingMap();
      //this._gisService.loadBaseLayer();
     // this._gisService.test(this.mapInfo);
          

  }

  itemTapped(event, item) {
    // // That's right, we're pushing to ourselves!
    // this.navCtrl.push(ListPage, {
    //   item: item
    // });
  }
}
