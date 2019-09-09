import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MapService } from './map.service';
import ymaps from 'ymaps';
(window as any).global = window;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  ymaps: any;
  marksForm: FormGroup;
  markers: any[];
  id: number;
  
  constructor(private mapService: MapService){
    this.marksForm = new FormGroup({
      'id': new FormControl(null),
      'lat': new FormControl(null),
      'lng': new FormControl(null),
      'name': new FormControl(null),
      'color': new FormControl(null)
    });    
    this.markers = mapService.markers;
  }

  ngOnInit() {
    this.mapService.init();
  }

  addMarker() {
    this.id = this.mapService.markers[this.mapService.markers.length - 1].id +1;
    this.marksForm.value.id = this.id;
    this.mapService.markers.push(this.marksForm.value);  
    ymaps.load().then(
      (ymaps) => { 
        let markers = this.mapService.markers;
        let myMap = this.mapService.myMap;
        let BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
          '<div><b>{{properties.name}}</b></div>' +
          '<button id="button" data-id="{{properties.id}}">Удалить</button>', {
     
            build: function() {
              BalloonContentLayout.superclass.build.call(this);
              let propertiesClick = document.getElementById('button');
              propertiesClick.addEventListener("click", this.deleteMark);
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

        let placemark = new ymaps.Placemark([this.marksForm.value.lat, this.marksForm.value.lng], {
          name: this.marksForm.value.name,
          id: this.id,
        }, {
          balloonContentLayout: BalloonContentLayout,
          balloonCloseButton: true,
          selectOnClick: false,
          hideIconOnBalloonOpen: false,
          iconColor: this.marksForm.value.color
        });
        this.mapService.myMap.geoObjects.add(placemark);
      })
  }

  getCoordsMark(mark):void {
    this.mapService.myMap.setCenter([mark.lat, mark.lng],this.mapService.zoom)
  }
  
}
