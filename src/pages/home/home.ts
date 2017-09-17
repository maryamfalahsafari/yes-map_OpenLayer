import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController,LoadingController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { AlertController } from 'ionic-angular';



import { Service } from '../../providers/service';
import { GisService } from '../../providers/gisService';

import { ListPage } from '../list/list';


declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  // styleUrls:['assets/css/style.min.css']
})
export class HomePage {

  stateList:Array<any>;

  
  
  baseStationList:Array<any>;
  baseStationGeoList:any;


  
  ppdList:Array<any>;
  cityList:Array<any>;
  schoolList:Array<any>;
  yesList:Array<any>;
  errorMessage: string;
  filter:any={state:'',ppd:'',city:'',school:''};
  mapFilter:any={yes:true,school:true,wimax:true,lte:true,baseStation:true};
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('legend') legendElement: ElementRef;
  mapInfo:any;
  map:any;
  schoolGeoList:any;
  yesGeoList:any;
  selectedGeoSchoole:any;
  selectedSchoole:any={};
  wmFeatures:any;
  cteFeatures:any;
  columnFilter:string='SchoolCoverageStatusASN';
  serverBaseUrl='http://localhost:8081';//10.25.151.96:1030
  menuClass="animated bounceInLeft";
  showingMenu:boolean=true;
  arrow='arrow-back';
  searchPoint:any;



  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              private _service:Service,
              private _gisService:GisService,
              private alertCtrl: AlertController
             
              ) { }
  ionViewDidLoad(){
    this.getStateList();
    this.loadMap();    
  }
  loadMap(){
      this.mapInfo = {  lat:3.1390 , lng:101.6869, zoom: 6};
      this.map = this._gisService.loadAndReturnMap(this.mapElement,this.mapInfo);
      this.initiateLegend();
      
      

      // let loader = this.loadingCtrl.create({
      //     content: "Loading"
      // });
          
      // loader.present().then(() => {
      //     this.map.data.setStyle({
      //       fillColor: 'dodgerblue',
      //       strokeWeight: 3,
      //       strokeColor:'dodgerblue',
      //       fillOpacity:0.7,
      //       visible: true
      //     });
     
      //     var self=this;
      //     this.map.data.loadGeoJson(
      //       this.serverBaseUrl+"/geoserver/YTLC_Geo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=YTLC_Geo:WM_ActualGoodCoverage_Public&maxFeatures=50&outputFormat=application%2Fjson", 
      //       null, function(features){
      //       self.wmFeatures=features;
      //       //loader.dismiss();
      //     });
      //      this.map.data.loadGeoJson(
      //       this.serverBaseUrl+"/geoserver/YTLC_Geo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=YTLC_Geo:WM_LTE_ActualGoodCoverge_Public&maxFeatures=50&outputFormat=application%2Fjson", 
      //       null, function(features){
      //       self.cteFeatures=features;
      //       loader.dismiss();
      //     });
      // });
  }
  getStateList(){
      this._service.getStateList()
          .subscribe(result => 
          {
            if(result && result.length>0)
              {
                  this.stateList= result;
              }
          },error => this.errorMessage = <any>error,
          () => { });
  }
  //==============drpState===========
  getDataBasedOnStateId(state){
    this.clearMap();
    if (!state)
    {
      this._gisService.deleteMarkers(this.baseStationGeoList);
      return;
    }

    let loader = this.loadingCtrl.create({
          content: "Loading"
      });
          
      loader.present().then(() => {
        this._service.getPPDListByStateId(state.Id)
        .subscribe(result => 
        {
          if(result && result.length>0)
          {
              this.ppdList= result;
          }
        },error => this.errorMessage = <any>error,
        () => {
            this.getBaseStationList(loader,false);
            this.getYesSchoolListByState(state.Name,loader);
        });
      });

  }
  //==============drpPPD=============
  getDataBasedOnPPD(ppd){
    this.clearMap();
    if (!ppd)
    {
        return;
    }
    let loader = this.loadingCtrl.create({
          content: "Loading"
      });
          
      loader.present().then(() => {
        this._service.getCityListByPPDId(ppd.Id)
        .subscribe(result => 
        {
          if(result && result.length>0)
          {
              this.cityList= result;
             
          }
        },error => this.errorMessage = <any>error,
        () => {
            this.getYesSchoolDataByPPD(ppd,loader);
        });
      });

  }
  //==============drpCity============
  getDataBasedOnCityId(cityId){
    this.clearMap();
    if (!cityId || cityId=='')
    {
        return;
    }
    let loader = this.loadingCtrl.create({
          content: "Loading"
      });
    loader.present().then(() => {
        this._service.getSchoolListByCityId(cityId)
        .subscribe(result => 
        {
          if(result && result.length>0)
          {
              this.schoolList= result;
              
          }
        },error => this.errorMessage = <any>error,
        () => {
          this.getYesSchoolDataByCityId(cityId,loader);
        });
      });

  }
  showFilterDialog() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Which filter do you want to apply?');

    alert.addInput({
      type: 'radio',
      label: 'No of YESApp Download',
      value: 'NoofYESAppDownload',
      checked: this.columnFilter=='NoofYESAppDownload'?true:false
    });

    alert.addInput({
      type: 'radio',
      label: 'School Coverage StatusASN',
      value: 'SchoolCoverageStatusASN',
      checked: this.columnFilter=='SchoolCoverageStatusASN'?true:false
    });
    alert.addInput({
      type: 'radio',
      label: 'No Of Altitude Teachers',
      value: 'NoOfAltitudeTeachers',
      checked: this.columnFilter=='NoOfAltitudeTeachers'?true:false
    });
    alert.addInput({
      type: 'radio',
      label: 'No Of Plan Upgrade',
      value: 'NoOfPlanUpgrade',
      checked: this.columnFilter=='NoOfPlanUpgrade'?true:false
    });
    alert.addInput({
      type: 'radio',
      label: 'Total AddOn Purchase',
      value: 'TotalAddOnPurchase',
      checked: this.columnFilter=='TotalAddOnPurchase'?true:false
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Okay',
      handler: data => {
        console.log('checkbox data:', data);
        this.columnFilter=data;
        console.log('this.filter',this.columnFilter);
        this._gisService.changeMarker(this.schoolGeoList,this.columnFilter);

        if (this.legendElement.nativeElement)
        {
          //console.log('clear');
          //console.log(this.legendElement.nativeElement.firstChild);
          this.legendElement.nativeElement.innerHTML = '';
          this.map.controls[google.maps.ControlPosition.RIGHT_CENTER].clear();
          this.legendElement.nativeElement.insertAdjacentHTML('beforeend', "<h6>"+this.columnFilter+"</h6>");
        }
        if (this.columnFilter=='SchoolCoverageStatusASN')
        {
          this.legendElement.nativeElement.insertAdjacentHTML('beforeend', "<span style='color:black;'><img src='http://www.googlemapsmarkers.com/v1/006400/' style='margin-right:5px;'/>Good - Continous Coverage</span><br/>");
          this.legendElement.nativeElement.insertAdjacentHTML('beforeend', "<span style='color:black;'><img src='http://www.googlemapsmarkers.com/v1/32CD32/' style='margin-right:5px;'/>Average - Spotty Coverage</span><br/>");
          this.legendElement.nativeElement.insertAdjacentHTML('beforeend', "<span style='color:black;'><img src='http://www.googlemapsmarkers.com/v1/00FF00/' style='margin-right:5px;'/>Checking WIP</span><br/>");
          this.legendElement.nativeElement.insertAdjacentHTML('beforeend', "<span style='color:black;'><img src='http://www.googlemapsmarkers.com/v1/ADFF2F/' style='margin-right:5px;'/>Poor - Isolated Coverage</span><br/>");
        }
        else  if (this.columnFilter=='NoOfAltitudeTeachers')
        {
          this.legendElement.nativeElement.insertAdjacentHTML('beforeend', "<span style='color:black;'><img src='http://www.googlemapsmarkers.com/v1/006400/' style='margin-right:5px;'/>150 - 251</span><br/>");
          this.legendElement.nativeElement.insertAdjacentHTML('beforeend', "<span style='color:black;'><img src='http://www.googlemapsmarkers.com/v1/32CD32/' style='margin-right:5px;'/>100 - 150</span><br/>");
          this.legendElement.nativeElement.insertAdjacentHTML('beforeend', "<span style='color:black;'><img src='http://www.googlemapsmarkers.com/v1/00FF00/' style='margin-right:5px;'/>50 - 100</span><br/>");
          this.legendElement.nativeElement.insertAdjacentHTML('beforeend', "<span style='color:black;'><img src='http://www.googlemapsmarkers.com/v1/ADFF2F/' style='margin-right:5px;'/>0 - 50</span><br/>");
        }
         else  if (this.columnFilter=='NoOfPlanUpgrade')
        {
          this.legendElement.nativeElement.insertAdjacentHTML('beforeend', "<span style='color:black;'><img src='http://www.googlemapsmarkers.com/v1/006400/' style='margin-right:5px;'/>6 - 8</span><br/>");
          this.legendElement.nativeElement.insertAdjacentHTML('beforeend', "<span style='color:black;'><img src='http://www.googlemapsmarkers.com/v1/32CD32/' style='margin-right:5px;'/>4 - 6</span><br/>");
          this.legendElement.nativeElement.insertAdjacentHTML('beforeend', "<span style='color:black;'><img src='http://www.googlemapsmarkers.com/v1/00FF00/' style='margin-right:5px;'/>2 - 4</span><br/>");
          this.legendElement.nativeElement.insertAdjacentHTML('beforeend', "<span style='color:black;'><img src='http://www.googlemapsmarkers.com/v1/ADFF2F/' style='margin-right:5px;'/>0 - 2</span><br/>");
        }
         else  if (this.columnFilter=='TotalAddOnPurchase')
        {
          this.legendElement.nativeElement.insertAdjacentHTML('beforeend', "<span style='color:black;'><img src='http://www.googlemapsmarkers.com/v1/006400/' style='margin-right:5px;'/>141 - 187</span><br/>");
          this.legendElement.nativeElement.insertAdjacentHTML('beforeend', "<span style='color:black;'><img src='http://www.googlemapsmarkers.com/v1/32CD32/' style='margin-right:5px;'/>94 - 141</span><br/>");
          this.legendElement.nativeElement.insertAdjacentHTML('beforeend', "<span style='color:black;'><img src='http://www.googlemapsmarkers.com/v1/00FF00/' style='margin-right:5px;'/>47 - 94</span><br/>");
          this.legendElement.nativeElement.insertAdjacentHTML('beforeend', "<span style='color:black;'><img src='http://www.googlemapsmarkers.com/v1/ADFF2F/' style='margin-right:5px;'/>0 - 47</span><br/>");
        }
        else  if (this.columnFilter=='NoofYESAppDownload')
        {
          this.legendElement.nativeElement.insertAdjacentHTML('beforeend', "<span style='color:black;'><img src='http://www.googlemapsmarkers.com/v1/006400/' style='margin-right:5px;'/>75 - 118</span><br/>");
          this.legendElement.nativeElement.insertAdjacentHTML('beforeend', "<span style='color:black;'><img src='http://www.googlemapsmarkers.com/v1/32CD32/' style='margin-right:5px;'/>50 - 75</span><br/>");
          this.legendElement.nativeElement.insertAdjacentHTML('beforeend', "<span style='color:black;'><img src='http://www.googlemapsmarkers.com/v1/00FF00/' style='margin-right:5px;'/>25 - 50</span><br/>");
          this.legendElement.nativeElement.insertAdjacentHTML('beforeend', "<span style='color:black;'><img src='http://www.googlemapsmarkers.com/v1/ADFF2F/' style='margin-right:5px;'/>0 - 25</span><br/>");
        }
        this.map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(this.legendElement.nativeElement);
      }
    });
    alert.present();
  }
  someFunction(event){
    console.log((<HTMLInputElement>event.target).value);
    var arr=(<HTMLInputElement>event.target).value.split(',');
    if (arr.length!=2)
      return;
    var lat=arr[0];
    var lng=arr[1];
    this.searchPoint= this._gisService.highlightMarkerByLatLong(this.searchPoint,lat,lng,null,this.map);
  }
  


  //------------------Make layer ON/OFF
  changeShowWimax(){
    if (this.mapFilter.wimax)
    {
        let loader = this.loadingCtrl.create({
            content: "Loading"
        });
            
        loader.present().then(() => {
            this.map.data.setStyle({
              fillColor: 'dodgerblue',
              strokeWeight: 3,
              strokeColor:'dodgerblue',
              fillOpacity:0.7,
              visible: true
            });
            var self=this;
            this.map.data.loadGeoJson(
              this.serverBaseUrl+"/geoserver/YTLC_Geo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=YTLC_Geo:WM_ActualGoodCoverage_Public&maxFeatures=50&outputFormat=application%2Fjson", 
              null, function(features){
              self.wmFeatures=features;
              loader.dismiss();
              
            });
      });
    }
    else
    {
      if (this.wmFeatures)
        for(var i=0;i<this.wmFeatures.length;++i)
        {
          this.map.data.remove(this.wmFeatures[i]);
        }
    }
  }
  changeShowYesStore(){
   
       let loader = this.loadingCtrl.create({
            content: "Loading"
        });
            
        loader.present().then(() => {
          this.getYesSchoolDataByPPD(this.filter.ppd,loader);
      });
    
  }
  changeShowSchool(){

     let loader = this.loadingCtrl.create({
            content: "Loading"
        });
            
        loader.present().then(() => {
          this.getYesSchoolDataByPPD(this.filter.ppd,loader);           
      });
  }
  changeShowLTE(){
    if (this.mapFilter.lte)
    {
       let loader = this.loadingCtrl.create({
            content: "Loading"
        });
            
        loader.present().then(() => {
            this.map.data.setStyle({
              fillColor: 'dodgerblue',
              strokeWeight: 3,
              strokeColor:'dodgerblue',
              fillOpacity:0.7,
              visible: true
            });
             var self=this;
            this.map.data.loadGeoJson(
              this.serverBaseUrl+"/geoserver/YTLC_Geo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=YTLC_Geo:WM_LTE_ActualGoodCoverge_Public&maxFeatures=50&outputFormat=application%2Fjson", 
              null, function(features){
              self.cteFeatures=features;
              loader.dismiss();
            });
      });
    }
    else
    {
      if (this.cteFeatures)
        for(var i=0;i<this.cteFeatures.length;++i)
        {
          this.map.data.remove(this.cteFeatures[i]);
        }
    }
  }
  changeShowBaseStation(){

     let loader = this.loadingCtrl.create({
            content: "Loading"
        });
            
        loader.present().then(() => {
          this.getBaseStationList(loader,true);           
      });

  } 
  


//=========================private 
  getBaseStationList(loader,needToDismiss){
    if (this.mapFilter.baseStation!=true || !this.filter.state)
    {
      this._gisService.deleteMarkers(this.baseStationGeoList);
      loader.dismiss();
      return;
    }
    this._service.getBaseStationData(this.filter.state.Id)
              .subscribe(result => 
              {
                this._gisService.deleteMarkers(this.baseStationGeoList);
                if(result && result.length>0)
                {
                    this.baseStationList= result;
                    this.baseStationGeoList = this._gisService.generatePointLocationOnMap(result,this.map,null,'baseStation',null);
                }
              },error => this.errorMessage = <any>error,
              () => {
                if (loader && needToDismiss==true)
                  loader.dismiss();
              });
  }
  getYesSchoolDataByPPD(ppd,loader){
    if (this.mapFilter.yes!=true && this.mapFilter.school!=true)
    {
      this._gisService.deleteMarkers(this.schoolGeoList);
      this._gisService.deleteMarkers(this.yesGeoList);
      loader.dismiss();
      return;
    }

    this._service.getYesSchoolListByPPDName(ppd.PPDName,this.mapFilter.yes,this.mapFilter.school)
                .subscribe(result => 
                {
                  this._gisService.deleteMarkers(this.schoolGeoList);
                  this._gisService.deleteMarkers(this.yesGeoList);
                  if(result && result.length>0)
                  {
                      this.schoolList= result;
                      var self=this;
                      var temp=this._gisService.generatePoint(result,this.map,null,this.columnFilter);
                      this.schoolGeoList = temp?temp.schoolArray:null;
                      this.yesGeoList = temp?temp.yesArray:null;
                  }
                },error => this.errorMessage = <any>error,
                () => {
                  loader.dismiss();
                });
  }
  getYesSchoolDataByCityId(cityId,loader){
    if (this.mapFilter.yes!=true && this.mapFilter.school!=true)
    {
      this._gisService.deleteMarkers(this.schoolGeoList);
      this._gisService.deleteMarkers(this.yesGeoList);
      loader.dismiss();
      return;
    }

    this._service.getYesSchoolListByCityId(cityId,this.mapFilter.yes,this.mapFilter.school)
                .subscribe(result => 
                {
                  this._gisService.deleteMarkers(this.schoolGeoList);
                  this._gisService.deleteMarkers(this.yesGeoList);
                  if(result && result.length>0)
                  {
                      this.schoolList= result;
                      var self=this;
                      var temp=this._gisService.generatePoint(result,this.map,null,this.columnFilter);
                      this.schoolGeoList = temp?temp.schoolArray:null;
                      this.yesGeoList = temp?temp.yesArray:null;
                  }
                },error => this.errorMessage = <any>error,
                () => {
                  loader.dismiss();
                });
  }
  getYesSchoolListByState(state,loader){
    if (this.mapFilter.yes!=true && this.mapFilter.school!=true)
    {
      this._gisService.deleteMarkers(this.schoolGeoList);
      this._gisService.deleteMarkers(this.yesGeoList);
      loader.dismiss();
      return;
    }

    this._service.getYesSchoolListByState(state,this.mapFilter.yes,this.mapFilter.school)
                .subscribe(result => 
                {
                  this._gisService.deleteMarkers(this.schoolGeoList);
                  this._gisService.deleteMarkers(this.yesGeoList);
                  if(result && result.length>0)
                  {
                      this.schoolList= result;
                      var self=this;
                      var temp=this._gisService.generatePoint(result,this.map,null,this.columnFilter);
                      this.schoolGeoList = temp?temp.schoolArray:null;
                      this.yesGeoList = temp?temp.yesArray:null;
                  }
                },error => this.errorMessage = <any>error,
                () => {
                  loader.dismiss();
                });    
  }
  ZoomToSchoole(schoole,lat,lng){
    this.selectedGeoSchoole= this._gisService.highlightMarkerByLatLong(this.selectedGeoSchoole,lat,lng,schoole,this.map);
    this.selectedSchoole=schoole;
  }
  formatNumber(value){
    if (!value)
      return value;
    
   value = Math.round(value * 100) / 100;
   return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  initiateLegend(){
    this.legendElement.nativeElement.insertAdjacentHTML('beforeend', "<p style='font-weight:bold;'>"+this.columnFilter+"</p>");
    this.legendElement.nativeElement.insertAdjacentHTML('beforeend', "<span style='color:black;'><img src='http://www.googlemapsmarkers.com/v1/006400/' style='margin-right:5px;'/>Good - Continous Coverage</span><br/>");
    this.legendElement.nativeElement.insertAdjacentHTML('beforeend', "<span style='color:black;'><img src='http://www.googlemapsmarkers.com/v1/32CD32/' style='margin-right:5px;'/>Average - Spotty Coverage</span><br/>");
    this.legendElement.nativeElement.insertAdjacentHTML('beforeend', "<span style='color:black;'><img src='http://www.googlemapsmarkers.com/v1/00FF00/' style='margin-right:5px;'/>Checking WIP</span><br/>");
    this.legendElement.nativeElement.insertAdjacentHTML('beforeend', "<span style='color:black;'><img src='http://www.googlemapsmarkers.com/v1/ADFF2F/' style='margin-right:5px;'/>Poor - Isolated Coverage</span><br/>");
    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(this.legendElement.nativeElement);
    
  }
  toggleWidget(){

    this.navCtrl.setRoot(ListPage);
    console.log('dddd');
    if (this.showingMenu==true)
    {
      this.menuClass="animated bounceOutLeft";
    // setTimeout(()=>{
        this.showingMenu = false;
         this.arrow='arrow-left'
     //}, 1000);
      
      
    }
    else 
    {
      this.menuClass="animated bounceInLeft";
      this.showingMenu = true;
      this.arrow='arrow-right'
      
    }

  }
  clearMap(){
    if (this.selectedGeoSchoole)
    {
      this.selectedGeoSchoole.setMap(null);
      this.selectedSchoole=null;
    }
    if (this.searchPoint)
      this.searchPoint.setMap(null);
      
  }
}


