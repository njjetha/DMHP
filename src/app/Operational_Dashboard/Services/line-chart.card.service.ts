import { Subject } from 'rxjs';

export class CardLineChartService {

    private chartData: any;
    private chartDataUpdated = new Subject<any>();

    /* Chart Data Listener */

    getChartDataListener() {
        return this.chartDataUpdated.asObservable();
    }

    getChartData() {
        return this.chartData;
    }

    updateChartData(newData: any) {
        this.chartData = newData;
        this.chartDataUpdated.next(this.chartData);
    }
}
