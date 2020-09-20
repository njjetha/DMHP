import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PatientCountService } from './patient-count.service'

@Injectable()
export class PatientCountDistrictService extends PatientCountService {

  constructor(http: HttpClient) {
    super(http);
  }

  name() {
    return "PatientCountDistrictService";
  }

  getSortOptions() {
    return ["Rank", this.getxColumn(), "Population"]
  }

  initialize() {
    super.initialize();
      
    let dataURL = {
      annual: "getDataAllDistrictAnnually",
      monthly: "getDataAllDistrictMonthly",
      quarterly: "getDataAllDistrictQuarterly"
    };
    this.setDataURL(dataURL);

    let keys = ["Alcohol Cases", "Suicide Cases", "SMD Cases", "CMD Cases", "Psychiatric Disorder Cases", "O1 Cases", "O2 Cases", "O3 Cases", "O4 Cases", "O5 Cases"];
    this.setKeys(keys);
    this.setLabels("District", "Cases");
    this.setxColumn("District");
    this.setDataType("Patient");
    super.setMapParameter("assets/", "Karnataka", ".json");

    this.setYear(2018);
  }
}
