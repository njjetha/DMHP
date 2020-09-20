import { Injectable } from '@angular/core';
import { GroupedPieChartService } from './grouped-pie-chart.service';

@Injectable({
  providedIn: 'root'
})
export class GroupedPieChartCasesService extends GroupedPieChartService {

  constructor() {
    super();
    this.initialize();
  }

  name() {
    return "GroupedPieChartCasesService";
  }

  initialize() {
    this.setxColumn("Cases");
    this.setColor(["#f52727", "interpolateReds"]);
  }
}
