import { Component, AfterViewInit, OnInit, Input } from '@angular/core';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { HttpClient } from '@angular/common/http';


import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { PatientCountTalukaService } from '../../../Services/patient-count-taluka.service';
import { Title } from '@angular/platform-browser';
const moment = _rollupMoment || _moment; _moment;

/* For Date picker year */

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-taluka-main-menu',
  templateUrl: './taluka-main-menu.component.html',
  styleUrls: ['./taluka-main-menu.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})

export class TalukaMainMenuComponent implements AfterViewInit, OnInit {
  @Input() public districtName: string;
  @Input() public year;
   public districts: string[];

  constructor(private http: HttpClient, private titleService: Title, public talukaService: PatientCountTalukaService) {
  }

  ngOnInit() {
    this.titleService.setTitle('Taluka | Cases');
    this.talukaService.initialize();
    this.talukaService.setYear(this.year);
  }


  ngAfterViewInit() {
    this.talukaService.setDistrictName(this.districtName);
    // this.talukaService.updateChartParameter();
    this.talukaService.getDistrictNames().subscribe((newData) => {
      this.districts = newData;
      this.districtName = this.talukaService.getDistrictName();
    });
    this.talukaService.start();

  }

  onDistrictSelect(district: string) {
    this.talukaService.setDistrictParameter(district);
  }
}
