import { Injectable,ElementRef } from '@angular/core';

declare var ol ;
declare var google;
//declare var olgm;
//declare var OpenLayers;


@Injectable()
export class OpenLayers4Service {

    constructor() { }

    loadAndReturnMap(mapElement:ElementRef,mapInfo:any){
       

     var map = new ol.Map({
        layers: [
            new ol.layer.Tile({
        source: new ol.source.OSM({
            url: 'http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
            attributions: [
                new ol.Attribution({ html: '© Google' }),
                new ol.Attribution({ html: '<a href="https://developers.google.com/maps/terms">Terms of Use.</a>' })
            ]
        })})
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
          zoom: 4
        })
      });

  
       
    }
    loadGeoJsonOnMap(mapInfo){

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

               // var googleLayer = new olgm.layer.Google();


            var styles = [
                    'Road',
                    'Aerial',
                    'AerialWithLabels',
                    'collinsBart',
                    'ordnanceSurvey'
                ];
                var layers = [];
                var i, ii;
                for (i = 0, ii = styles.length; i < ii; ++i) {
                    layers.push(new ol.layer.Tile({
                    visible: false,
                    preload: Infinity,
                    source: new ol.source.BingMaps({
                        key: 'AmzdEBfGNb-BVXBi_pbH3sUyMU8JVs4MeDHLJSYmE2hABM2xd-z-amivtnd6FcRu',//'Your Bing Maps Key from http://www.bingmapsportal.com/ here',
                        imagerySet: styles[i]
                        // use maxZoom 19 to see stretched tiles instead of the BingMaps
                        // "no photos at this zoom level" tiles
                        // maxZoom: 19
                    })
                    }));
                }


                var osmLayer = new ol.layer.Tile({
                source: new ol.source.OSM() });
        
     
            console.log('mapInfo',mapInfo);
            var map = new ol.Map({
                //interactions: olgm.interaction.defaults(),
                layers: [
                //googleLayer,
                layers,
               // osmLayer,
                 vectorLayer1,
                 vectorLayer2,
                 vectorLayer3,
                 vectorLayer4,
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
            // var olGM = new olgm.OLGoogleMaps({map: map}); // map is the ol.Map instance
            // olGM.activate();

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

    //   var select = document.getElementById('layer-select');
    //   function onChange() {
    //     // var style = select.value;
    //     // for (var i = 0, ii = layers.length; i < ii; ++i) {
    //     //   layers[i].setVisible(styles[i] === style);
    //     // }
    //   }
    //   select.addEventListener('change', onChange);
    //   onChange();
    }
}