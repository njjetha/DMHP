import { Injectable } from '@angular/core';
import { PatientCountService } from './patient-count.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TrainingCountDistrictService extends PatientCountService {

    constructor(http: HttpClient) {
        super(http);
    }

    name() {
        return "TrainingCountDistrictService";
    }

    getSortOptions() {
        return ["Rank", this.getxColumn(), "Population"]
    }

    initialize() {
        super.initialize();

          

        let dataURL = {
            annual: "getTrainingDataAllDistrictAnnually",
            monthly: "getTrainingDataAllDistrictMonthly",
            quarterly: "getTrainingDataAllDistrictQuarterly"
        };
        this.setDataURL(dataURL);

        let keys = ["ANM/Health Workers",
            "ASHA",
            "Ayush Doctors",
            "Counselor",
            "Medical Officers",
            "Nursing Staff",
            "Pharmacist",
            "RBSK/RKSK",
            "Teachers(College)",
            "Others"];
        this.setKeys(keys);
        this.setLabels("District", "Training");
        this.setxColumn("District");
        this.setDataType("Training");
        super.setMapParameter("assets/", "Karnataka", ".json");
        this.setNormalizeDisabled(true);
        this.setYear(2018);
    }
}
