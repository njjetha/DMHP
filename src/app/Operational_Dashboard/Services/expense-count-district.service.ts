import { Injectable } from '@angular/core';
import { PatientCountService } from './patient-count.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ExpenseCountDistrictService extends PatientCountService {

  constructor(http: HttpClient) {
    super(http);
  }

  name() {
    return "ExpenseCountDistrictService";
  }

  getSortOptions() {
    return ["Rank", this.getxColumn(), "Population"]
  }

  initialize() {
    super.initialize();

      

    let dataURL = {
      annual: "getExpenseDataAllDistrictAnnually",
      monthly: "getExpenseDataAllDistrictMonthly",
      quarterly: "getExpenseDataAllDistrictQuarterly"
    };
    this.setDataURL(dataURL);

    let keys = ["AmbulatoryService",
      "B2030_AnnualIncrement",
      "B3012_PsyNurse",
      "B3012_StaffNurse",
      "B3032_Psychiatrists",
      "B3032_PsychiatristsTA",
      "B10162_Awarness",
      "B30112_Psyst_Counsellor",
      "B30114_SocialWorker",
      "B30114_SocialWorkerTA",
      "B30137_MedialRedAsst",
      "B30137_WardAsst",
      "Drugs",
      "Equipments",
      "IEC",
      "Infrastucture",
      "J17_Contingency",
      "Miscellanious",
      "OperationExpense",
      "TargetIntervention",
      "Training"];
    this.setKeys(keys);

    this.setLabels("District", "Expenses");
    this.setxColumn("District");
    this.setDataType("Expense");
    super.setMapParameter("assets/", "Karnataka", ".json");
    this.setNormalizeDisabled(true);
    this.setYear(2018);
  }
}
