
import { Component, AfterViewInit, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { MatDatepickerInputEvent, MatDatepicker } from '@angular/material';
import * as _moment from 'moment';
import { FormControl } from '@angular/forms';
import { default as _rollupMoment, Moment } from 'moment';


import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { PatientCountDistrictService } from '../../Services/patient-count-district.service';
import { PatientCountLineDistrictService } from '../../Services/Multi-line-Services/patient-count-line-district.service';
import { TalukaMainMenuComponent } from '../Taluka/taluka-main-menu/taluka-main-menu.component';
import { CardLineChartService } from '../../Services/line-chart.card.service';

import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { PatientCountCardService } from '../../Services/patient-count.card.service';

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
  selector: 'app-district-main-menu',
  templateUrl: './district-main-menu.component.html',
  styleUrls: ['./district-main-menu.component.css'],
  entryComponents: [TalukaMainMenuComponent],
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
export class DistrictMainMenuComponent implements AfterViewInit, OnInit {
  @ViewChild(TalukaMainMenuComponent, { static: false }) TalukaMainMenuRef: TalukaMainMenuComponent;

  public talukaPanelState = false;
  public districtName = '';
  public lineChartLoaded = false;
  public chartData;
  @Input()
  public year;

  @ViewChild('Talukas', { static: true }) private TalukaBlock: ElementRef;

  //  @Input()
  //  private districtService: PatientCountDistrictService;
  constructor(public route: Router, public titleService: Title, public lineChartService: CardLineChartService,
              public districtService: PatientCountDistrictService,
              public districtLineService: PatientCountLineDistrictService, private viewportScroller: ViewportScroller,
              public patientCountCardService: PatientCountCardService) {
  }

  ngOnInit() {
    this.titleService.setTitle('District | Cases');
    this.districtService.initialize();
    this.districtLineService.initialize();
    this.districtService.setYear(this.year);
    this.districtLineService.setYear(this.year);
    // this.columns = this.districtService.getKeys();
    this.districtService.onDoubleClick.subscribe((districtName) => {
      if (districtName != 'Bbmp') {
        this.districtName = districtName;
        //   
        if (this.talukaPanelState) {
          this.TalukaMainMenuRef.onDistrictSelect(this.districtName);
        }
        this.talukaPanelState = true;
        setTimeout(() => {
          let el: HTMLElement = document.getElementById('Talukas');
          el.scrollIntoView();
          // location.href = "#Talukas"
        }, 200);

      } else {
        alert("No taluka view found for BBMP")
      }

    });

    this.lineChartService.getChartDataListener().subscribe((d) => {
      this.chartData = d;
      this.lineChartLoaded = true;
    });
  }

  ngAfterViewInit() {
    this.districtService.updateParameter();
    this.districtLineService.updateParameter();
    const postData = {
      year: this.districtService.getYear()
    };
    this.districtService.getYearDataFromServer(postData);
    this.districtLineService.getYearDataFromServer(postData);
  }

  onPanelExpand() {
    // this.talukaView = !this.talukaView;
  }

  onLineChartClose() {
    this.lineChartLoaded = false;
  }

  onTabClick(val: number) {
    setTimeout(() => location.href = '#TalukaPanel', 200);

  }
  onYearChange() {
    this.route.navigate(['/home']);
  }

  public onClickScroll(elementId: string): void {
     this.viewportScroller.scrollToAnchor(elementId);
  }

}





