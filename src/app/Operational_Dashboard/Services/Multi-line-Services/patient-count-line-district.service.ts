import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LineService } from './line.service'

@Injectable()
export class PatientCountLineDistrictService extends LineService {

  constructor(http: HttpClient) {
    super(http);
  }

  name(){
    return "PatientCountLineDistrictService";
  }

  initialize(){
    super.initialize();

    let dataURL = {
      monthly: "getMonthlyTotalCases"
    };
    this.setDataURL(dataURL);

    let keys = ["Alcohol Cases", "Suicide Attempt Cases", "SMD Cases", "CMD Cases", "Psychiatric Disorder Cases", "Epilepsy Cases", "Developmental Disorder Cases", "Behavioural DIsorder Cases", "Emotional Disorder Cases", "Dementia Cases",  "Other Cases"];
    this.setKeys(keys);
    
    this.setLabels("Month", "Cases");
    this.setxColumn("Month");
    this.setYear(2018);

  }
}
