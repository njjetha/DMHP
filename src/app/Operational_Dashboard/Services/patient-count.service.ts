import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

// Enum - Granularity option
export enum Granualirity {
  ANNUAL = 0,
  MONTHWISE = 1,
  QUATERWISE = 2
}

// Enum - Normalize option
export enum Normalise {
  NO = 0,
  YES = 1
}

// Enum - Sorting option for chart
export enum SortOption {
  RANKWISE = 0,
  ALPHABETICALLY = 1
}

export const START_YEAR = 2018;

@Injectable()
export abstract class PatientCountService {

  constructor(protected http: HttpClient) {
    this.initialize();
    this.port = 3000;
    this.onLegendClick.subscribe((d) => {
      this.columnMap.set(d, !this.columnMap.get(d));
      this.updateData();
    });

  }

  public onDoubleClick = new EventEmitter<any>();
  public onLegendClick = new EventEmitter<any>();
  public onRegionHover = new EventEmitter<any>();

  private keys: string[];
  private currkeys: string[];
  private columnMap = new Map<string, boolean>();
  private granularity: number;
  private sortOption: number;
  private normalize: number;
  private month: number;
  private year: number;
  private quarter: number;
  private dataURL: {
    annual: string,
    monthly: string,
    quarterly: string
  };
  private data: {
    annualData: any,
    monthlyData: any,
    quarterlyData: any
  };
  private currData: any;
  private newData = new Subject<any>();
  private parameter = new Subject<any>();
  private sortKey: string;
  private xLabel: string;
  private yLabel: string;
  private xColumn: string;
  private dataType: string;
  private mapName: string;
  private mapDirPath: string;
  private fileExt: string;
  private normalizeDisabled: boolean;
  private port: number;
  abstract name(): string;
  abstract getSortOptions(): string[];

  initialize() {
    this.granularity = Granualirity.ANNUAL;
    this.normalize = Normalise.NO;
    this.sortOption = SortOption.RANKWISE;
    this.sortKey = 'Total';
    this.year = 2018;
    this.month = 1;
    this.quarter = 1;
    this.normalizeDisabled = false;
  }

  getYearDataFromServer(postData: { year: number, districtId?: number }) {
    this.http.post<any>(environment.backendIP + '/' + this.dataURL.annual, postData)
      .subscribe(resAnnualData => {

        this.http.post<any>(environment.backendIP + '/' + this.dataURL.monthly, postData)
          .subscribe(resMonthlyData => {

            this.http.post<any>(environment.backendIP + '/' + this.dataURL.quarterly, postData)
              .subscribe(resQuaterlyData => {
                this.data = {
                  annualData: resAnnualData,
                  monthlyData: resMonthlyData,
                  quarterlyData: resQuaterlyData
                };
                this.updateData();

              });
          });
      });
  }

  updateDataAsPerGranularity() {
    switch (this.granularity) {
      case Granualirity.ANNUAL: {
        this.currData = this.data.annualData;
        break;
      }
      case Granualirity.MONTHWISE: {
        this.currData = (this.data.monthlyData[this.month] == null) ? [] : this.data.monthlyData[this.month];
        break;
      }
      case Granualirity.QUATERWISE: {
        this.currData = (this.data.quarterlyData[this.quarter] == null) ? [] : this.data.quarterlyData[this.quarter];
        break;
      }
    }
    this.currData = JSON.parse(JSON.stringify(this.currData));
  }

  normalizeData() {
    if (this.normalize == Normalise.YES) {
      const wrtColumn = 'Population';
      this.currData.forEach((d) => {
        for (const col of this.keys) {
          d[col] = Number(((d[col] / d[wrtColumn]) * 100).toFixed(2));
        }
      });
    }
    // this.normalize = Normalise.NO;
  }

  sortData() {
    const key = this.sortKey;
    this.currData.sort(function(a, b) {
      return a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0;
    });
  }

  calculateTotal() {
    this.currkeys = [];
    for (const [colName, colbool] of this.columnMap) {
      if (colbool) {
        this.currkeys.push(colName);
      }
    }

    for (const d of this.currData) {
      let tempTotal = 0;
      for (const colName of this.currkeys) {
        tempTotal += d[colName];
      }
      d.Total = Number(tempTotal.toFixed(2));
    }
  }

  updateData() {
    this.updateDataAsPerGranularity();
    this.normalizeData();
    this.calculateTotal();
    this.sortData();
    const newData = {
      normalise: (this.normalize == Normalise.YES) ? true : false,
      currkeys: this.currkeys,
      data: this.currData
    };
    this.newData.next(newData);
  }

  updateParameter() {
    const parameter = {
      xLabel: this.xLabel,
      yLabel: this.yLabel,
      xColumn: this.xColumn,
      dataType: this.dataType,
      keys: this.keys,
      mapName: this.mapName,
      mapDirPath: this.mapDirPath,
      fileExt: this.fileExt,
      populationDisabled: this.normalizeDisabled
    };
    this.parameter.next(parameter);
  }

  setSortOption(sortOption: number) {
    this.sortOption = sortOption;
    switch (this.sortOption) {
      case SortOption.ALPHABETICALLY: {
        this.sortKey = this.xColumn;
        break;
      }
      case SortOption.RANKWISE: {
        this.sortKey = 'Total';
        break;
      }
      default : {
        this.sortKey = 'Population';
        break;
      }
    }
    this.updateData();
  }

  setNormalise(normalise: number) {
    this.normalize = normalise;
    this.updateData();
  }

  setGranularity(granularity: number) {
    this.granularity = granularity;
    this.month = 1;
    this.quarter = 1;
    // this.updateDataAsPerGranularity();
    this.updateData();
  }

  setMapParameter(mapDirPath: string, mapName: string, fileExt: string) {
    this.mapDirPath = mapDirPath;
    this.mapName = mapName;
    this.fileExt = fileExt;
  }

  setMonth(month: number) {
    this.month = month;
    // this.updateDataAsPerGranularity();
    this.updateData();
  }

  setYear(year: number) {
    this.year = year;
  }

  setQuarter(quarter: number) {
    this.quarter = quarter;
    // this.updateDataAsPerGranularity();
    this.updateData();
  }

  setKeys(keys: string[]) {
    this.keys = keys;
    this.columnMap = new Map<string, boolean>();
    for (const key of this.keys.reverse()) {
      this.columnMap.set(key, true);
    }
    this.keys.reverse();
  }

  setDataURL(dataURL: { annual: string, monthly: string, quarterly: string }) {
    this.dataURL = dataURL;
  }

  setxColumn(xColumn: string) {
    this.xColumn = xColumn;
  }

  setDataType(dataType: string) {
    this.dataType = dataType;
  }

  setLabels(xLabel: string, yLabel: string) {
    this.xLabel = xLabel;
    this.yLabel = yLabel;
  }

  setNormalizeDisabled(bool: boolean) {
    this.normalizeDisabled = bool;
  }

  getDataListener() {
    return this.newData.asObservable();
  }

  getParameterListener() {
    return this.parameter.asObservable();
  }

  getGranularity() {
    return this.granularity;
  }

  getNormalize() {
    return this.normalize;
  }

  getSortOption() {
    return this.sortOption;
  }

  getYear() {
    return this.year;
  }

  getPort() {
    return this.port;
  }

  getxColumn() {
    return this.xColumn;
  }

  getDataType() {
    return this.dataType;
  }
  getMapName() {
    return this.mapName;
  }

  getNormalizeDisabled() {
    return this.normalizeDisabled;
  }
}
