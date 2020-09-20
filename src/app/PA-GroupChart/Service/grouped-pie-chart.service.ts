import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { GroupedLineChartService } from './grouped-line-chart.service';

@Injectable({
  providedIn: 'root'
})
export abstract class GroupedPieChartService {
  abstract name(): string;

  public onLegendClick = new EventEmitter<any>();

  private xColumn: string;
  private data: any;
  private keys: string[];
  private currkeys: string[];
  private columnMap = new Map<string, boolean>();
  private total: number;
  private newData = new Subject<any>();
  private parameter = new Subject<any>();
  private lineChartParameter = new Subject<any>();
  private color: string[];

  constructor() {
    this.onLegendClick.subscribe((d) => {
      this.columnMap.set(d, !this.columnMap.get(d));
      this.lineChartParameter.next({
        datatype: this.xColumn,
        key: d
      })
      //this.lineChartService.setColumn(this.xColumn, d);
      this.updateTotal();
    });
  }

  calculateTotal() {
    this.currkeys = []
    for (let [colName, colbool] of this.columnMap)
      if (colbool) this.currkeys.push(colName);

    this.total = 0;
    for (let colName of this.currkeys)
      this.total += this.data[colName];
    this.total = Number(this.total.toFixed(2));
  }

  updateTotal() {
    this.calculateTotal();
    let newData = {
      currkeys: this.currkeys,
      total: this.total
    }
      

    this.newData.next(newData);
  }

  updateParameter() {
    let parameter = {
      xColumn: this.xColumn,
      keys: this.keys,
      data: this.data,
      color: this.color
    };
      

    this.parameter.next(parameter);
  }

  getDataListener() {
    return this.newData.asObservable();
  }

  getParameterListener() {
    return this.parameter.asObservable();
  }

  getLineChartParameterListener() {
    return this.lineChartParameter.asObservable();
  }

  setData(data: any) {
    this.data = data;
  }

  setKeys(keys: string[]) {
    this.keys = keys;

    this.columnMap = new Map<string, boolean>();
    for (let key of this.keys)
      this.columnMap.set(key, true);
  }

  setColor(color: string[]) {
    this.color = color;
  }

  setxColumn(xColumn: string) {
    this.xColumn = xColumn;
  }
}
