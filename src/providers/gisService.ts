import { Injectable } from '@angular/core';
import { ElementRef } from '@angular/core';

declare var google;


@Injectable()
export class GisService {

    constructor() { }

    loadAndReturnMap(mapElement:ElementRef,mapInfo:any){
        return new google.maps.Map(mapElement.nativeElement, {
                    zoom: mapInfo.zoom,
                    center: new google.maps.LatLng(mapInfo.lat, mapInfo.lng),
                    mapTypeId: google.maps.MapTypeId.ROADMAP ,
                    streetViewControlOptions: {
                        position: google.maps.ControlPosition.TOP_CENTER
                    },
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.RIGHT_CENTER,
                    },
                    mapTypeControlOptions: {
                        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                        position: google.maps.ControlPosition.TOP_CENTER
                    },  
                });
        
    }
    generatePoint(mainArr,mapName,callBack,filterColumn){
        console.log('filterColumn',filterColumn);
        var markersArray=new Array<any>();
        var yesMarkersArray=new Array<any>();
        for (var i = 0; i < mainArr.length ; i++) {
            if (mainArr[i].Kind=='Yes')
                this.createMarker(i,mainArr, mapName,callBack,yesMarkersArray,'yes',filterColumn);
                else this.createMarker(i,mainArr, mapName,callBack,markersArray,'school',filterColumn);
        }
        var initialZoom=12;//mapName.getZoom();
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markersArray.length; i++) {
            bounds.extend(markersArray[i].getPosition());
        }
         for (var i = 0; i < yesMarkersArray.length; i++) {
            bounds.extend(yesMarkersArray[i].getPosition());
        }

        mapName.fitBounds(bounds);
        mapName.setZoom(initialZoom);
        return {schoolArray:markersArray,yesArray:yesMarkersArray};
    }
    generatePointLocationOnMap(mainArr,mapName,callBack,type,filterColumn){
        
        var markersArray=new Array<any>();
        for (var i = 0; i < mainArr.length ; i++) {
                this.createMarker(i,mainArr, mapName,callBack,markersArray,type,filterColumn);
        }
        var initialZoom=type=='baseStation'?6:12;
        console.log('maryam',initialZoom,type);
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markersArray.length; i++) {
        bounds.extend(markersArray[i].getPosition());
        }

        mapName.fitBounds(bounds);
        mapName.setZoom(initialZoom);
        return markersArray;
    }
    createMarker(i,mainArr, mapName,callBack,markersArray,type,filterColumn) {
        
        var infowindow = new google.maps.InfoWindow({});
        
	   	var staffPoint = new google.maps.Marker({
                position:  new google.maps.LatLng(mainArr[i].Latitude, mainArr[i].Longitude),
                icon:  this.GetIcon(type,mainArr[i][filterColumn+'Color']?mainArr[i][filterColumn+'Color']:''),//type=='school'?this.getIconUrl(mainArr[i][filterColumn+'Color']):'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
                customInfo: mainArr[i],
                zIndex : 0});
                var self=this;
        staffPoint.addListener("click",function(event){
            console.log(event.latLng);
            var html='';
            if (type=='school')
            {
                html = "<span style='color:black;'>SchoolCode : <b>" + this.customInfo.SchoolCode+'</b></span><br/>';
                html += "<span style='color:black;'>SchoolServingSite : <b>" + this.customInfo.SchoolServingSite+'</b></span><br/>';
                html += "<span style='color:black;'>NoOfAltitudeTeachers : <b>" + this.customInfo.NoOfAltitudeTeachers+'</b></span><br/>';
                html += "<span style='color:black;'>NoOfPlanUpgrade : <b>" + this.customInfo.NoOfPlanUpgrade+'</b></span><br/>';
                html += "<span style='color:black;'>TotalAddOnPurchase : <b>" + this.customInfo.TotalAddOnPurchase+'</b></span><br/>';
                html += "<span style='color:black;'>SchoolCoverageStatusASN : <b>" + this.customInfo.SchoolCoverageStatusASN+'</b></span><br/>';
                html += "<span style='color:black;'>Location : <b>" + this.customInfo.Latitude+','+this.customInfo.Longitude+'</b></span><br/>';
                
            }else if (type=='yes'){
                html = "<span style='color:black;'>Pincode : <b>" + this.customInfo.Pincode+'</b></span><br/>';
                html += "<span style='color:black;'>StoreName : <b>" + this.customInfo.StoreName+'</b></span><br/>';
                html += "<span style='color:black;'>Telephone : <b>" + this.customInfo.Telephone+'</b></span><br/>';
                html += "<span style='color:black;'>Fax : <b>" + this.customInfo.Fax+'</b></span><br/>';
                html += "<span style='color:black;'>Website : <b>" + this.customInfo.Website+'</b></span><br/>';
                html += "<span style='color:black;'>Location : <b>" + this.customInfo.Latitude+','+this.customInfo.Longitude+'</b></span><br/>';
                

            }else {
                 html = "<span style='color:black;'>Site_ID : <b>" + this.customInfo.Site_ID+'</b></span><br/>';
                html += "<span style='color:black;'>NE_ID : <b>" + this.customInfo.NE_ID+'</b></span><br/>';
                html += "<span style='color:black;'>City : <b>" + this.customInfo.City+'</b></span><br/>';
                html += "<span style='color:black;'>eNB_ID : <b>" + this.customInfo.eNB_ID+'</b></span><br/>';
                html += "<span style='color:black;'>eNB_Name : <b>" + this.customInfo.eNB_Name+'</b></span><br/>';
                html += "<span style='color:black;'>Location : <b>" + this.customInfo.Latitude+','+this.customInfo.Longitude+'</b></span><br/>';

            }
                            infowindow.setContent(html);
                            infowindow.open(mapName, staffPoint);
        });
       
        staffPoint.setMap(mapName);
		markersArray.push(staffPoint);
    }
    GetIcon(type,color){
        var result='';
        if (type=='school')
            result='http://www.googlemapsmarkers.com/v1/'+color+'/';
        else if (type=='baseStation')
            result='http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
            else result='http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
        return result;
    }
    deleteMarkers(markersArray){
        if (markersArray)
        {
            for (var i = 0; i < markersArray.length; i++ ) {
                markersArray[i].setMap(null);
            }
            markersArray.length = 0;
        }
    }
    highlightMarkerByLatLong(previousPoint,lat,lng,info, mapName):any {
		if (previousPoint)
			previousPoint.setMap(null);
        var initialZoom=mapName.getZoom();
	   	var staffPoint = new google.maps.Marker({position:  new google.maps.LatLng(lat, lng),
												 icon:'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
	   											zIndex : 1000});
   if (info){
                var html = "<span style='color:black;'>SchoolCode : <b>" + info.SchoolCode+'</b></span><br/>';
                html += "<span style='color:black;'>SchoolServingSite : <b>" + info.SchoolServingSite+'</b></span><br/>';
                html += "<span style='color:black;'>NoOfAltitudeTeachers : <b>" + info.NoOfAltitudeTeachers+'</b></span><br/>';
                html += "<span style='color:black;'>NoOfPlanUpgrade : <b>" + info.NoOfPlanUpgrade+'</b></span><br/>';
                html += "<span style='color:black;'>TotalAddOnPurchase : <b>" + info.TotalAddOnPurchase+'</b></span><br/>';
                html += "<span style='color:black;'>SchoolCoverageStatusASN : <b>" + info.SchoolCoverageStatusASN+'</b></span><br/>';  
        var infowindow = new google.maps.InfoWindow({});
        infowindow.setContent(html);
        infowindow.open(mapName, staffPoint);  
    }
	   	 var bounds = new google.maps.LatLngBounds();
	   	 bounds.extend(new google.maps.LatLng(lat, lng));
       
         staffPoint.setMap(mapName);
         mapName.setCenter(new google.maps.LatLng(lat, lng));
         mapName.fitBounds(bounds);
         mapName.setZoom(initialZoom);
        return staffPoint;
    }
    changeMarker(geoList,filterColumn)    {
        for(var i=0;i< geoList.length;++i)
        {
          geoList[i].setIcon(this.GetIcon('school',geoList[i].customInfo[filterColumn+'Color']));
        }
    }
}