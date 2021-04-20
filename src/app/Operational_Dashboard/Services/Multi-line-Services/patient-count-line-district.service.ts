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
     // monthly:"/getMonthlyTotalCasesGrv2" 
    };
    this.setDataURL(dataURL);

  let keys = ["Alcohol Cases", "Suicide Attempt Cases", "SMD Cases", "CMD Cases", "Psychiatric Disorder Cases", "Epilepsy Cases", "Developmental Disorder Cases", "Behavioural DIsorder Cases", "Emotional Disorder Cases", "Dementia Cases",  "Other Cases"];

    /* let keys = [ 'SUM(AlcoholSubstanceAbuse)',
      'SUM(BehaviouralDisorders)',
      'SUM(CMD)',
      'SUM(Dementia)',
      'SUM(DevelopmentalDisorders)',
      'SUM(EmotionalDisorders)',
      'SUM(Epilepsy)',
      'SUM(Others)',
      'SUM(PsychiatricDisorders)',
      'SUM(Referred)',
      'SUM(SMD)',
      'SUM(SuicideAttempts)',
      'TotalCases'];
 */
    this.setKeys(keys);
    
    this.setLabels("Month", "Cases");
    this.setxColumn("Month");
    this.setYear(2018);

  }
}
