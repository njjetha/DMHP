import { Injectable } from '@angular/core';
import { GroupedPieChartService } from './grouped-pie-chart.service';

@Injectable({
  providedIn: 'root'
})
export class GroupedPieChartTainingService extends GroupedPieChartService {

  constructor() {
    super();
    this.initialize();
  }

  name() {
    return "GroupedPieChartTainingService";
  }

  initialize(){
    this.setxColumn("Training");
    this.setColor(["#28B463", "interpolateGreens"]);
  }
}
