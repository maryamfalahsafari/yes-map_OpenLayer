import { Injectable } from '@angular/core';
import { ElementRef } from '@angular/core';

import { Service } from './service';


declare var ol ;
declare var google;
//declare var olgm;
//declare var OpenLayers;


@Injectable()
export class OpenLayersService {

    errorMessage:string;

    constructor(public _service: Service) { }

    loadAndReturnMap(mapElement:ElementRef,mapInfo:any){

        var map = new ol.Map({
            layers: [
                new ol.layer.Tile({
            source: new ol.source.OSM({
                // url: 'http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
                // attributions: [
                //     new ol.Attribution({ html: '© Google' }),
                //     new ol.Attribution({ html: '<a href="https://developers.google.com/maps/terms">Terms of Use.</a>' })
                // ]
            })})
            ],
            target: mapElement.nativeElement,
            controls: ol.control.defaults({
            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                collapsible: false
            })
            }),
            view: new ol.View({
                projection: 'EPSG:4326',
            center: [mapInfo.lng, mapInfo.lat],
            zoom: mapInfo.zoom
            })
        });
        map.on('singleclick', function (evt) {
            console.log(evt);
        });
        // var select = new ol.interaction.Select({
        //     // style: new ol.style.Style({
        //     //     stroke: new ol.style.Stroke({
        //     //     color: '#0288D1',
        //     //     width: 2
        //     //     })
        //     // })
        // });
        // map.addInteraction(select);
        // select.on('select', function(e) {
        //     console.log(e);
        // });
        return map;       
    }
    loadGeoJsonOnMap(map,loader){

            var self=this;
            var vectorSource1 = new ol.source.Vector({
                //strategy: ol.loadingstrategy.bbox,
                strategies:  ol.loadingstrategy.Fixed,
                loader: function(extent, resolution, projection) {
                    self._service.getEM_ActualGoodCoverage()
                            .subscribe(result => 
                            {
                                var features= (new ol.format.GeoJSON()).readFeatures(result)
                                vectorSource1.addFeatures(features);
                            },error => self.errorMessage = <any>error,
                            () => {
                                //loader.dismiss();
                            });
                },
                // url: 'http://localhost:8081/geoserver/YTLC_Geo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=YTLC_Geo:EM_ActualGoodCoverage_Public&maxFeatures=50&outputFormat=application%2Fjson',
                // format: new ol.format.GeoJSON()
            });
            var vectorSource2 = new ol.source.Vector({
                //strategy: ol.loadingstrategy.bbox,
                strategies:  ol.loadingstrategy.Fixed,
                loader: function(extent, resolution, projection) {
                    self._service.getEM_LTE_ActualGoodCoverge()
                            .subscribe(result => 
                            {
                                var features= (new ol.format.GeoJSON()).readFeatures(result)
                                vectorSource2.addFeatures(features);
                            },error => self.errorMessage = <any>error,
                            () => {
                                //loader.dismiss();
                            });
                },
                // url: 'http://localhost:8081/geoserver/YTLC_Geo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=YTLC_Geo:EM_LTE_ActualGoodCoverge_Public&maxFeatures=50&outputFormat=application%2Fjson',
                // format: new ol.format.GeoJSON()
            });
            var vectorSource3 = new ol.source.Vector({
                //strategy: ol.loadingstrategy.bbox,
                strategies:  ol.loadingstrategy.Fixed,
                loader: function(extent, resolution, projection) {
                    self._service.getWM_ActualGoodCoverage()
                            .subscribe(result => 
                            {
                                var features= (new ol.format.GeoJSON()).readFeatures(result)
                                vectorSource3.addFeatures(features);
                            },error => self.errorMessage = <any>error,
                            () => {
                                //loader.dismiss();
                            });
                },
                // url: 'http://localhost:8081/geoserver/YTLC_Geo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=YTLC_Geo:WM_ActualGoodCoverage_Public&maxFeatures=50&outputFormat=application%2Fjson',
                // format: new ol.format.GeoJSON()
            });
            var vectorSource4 = new ol.source.Vector({
                 //strategy: ol.loadingstrategy.bbox,
                strategies:  ol.loadingstrategy.Fixed,
                loader: function(extent, resolution, projection) {
                    self._service.getWM_LTE_ActualGoodCoverge()
                            .subscribe(result => 
                            {
                                var features= (new ol.format.GeoJSON()).readFeatures(result)
                                vectorSource4.addFeatures(features);
                            },error => self.errorMessage = <any>error,
                            () => {
                                loader.dismiss();
                            });
                },
                // url: 'http://localhost:8081/geoserver/YTLC_Geo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=YTLC_Geo:WM_LTE_ActualGoodCoverge_Public&maxFeatures=50&outputFormat=application%2Fjson',
                // format: new ol.format.GeoJSON()
            });

            var vectorLayer1 = new ol.layer.Vector({
                source: vectorSource1,
            // style: styleFunction
            });
            var vectorLayer2 = new ol.layer.Vector({
                source: vectorSource2,
            // style: styleFunction
            });
            var vectorLayer3 = new ol.layer.Vector({
                source: vectorSource3,
            // style: styleFunction
            });
            var vectorLayer4 = new ol.layer.Vector({
                source: vectorSource4,
            // style: styleFunction
            });
            map.addLayer(vectorLayer1);
            map.addLayer(vectorLayer2);
            map.addLayer(vectorLayer3);
            map.addLayer(vectorLayer4);
    }
    loadPoints(map){
         var iconFeatures=[];
                var iconFeature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([ 103.45276389,1.33376008], 'EPSG:4326',     
                'EPSG:4326')),
                name: 'Null Island',
                population: 4000,
                rainfall: 500
                });

                var iconFeature1 = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([ 103.46407339,1.34348066], 'EPSG:4326',     
                'EPSG:4326')),
                name: 'Null Island Two',
                population: 4001,
                rainfall: 501
                });

                iconFeatures.push(iconFeature);
                iconFeatures.push(iconFeature1);
                var image = new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 0, 0.9)'
                }),
                stroke: new ol.style.Stroke({color: 'red', width: 1})
                });


                var vector_layer = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: iconFeatures,
                    }),
                    style:new ol.style.Style({
                        image: new ol.style.Icon(({
                                // anchor: [0.5, 46],
                                // anchorXUnits: 'fraction',
                                // anchorYUnits: 'pixels',
                                // opacity: 0.75,
                                src: 'assets/icon/ico_base_station.svg'
                            })),
                            cursor:'pointer'
                    })
                
                });
                map.addLayer(vector_layer);

    }
    generatePoint(mainArr,mapName,callBack,filterColumn){
        
        var markersArray=new Array<any>();
        var yesMarkersArray=new Array<any>();
        for (var i = 0; i < mainArr.length ; i++) {
            if (mainArr[i].Kind=='Yes')
                this.createMarker(i,mainArr, mapName,callBack,yesMarkersArray,'yes',filterColumn);
                else this.createMarker(i,mainArr, mapName,callBack,markersArray,'school',filterColumn);
        }
        var initialZoom=12;
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
    createMarker(i,mainArr, mapName,callBack,markersArray,type,filterColumn) {


         var iconFeature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([mainArr[i].Latitude, mainArr[i].Longitude], 'EPSG:4326',     
                'EPSG:4326')),
                name: 'Null Island',
                population: 4000,
                rainfall: 500
            });
        // var staffPoint = new google.maps.Marker({
        //         position:  new google.maps.LatLng(mainArr[i].Latitude, mainArr[i].Longitude),
        //         icon:  this.GetIcon(type,mainArr[i][filterColumn+'Color']?mainArr[i][filterColumn+'Color']:''),//type=='school'?this.getIconUrl(mainArr[i][filterColumn+'Color']):'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
        //         customInfo: mainArr[i],
        //         zIndex : 0});
        
        // var infowindow = new google.maps.InfoWindow({});
        
	   
        //         var self=this;
        // staffPoint.addListener("click",function(event){
        //     console.log(event.latLng);
        //     var html='';
        //     if (type=='school')
        //     {
        //         html = "<span style='color:black;'>SchoolCode : <b>" + this.customInfo.SchoolCode+'</b></span><br/>';
        //         html += "<span style='color:black;'>SchoolServingSite : <b>" + this.customInfo.SchoolServingSite+'</b></span><br/>';
        //         html += "<span style='color:black;'>NoOfAltitudeTeachers : <b>" + this.customInfo.NoOfAltitudeTeachers+'</b></span><br/>';
        //         html += "<span style='color:black;'>NoOfPlanUpgrade : <b>" + this.customInfo.NoOfPlanUpgrade+'</b></span><br/>';
        //         html += "<span style='color:black;'>TotalAddOnPurchase : <b>" + this.customInfo.TotalAddOnPurchase+'</b></span><br/>';
        //         html += "<span style='color:black;'>SchoolCoverageStatusASN : <b>" + this.customInfo.SchoolCoverageStatusASN+'</b></span><br/>';
        //         html += "<span style='color:black;'>Location : <b>" + this.customInfo.Latitude+','+this.customInfo.Longitude+'</b></span><br/>';
                
        //     }else if (type=='yes'){
        //         html = "<span style='color:black;'>Pincode : <b>" + this.customInfo.Pincode+'</b></span><br/>';
        //         html += "<span style='color:black;'>StoreName : <b>" + this.customInfo.StoreName+'</b></span><br/>';
        //         html += "<span style='color:black;'>Telephone : <b>" + this.customInfo.Telephone+'</b></span><br/>';
        //         html += "<span style='color:black;'>Fax : <b>" + this.customInfo.Fax+'</b></span><br/>';
        //         html += "<span style='color:black;'>Website : <b>" + this.customInfo.Website+'</b></span><br/>';
        //         html += "<span style='color:black;'>Location : <b>" + this.customInfo.Latitude+','+this.customInfo.Longitude+'</b></span><br/>';
                

        //     }else {
        //          html = "<span style='color:black;'>Site_ID : <b>" + this.customInfo.Site_ID+'</b></span><br/>';
        //         html += "<span style='color:black;'>NE_ID : <b>" + this.customInfo.NE_ID+'</b></span><br/>';
        //         html += "<span style='color:black;'>City : <b>" + this.customInfo.City+'</b></span><br/>';
        //         html += "<span style='color:black;'>eNB_ID : <b>" + this.customInfo.eNB_ID+'</b></span><br/>';
        //         html += "<span style='color:black;'>eNB_Name : <b>" + this.customInfo.eNB_Name+'</b></span><br/>';
        //         html += "<span style='color:black;'>Location : <b>" + this.customInfo.Latitude+','+this.customInfo.Longitude+'</b></span><br/>';

        //     }
        //                     infowindow.setContent(html);
        //                     infowindow.open(mapName, staffPoint);
        // });
       
        // staffPoint.setMap(mapName);
		// markersArray.push(staffPoint);
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













    loadGeoJsonOnMap_(mapInfo){

            var vectorSource1 = new ol.source.Vector({
                url: 'http://localhost:8081/geoserver/YTLC_Geo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=YTLC_Geo:EM_ActualGoodCoverage_Public&maxFeatures=50&outputFormat=application%2Fjson',
                format: new ol.format.GeoJSON()
            });
            var vectorSource2 = new ol.source.Vector({
                url: 'http://localhost:8081/geoserver/YTLC_Geo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=YTLC_Geo:EM_LTE_ActualGoodCoverge_Public&maxFeatures=50&outputFormat=application%2Fjson',
                format: new ol.format.GeoJSON()
            });
            var vectorSource3 = new ol.source.Vector({
                url: 'http://localhost:8081/geoserver/YTLC_Geo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=YTLC_Geo:WM_ActualGoodCoverage_Public&maxFeatures=50&outputFormat=application%2Fjson',
                format: new ol.format.GeoJSON()
            });
            var vectorSource4 = new ol.source.Vector({
                url: 'http://localhost:8081/geoserver/YTLC_Geo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=YTLC_Geo:WM_LTE_ActualGoodCoverge_Public&maxFeatures=50&outputFormat=application%2Fjson',
                format: new ol.format.GeoJSON()
            });

            var vectorLayer1 = new ol.layer.Vector({
                source: vectorSource1,
            // style: styleFunction
            });
            var vectorLayer2 = new ol.layer.Vector({
                source: vectorSource2,
            // style: styleFunction
            });
            var vectorLayer3 = new ol.layer.Vector({
                source: vectorSource3,
            // style: styleFunction
            });
            var vectorLayer4 = new ol.layer.Vector({
                source: vectorSource4,
            // style: styleFunction
            });


            /* var iconFeatures=[];
                var iconFeature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([ 101.74167,3.198342], 'EPSG:4326',     
                'EPSG:4326')),
                name: 'Null Island',
                population: 4000,
                rainfall: 500
                });

                var iconFeature1 = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([ 100.27229,6.42714], 'EPSG:4326',     
                'EPSG:4326')),
                name: 'Null Island Two',
                population: 4001,
                rainfall: 501
                });

                iconFeatures.push(iconFeature);
                iconFeatures.push(iconFeature1);
                var image = new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 0, 0.9)'
                }),
                stroke: new ol.style.Stroke({color: 'red', width: 1})
                });


                var vector_layer = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: iconFeatures,
                    }),
                    style:new ol.style.Style({
                        image: image
                    })
                
                });*/
        
     
            var map = new ol.Map({
                //interactions: olgm.interaction.defaults(),
                layers: [
                new ol.layer.Tile({
                source: new ol.source.OSM() }),
                // vectorLayer1,
                // vectorLayer2,
                // vectorLayer3,
               //  vectorLayer4,
                // vector_layer

                ],
                target: 'map',
                controls: ol.control.defaults({
                attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                    collapsible: false
                })
                }),
                view: new ol.View({
                projection: 'EPSG:4326',
                center: [mapInfo.lng, mapInfo.lat],
                zoom: mapInfo.zoom
                })
            });
           map.addLayer(vectorLayer1);
           map.addLayer(vectorLayer2);
           map.addLayer(vectorLayer3);
           map.addLayer(vectorLayer4);

    }
    loadBaseLayer(){
        // var center = [-10997148, 4569099];

        // var googleLayer = new olgm.layer.Google();

        // var osmLayer = new ol.layer.Tile({
        // source: new ol.source.OSM(),
        // visible: false
        // });

        // var tileWMSLayer  =  new ol.layer.Tile({
        // extent: [-13884991, 2870341, -7455066, 6338219],
        // source: new ol.source.TileWMS({
        //     url: 'http://wms.ess-ws.nrcan.gc.ca/wms/toporama_en',
        //     params: {'LAYERS': 'limits', 'TILED': true},
        //     serverType: 'geoserver'
        // }),
        // visible: true
        // });

        // var tileWMSLayer2  =  new ol.layer.Tile({
        // extent: [-13884991, 2870341, -7455066, 6338219],
        // source: new ol.source.TileWMS({
        //     url: 'http://demo.boundlessgeo.com/geoserver/wms',
        //     params: {'LAYERS': 'topp:states', 'TILED': true},
        //     serverType: 'geoserver'
        // }),
        // visible: true
        // });

        // var imageWMSLayer = new ol.layer.Image({
        // extent: [-13884991, 2870341, -7455066, 6338219],
        // source: new ol.source.ImageWMS({
        //     url: 'http://wms.ess-ws.nrcan.gc.ca/wms/toporama_en',
        //     params: {'LAYERS': 'limits', 'TILED': true},
        //     serverType: 'geoserver'
        // }),
        // visible: false
        // })

        // var imageWMSLayer2 = new ol.layer.Image({
        // extent: [-13884991, 2870341, -7455066, 6338219],
        // source: new ol.source.ImageWMS({
        //     url: 'http://demo.boundlessgeo.com/geoserver/wms',
        //     params: {'LAYERS': 'topp:states', 'TILED': true},
        //     serverType: 'geoserver'
        // }),
        // visible: false
        // })

        // var map = new ol.Map({
        // // use OL3-Google-Maps recommended default interactions
        // interactions: olgm.interaction.defaults(),
        // layers: [
        //     googleLayer,
        //     osmLayer,
        //     //tileWMSLayer,
        //    // tileWMSLayer2,
        //     //imageWMSLayer,
        //    // imageWMSLayer2
        // ],
        // target: 'map',
        // view: new ol.View({
        //     center: center,
        //     zoom: 4
        // })
        // });

        // var olGM = new olgm.OLGoogleMaps({map: map}); // map is the ol.Map instance
        // olGM.activate();
    }
    test(mapInfo){
        // var  map = new OpenLayers.Map('map', {
        //     //projection: 'EPSG:3857',
        //     layers: [
        //         new OpenLayers.Layer.Google(
        //             "Google Physical",
        //             {type: google.maps.MapTypeId.TERRAIN}
        //         ),
        //         new OpenLayers.Layer.Google(
        //             "Google Streets", // the default
        //             {numZoomLevels: 20}
        //         ),
        //         new OpenLayers.Layer.Google(
        //             "Google Hybrid",
        //             {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20}
        //         ),
        //         new OpenLayers.Layer.Google(
        //             "Google Satellite",
        //             {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}
        //         )
        //     ],
        //     center: new OpenLayers.LonLat(mapInfo.lat, mapInfo.lng),
        //         // Google.v3 uses web mercator as projection, so we have to
        //         // transform our coordinates
        //         //.transform('EPSG:4326', 'EPSG:3857'),
        //     zoom: 5
        // });
        // map.addControl(new OpenLayers.Control.LayerSwitcher());

        // // World Cities
        // var citiesLayer = new OpenLayers.Layer.Vector("WorldCities (GeoJSON)", {
        //     protocol: new OpenLayers.Protocol.HTTP({
        //     url: "http://localhost:8081/geoserver/YTLC_Geo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=YTLC_Geo:WM_ActualGoodCoverage_Public&maxFeatures=50&outputFormat=application%2Fjson",
        //     format: new OpenLayers.Format.GeoJSON()
        //     }),
        //     // strategies: [
        //     // new OpenLayers.Strategy.Fixed(),
        //     // new OpenLayers.Strategy.Cluster({distance:
        //     // 15})]
        // });
        // map.addLayer(citiesLayer);
        
        // add behavior to html
        // var animate = document.getElementById("animate");
        // animate.onclick = function() {
        //     for (var i=map.layers.length-1; i>=0; --i) {
        //         map.layers[i].animationEnabled = true;
        //     }
        // };
    }
    loadBingMap(){
        var styles = [
        'Road',
       // 'Aerial',
       // 'AerialWithLabels',
        //'collinsBart',
       // 'ordnanceSurvey'
      ];
      var layers = [];
      var i, ii;
      for (i = 0, ii = styles.length; i < ii; ++i) {
        layers.push(new ol.layer.Tile({
          visible: true,
          preload: Infinity,
          source: new ol.source.BingMaps({
            key: 'AmzdEBfGNb-BVXBi_pbH3sUyMU8JVs4MeDHLJSYmE2hABM2xd-z-amivtnd6FcRu',
            imagerySet: styles[i]
            // use maxZoom 19 to see stretched tiles instead of the BingMaps
            // "no photos at this zoom level" tiles
            // maxZoom: 19
          })
        }));
      }

      layers.push(    new ol.layer.Tile({
            source: new ol.source.OSM({
                url: 'http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
                attributions: [
                    new ol.Attribution({ html: '© Google' }),
                    new ol.Attribution({ html: '<a href="https://developers.google.com/maps/terms">Terms of Use.</a>' })
                ]
            })}));
        for(var m=0;m<layers.length;++m){
            layers[m].setOpacity(0.1);
        }

   
      var map = new ol.Map({
        layers: layers,
        // Improve user experience by loading tiles while dragging/zooming. Will make
        // zooming choppy on mobile or slow devices.
        loadTilesWhileInteracting: true,
        target: 'map',
         controls: [
             new ol.control.Attribution(),
                new ol.control.MousePosition({
                    undefinedHTML: 'outside',
                    projection: 'EPSG:4326',
                    coordinateFormat: function(coordinate) {
                        return ol.coordinate.format(coordinate, '{x}, {y}', 4);
                    }
                }),
                new ol.control.OverviewMap({
                    collapsed: false
                }),
                new ol.control.Rotate({
                    autoHide: false
                }),
                new ol.control.ScaleLine(),
                new ol.control.Zoom(),
                new ol.control.ZoomSlider(),
                new ol.control.ZoomToExtent(),
                new ol.control.FullScreen()
         ],
        view: new ol.View({
          center: [-6655.5402445057125, 6709968.258934638],
          zoom: 13
        })
      });
      console.log('sdsdsdsd',layers);

   
    }
    loadWMSWithOSM(){
         var layers = [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        // new ol.layer.Tile({
        //   extent: [-13884991, 2870341, -7455066, 6338219],
        //   source: new ol.source.TileWMS({
        //     url: 'https://ahocevar.com/geoserver/wms',
        //     params: {'LAYERS': 'topp:states', 'TILED': true},
        //     serverType: 'geoserver'
        //   })
        // }),
        // new ol.layer.Tile({
        //   //extent: [-13884991, 2870341, -7455066, 6338219],
        //   source: new ol.source.TileWMS({
        //     url: 'http://localhost:8081/geoserver/wms',//http://localhost:8081/geoserver/gwc/service/wms
        //     params: {'LAYERS': 'topp:states', 'TILED': true,'transparent': true},
        //     serverType: 'geoserver'
        //   })
        // }),
            new ol.layer.Tile({
          extent: [-13884991, 2870341, -7455066, 6338219],
          source: new ol.source.TileWMS({
            url: 'http://localhost:8081/geoserver/wms',
            params: {'LAYERS': 'topp:tasmania_cities', 'TILED': true,'transparent': true},
            serverType: 'geoserver'
          })
        }),
        //    new ol.layer.Tile({
        //   //extent: [-13884991, 2870341, -7455066, 6338219],
        //   source: new ol.source.TileWMS({
        //     url: 'http://localhost:8081/geoserver/wms',
        //     params: {'LAYERS': 'topp:tasmania_state_boundaries', 'TILED': true,'transparent': true},
        //     serverType: 'geoserver'
        //   })
        // }),
       
        //      new ol.layer.Tile({
        //   //extent: [-13884991, 2870341, -7455066, 6338219],
        //   source: new ol.source.TileWMS({
        //     url: 'http://localhost:8081/geoserver/wms',
        //     params: {'LAYERS': 'YTLC_Geo:EM_LTE_ActualGoodCoverge_Public_', 'TILED': true,'transparent': true},
        //     serverType: 'geoserver'
        //   })
        // }),
                new ol.layer.Tile({
          //extent: [-13884991, 2870341, -7455066, 6338219],
          source: new ol.source.TileWMS({
            url: 'http://localhost:8081/geoserver/gwc/service/wms',
            params: {'LAYERS': 'YTLC_Geo:WM_ActualGoodCoverage_Public_','SRS':'EPSG:4326', 'TILED': true,'transparent': true},
            serverType: 'geoserver'
          })
        }),
        //  new ol.layer.Tile({
        //   extent: [143.83482400000003,-43.648056,148.47914100000003,-39.573891],
        //   source: new ol.source.TileWMS({
        //     url: 'http://localhost:8081/geoserver/wms',
        //     params: {'LAYERS': 'topp:tasmania_state_boundaries', 'TILED': true,'transparent': true},
        //     serverType: 'geoserver'
        //   })
        // }),

      ];
      var map = new ol.Map({
        layers: layers,
        target: 'map',
        view: new ol.View({
          center: [-10997148, 4569099],
          zoom: 4
        })
      });
    }
    testTileLayer(){
         var projExtent = ol.proj.get('EPSG:3857').getExtent();
      var startResolution = ol.extent.getWidth(projExtent) / 256;
      var resolutions = new Array(22);
      for (var i = 0, ii = resolutions.length; i < ii; ++i) {
        resolutions[i] = startResolution / Math.pow(2, i);
      }
      var tileGrid = new ol.tilegrid.TileGrid({
        extent: [-13884991, 2870341, -7455066, 6338219],
        resolutions: resolutions,
        tileSize: [512, 256]
      });

      var layers = [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        new ol.layer.Tile({
          source: new ol.source.TileWMS({
            url: 'https://ahocevar.com/geoserver/wms',
            params: {'LAYERS': 'YTLC_Geo:WM_ActualGoodCoverage_Public_', 'TILED': true},
            serverType: 'geoserver',
            tileGrid: tileGrid
          })
        })
      ];
      var map = new ol.Map({
        layers: layers,
        target: 'map',
        view: new ol.View({
          center: [-10997148, 4569099],
          zoom: 4
        })
      });
    }
}


 //     new ol.layer.Tile({
        //   //extent: [-13884991, 2870341, -7455066, 6338219],
        //   source: new ol.source.TileWMS({
        //     url: 'http://localhost:8081/geoserver/gwc/service/wms',
        //     params: {'LAYERS': 'topp:tasmania_water_bodies',
        //     'FORMAT':'image/png',
        //      'SERVICE':'WMS',
        //      'VERSION':'1.1.1',
        //      'REQUEST':'GetMap',
        //      //'VIEWPARAMS':'timestep:1;datasetid:6',
        //      'SRS':'EPSG:4326',
        //      'BBOX':'112.5,22.5,135,45',
        //      'WIDTH':'320',
        //      'HEIGHT':'320'
        //              },
        //     serverType: 'geoserver'
        //     //http://localhost:8081/geoserver/gwc/service/wms?
        //     //LAYERS=topp:tasmania_water_bodies
        //     //&FORMAT=image/png
        //     //&SERVICE=WMS
        //     //&VERSION=1.1.1
        //     //&REQUEST=GetMap
        //     //&STYLES=
        //     //&VIEWPARAMS=timestep:1;datasetid:6
        //     //&SRS=EPSG:4326
        //     //&BBOX=112.5,22.5,135,45
        //     //&WIDTH=256&HEIGHT=256

        //http://localhost:8081/geoserver/gwc/service/wms?LAYERS=YTLC_Geo:WM_LTE_ActualGoodCoverge_Public_&SRS=EPSG:4326

        //     //http://localhost:8081/geoserver/gwc/service/wms?
        //     //SERVICE=WMS
        //     //&VERSION=1.3.0
        //     //&REQUEST=GetMap
        //     //&FORMAT=image%2Fpng
        //     //&TRANSPARENT=true
        //     //&LAYERS=topp%3Atasmania_water_bodies
        //     //&transparent=true
        //     //&SRS=EPSG%3A4326
        //     //&WIDTH=320&HEIGHT=320
        //     //&CRS=EPSG%3A3857
        //     //&STYLES=
        //     //&FORMAT_OPTIONS=dpi%3A113
        //     //&BBOX=-12523442.714243278%2C2504688.542848654%2C-10018754.171394622%2C5009377.08569731
        //   })
        // }), 