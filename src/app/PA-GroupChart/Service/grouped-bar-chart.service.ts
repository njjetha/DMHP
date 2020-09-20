import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { GroupedPieChartCasesService } from './grouped-pie-chart-cases.service';
import { GroupedPieChartExpenseService } from './grouped-pie-chart-expense.service';
import { GroupedPieChartTainingService } from './grouped-pie-chart-training.service';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class GroupedBarChartService {
  private dataURL: {
    cases: any,
    training: any,
    expense: any
  };
  private dataColoumn: {
    cases: string[],
    training: string[],
    expense: string[]
  };
  private data: {
    cases: any,
    training: any,
    expense: any
  };
  private columnMapCases = new Map<string, boolean>();
  private columnMapExpense = new Map<string, boolean>();
  private columnMaptraining = new Map<string, boolean>();

  private currkeysCases: string[];
  private currkeysExpense: string[];
  private currkeysTraining: string[];
  private keys: string[];
  private year: number;
  private xLabel: string;
  private xColumn: string;
  private currData: any;
  private newData = new Subject<any>();
  private parameter = new Subject<any>();
  private port: number;
  private sortOptions: string[];
  private sortKey: string;

  constructor(protected http: HttpClient,
              protected pieChartCasesService: GroupedPieChartCasesService,
              protected pieChartExpenseService: GroupedPieChartExpenseService,
              protected pieChartTrainingService: GroupedPieChartTainingService) {
    this.port = 3000;

    this.initialize();
    this.port = 3000;

    this.pieChartCasesService.getLineChartParameterListener().subscribe((d) => {
      this.setColumn(d.datatype, d.key);
    });
    this.pieChartExpenseService.getLineChartParameterListener().subscribe((d) => {
      this.setColumn(d.datatype, d.key);
    });
    this.pieChartTrainingService.getLineChartParameterListener().subscribe((d) => {
      this.setColumn(d.datatype, d.key);
    });
  }

  name() {
    return 'GroupedBarChartService';
  }

  initialize() {
    this.dataURL = {
      cases: 'getDataAllDistrictAnnually',
      training: 'getTrainingDataAllDistrictAnnually',
      expense: 'getExpenseDataAllDistrictAnnually'
    };

    this.dataColoumn = {
      cases: ['Alcohol Cases', 'Suicide Cases', 'SMD Cases', 'CMD Cases', 'Psychiatric Disorder Cases',
       'O1 Cases', 'O2 Cases', 'O3 Cases', 'O4 Cases', 'O5 Cases'],
      training: ['ANM/Health Workers',
        'ASHA',
        'Ayush Doctors',
        // "Counselor",
        // "Medical Officers",
        'Nursing Staff',
        'Pharmacist',
        'RBSK/RKSK',
        'Teachers(College)',
        'Others'],
      expense: ['AmbulatoryService',
        'B2030_AnnualIncrement',
        'B3012_PsyNurse',
        'B3012_StaffNurse',
        'B3032_Psychiatrists',
        'B3032_PsychiatristsTA',
        'B10162_Awarness',
        'B30112_Psyst_Counsellor',
        'B30114_SocialWorker',
        'B30114_SocialWorkerTA',
        'B30137_MedialRedAsst',
        'B30137_WardAsst',
        'Drugs',
        'Equipments',
        'IEC',
        'Infrastucture',
        'J17_Contingency',
        'Miscellanious',
        'OperationExpense',
        'TargetIntervention',
        'Training']
    };

    this.xColumn = 'District';
    this.xLabel = 'District';
    this.year = 2018;
    this.keys = ['Cases', 'Expense', 'Training', 'Population'];
    this.sortKey = this.getSortOptions()[0];
    this.setColumns();
  }

  getYearDataFromServer(postData: { year: number }) {

    this.http.post<any>(environment.backendIP + '/' + this.dataURL.cases, postData)
      .subscribe(resCasesData => {

        this.http.post<any>(environment.backendIP + '/' + this.dataURL.training, postData)
          .subscribe(resTrainingData => {

            this.http.post<any>(environment.backendIP + '/' + this.dataURL.expense, postData)
              .subscribe(resExpenseData => {
                this.data = {
                  cases: resCasesData,
                  training: resTrainingData,
                  expense: resExpenseData
                };
                this.updateData();
              });
          });
      });
  }

  setColumns() {
    this.columnMapCases = new Map<string, boolean>();
    for (const col of this.dataColoumn.cases) {
      this.columnMapCases.set(col, true);
    }

    this.columnMaptraining = new Map<string, boolean>();
    for (const col of this.dataColoumn.training) {
      this.columnMaptraining.set(col, true);
    }

    this.columnMapExpense = new Map<string, boolean>();
    for (const col of this.dataColoumn.expense) {
      this.columnMapExpense.set(col, true);
    }
  }

  calculateTotal() {
    this.currkeysCases = [];
    this.currkeysTraining = [];
    this.currkeysExpense = [];

    for (const [colName, colbool] of this.columnMapCases) {
      if (colbool) { this.currkeysCases.push(colName); }
    }

    for (const [colName, colbool] of this.columnMaptraining) {
      if (colbool) { this.currkeysTraining.push(colName); }
    }

    for (const [colName, colbool] of this.columnMapExpense) {
      if (colbool) { this.currkeysExpense.push(colName); }
    }

    this.currData = [];
    for (let i = 0; i < this.data.cases.length; i++) {
      let tempTotalCases = 0;
      let tempTotalTraining = 0;
      let tempTotalExpense = 0;
      for (const colName of this.currkeysCases) {
        tempTotalCases += this.data.cases[i][colName];
      }
      for (const colName of this.currkeysTraining) {
        tempTotalTraining += this.data.training[i][colName];
      }
      for (const colName of this.currkeysExpense) {
        tempTotalExpense += this.data.expense[i][colName];
      }
      this.currData.push({
        DistrictId: this.data.cases[i].DistrictId,
        District: this.data.cases[i].District,
        Population: this.data.cases[i].Population,
        Cases: Number(tempTotalCases.toFixed(2)),
        Training: Number(tempTotalTraining.toFixed(2)),
        Expense: Number(tempTotalExpense.toFixed(2))
      });
    }
  }

  updateParameter() {
    const parameter = {
      keys: this.keys,
      xLabel: this.xLabel,
      xColumn: this.xColumn,
    };
    this.parameter.next(parameter);
  }

  updateData() {
    // this.normalizeData();
    this.calculateTotal();
    this.sortData();
    const newData = {
      data: this.currData
    };
    this.newData.next(newData);
  }

  sortData() {
    const key = this.sortKey;
    this.currData.sort(function(a, b) {
      return a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0;
    });
  }

  getDataListener() {
    return this.newData.asObservable();
  }

  getParameterListener() {
    return this.parameter.asObservable();
  }

  getSortOptions() {
    return [this.xColumn, ...this.keys];
  }

  getSortOption() {
    return this.sortKey;
  }

  setSortOption(sortOption: string) {
    this.sortKey = sortOption;
    this.updateData();
  }

  setColumn(datatype: string, key: string) {
    switch (datatype) {
      case 'Cases': {
        this.columnMapCases.set(key, !this.columnMapCases.get(key));
        break;
      }
      case 'Training': {
        this.columnMaptraining.set(key, !this.columnMaptraining.get(key));
        break;
      }
      case 'Expense': {
        this.columnMapExpense.set(key, !this.columnMapExpense.get(key));
        break;
      }
    }
    this.updateData();
  }

  setYear(year: number) {
    this.year = year;
  }

}
