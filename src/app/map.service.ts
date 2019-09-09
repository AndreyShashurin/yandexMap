import { Injectable } from '@angular/core';
import ymaps from 'ymaps';
(window as any).global = window;


@Injectable({
  providedIn: 'root'
})
export class MapService {
  ymaps: any;
  zoom = 10.4;
  myMap;
  markers: any[] = [
    {
      name: 'Точка 1',
      id: 1,
      lat: 55.847,
      lng: 37.6,
      color:'grey'
    },
    {
      name: 'Точка 2',
      id: 2,
      lat: 55.547,
      lng: 37.2,
      color:'black'
    },
    {
      name: 'Точка 3',
      id: 3,
      lat: 55.247,
      lng: 35.2,
      color:'blue'
    }
  ];
  constructor() { }

  init() {
    ymaps.load().then(
      (ymaps) => {
        this.myMap = new ymaps.Map("map", {
          center: [55.75, 37.61],
          zoom: this.zoom
        }, {
            yandexMapDisablePoiInteractivity: true,
            suppressMapOpenBlock: true
        });
        let markers = this.markers;
        let myMap = this.myMap;
        let BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
          '<div><b>{{properties.name}}</b></div>' +
          '<button id="button" data-id="{{properties.id}}">Удалить</button>', {
     
            build: function() {
              BalloonContentLayout.superclass.build.call(this);
              let propertiesClick = document.getElementById('button');
              propertiesClick.addEventListener("click", this.deleteMark);
            },
            
            clear: function() {
              BalloonContentLayout.superclass.clear.call(this);
            }, 

            deleteMark: function(e) {
              let index = markers.map(e => e.id).indexOf(Number(e.target.getAttribute('data-id')));
              markers.splice(index, 1); 
              myMap.geoObjects.each(function (item) {
                if (item.properties.get('id') == Number(e.target.getAttribute('data-id'))) {
                  myMap.geoObjects.remove(item);
                }
             });
            }
        });

        for (let mark of this.markers){
          let placemark = new ymaps.Placemark([mark.lat, mark.lng], {
                id: mark.id,
                name: mark.name
            }, {
                balloonContentLayout: BalloonContentLayout,
                balloonCloseButton: true,
                selectOnClick: false,
                hideIconOnBalloonOpen: false,
                iconColor: mark.color
            });
            this.myMap.geoObjects.add(placemark);
        }
      }).catch(error => console.log(error));
  }
}
