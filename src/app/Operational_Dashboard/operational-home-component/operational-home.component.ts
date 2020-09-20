import { Component, OnInit, ViewEncapsulation, AfterViewInit, Input} from '@angular/core';
import { CardLineChartService } from '../Services/line-chart.card.service';
import { ExpenseCountDistrictService } from '../Services/expense-count-district.service';
import { PatientCountDistrictService } from '../Services/patient-count-district.service';
import html2canvas from 'html2canvas';
import * as FileSaver from 'file-saver';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-operational-home',
  templateUrl: './operational-home.component.html',
  styleUrls: ['./operational-home.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class OperationalHomeComponent implements OnInit, AfterViewInit {
  public lineChartLoaded = false;
  public chartData;
  public events = [];
  @Input()
  public sideNavOption= 1;
  @Input()
  public year: number;

  opened: boolean;
  mode = new FormControl('over');
  constructor(public route: ActivatedRoute, public router: Router, public districtExpenseService: ExpenseCountDistrictService,
              public districtService: PatientCountDistrictService) { }

  ngOnInit() {
    this.sideNavOption = this.route.snapshot.params.sideNavOption;
    this.year = this.route.snapshot.params.year;
  }

  ngAfterViewInit() {
    // this.sideNavOption=1;
  }
  onLineChartClose() {
    this.lineChartLoaded = false;
  }

  onSideNavClick(val: number) {
    this.sideNavOption = val;
  }
  Capture() {

    // let element = document.querySelector("#"+"this.dataType");
    // let element :string = "#"+"this.dataType";
  html2canvas(document.body).then(function(canvas) {
      // Convert the canvas to blob
      canvas.toBlob(function(blob) {
          // To download directly on browser default 'downloads' location
          const link = document.createElement('a');
          link.download = 'image.png';
          link.href = URL.createObjectURL(blob);
          link.click();

          // To save manually somewhere in file explorer
          // FileSaver.saveAs(blob, 'image.png');

      }, 'image/png');
  });
  }

  onYearChange(year: number) {
    // const routeURL = '/home/operations/' + year + '/' + this.sideNavOption;
    // window.location.href = routeURL;
    // this.router.navigate(['/home/operations/' + year + '/' + this.sideNavOption]);
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/home/operations/' + year + '/' + this.sideNavOption]);
  });
  }

}
