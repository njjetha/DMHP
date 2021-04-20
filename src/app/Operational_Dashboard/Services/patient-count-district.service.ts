import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PatientCountService } from './patient-count.service';

@Injectable()
export class PatientCountDistrictService extends PatientCountService {

  constructor(http: HttpClient) {
    super(http);
  }

  name() {
    return 'PatientCountDistrictService';
  }

  getSortOptions() {
   // return ['Rank', this.getxColumn(), 'Population']; 
   return ['Rank', this.getxColumn(), 'Population'];     
  }

  initialize() {
    super.initialize();

    const dataURL = {
       /* annual: 'getDataAllDistrictAnnually',
      monthly: 'getDataAllDistrictMonthly',
      quarterly: 'getDataAllDistrictQuarterly' */ 
      
  // added by gourav for rest call

      annual: 'getDataAllDistrictAnnuallyGrv2',
      monthly: 'getDataAllDistrictMonthlyGrv2',
      quarterly: 'getDataAllDistrictQuarterlyGrv2'


    };
    this.setDataURL(dataURL);
  

    /* const keys = ['Alcohol Cases', 'Suicide Attempt Cases', 'SMD Cases', 'CMD Cases', 'Psychiatric Disorder Cases',
     'Epilepsy Cases', 'Developmental Disorder Cases', 'Behavioural DIsorder Cases', 'Emotional Disorder Cases',
      'Dementia Cases',  'Other Cases']; */


      // written by gourav to add keys   
      const keys = [ 'SUM(AlcoholSubstanceAbuse)',
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

    
      






     
    this.setKeys(keys);
   // this.setLabels('DistrictId', 'Cases'); // added vy gourav
    this.setLabels('District', 'Cases');
    //this.setxColumn('District');   // coloum name
    this.setxColumn('District');             // added vy gourav
    this.setDataType('Patient');
    super.setMapParameter('assets/', 'Karnataka', '.json');

    this.setYear(2018);
  }
}
