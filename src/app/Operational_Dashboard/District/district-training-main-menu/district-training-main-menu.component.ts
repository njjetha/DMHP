import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { TrainingCountDistrictService } from '../../Services/training-count-district.service';

@Component({
  selector: 'app-district-training-main-menu',
  templateUrl: './district-training-main-menu.component.html',
  styleUrls: ['./district-training-main-menu.component.css']
})
export class DistrictTrainingMainMenuComponent implements OnInit {

  // @Input()
  // private districtExpenseService: ExpenseCountDistrictService;
  @Input()
  public year;
  constructor(private http: HttpClient,private titleService: Title,public districtTrainingService: TrainingCountDistrictService ) { }

  ngOnInit() {

    this.titleService.setTitle("District | Expense");
      
    this.districtTrainingService.initialize();
    this.districtTrainingService.setYear(this.year);
  }

  ngAfterViewInit() {
    this.districtTrainingService.updateParameter();
    let postData = {
      year: this.districtTrainingService.getYear()
    }
    this.districtTrainingService.getYearDataFromServer(postData);
  }

}
