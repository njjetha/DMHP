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
    return ['Rank', this.getxColumn(), 'Population'];
  }

  initialize() {
    super.initialize();

    const dataURL = {
      annual: 'getDataAllDistrictAnnually',
      monthly: 'getDataAllDistrictMonthly',
      quarterly: 'getDataAllDistrictQuarterly'
    };
    this.setDataURL(dataURL);

    const keys = ['Alcohol Cases', 'Suicide Cases', 'SMD Cases', 'CMD Cases', 'Psychiatric Disorder Cases',
     'Epilepsy Cases', 'Developmental Disorder Cases', 'Behavioural DIsorder Cases', 'Emotional Disorder Cases', 'Dementia Cases',  'Other Cases'];
    this.setKeys(keys);
    this.setLabels('District', 'Cases');
    this.setxColumn('District');
    this.setDataType('Patient');
    super.setMapParameter('assets/', 'Karnataka', '.json');

    this.setYear(2018);
  }
}
