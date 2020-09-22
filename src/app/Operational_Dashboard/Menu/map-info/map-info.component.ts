import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-map-info',
  templateUrl: './map-info.component.html',
  styleUrls: ['./map-info.component.css']
})
export class MapInfoComponent implements OnInit {
  @Input()
  public mapService;

  public region = 'Hover Map';
  public total_cases: number;

  constructor() { }

  ngOnInit() {
    this.mapService.onRegionHover.subscribe((emitData) => {
      this.region = emitData.data;
      this.total_cases = emitData.total_cases;
    });
  }
}
