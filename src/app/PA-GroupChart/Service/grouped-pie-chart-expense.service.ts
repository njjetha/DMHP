import { Injectable } from '@angular/core';
import { GroupedPieChartService } from './grouped-pie-chart.service';

@Injectable({
  providedIn: 'root'
})
export class GroupedPieChartExpenseService extends GroupedPieChartService {

  constructor() {
    super();
    this.initialize();
  }

  name() {
    return "GroupedPieChartExpenseService";
  }

  initialize(){
    this.setxColumn("Expense");
    this.setColor(["#2E86C1", "interpolateBlues"]);
  }
}
