import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-multi-line-menu',
  templateUrl: './multi-line-menu.component.html',
  styleUrls: ['./multi-line-menu.component.css']
})
export class MultiLineMenuComponent implements OnInit {
  @Input() public menuService: any;
  public xColumn: string;
  public year: number;
  public checkedCumulative: boolean;
  public tableData: any;
  public keys: string[];
  public yearTotal: number[];
  public monthTotal: number[];
  public diff: number[];
  public bool: boolean = false;
  public months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  public lastMonthName;

  constructor() { }

  ngOnInit() {
    this.bool = false;
    //this.year = this.menuService.getYear();
    //this.xColumn = this.menuService.getxColumn();
    this.checkedCumulative = this.menuService.getCumulative();
    this.year = this.menuService.getYear();
    this.menuService.getTableData().subscribe((d) => {
      this.tableData = d.tableData;
      this.lastMonthName = this.months[this.tableData[this.tableData.length-1].Month-1];
      this.keys = d.keys;
      this.yearTotal = [];
      this.monthTotal = [];
      this.diff = [];
      let d1=this.tableData[this.tableData.length - 1];
      let d2=this.tableData[this.tableData.length - 2];
      let d3=this.tableData[this.tableData.length - 3];
        
        
      for (let k1 of this.keys) {
        this.yearTotal.push(d1[k1]);
        let t1 = d1[k1]-d2[k1];
        this.monthTotal.push(t1);
        let t2 = d2[k1]-d3[k1];
        this.diff.push(t1-t2);
      }
      this.bool = true;

    });
  }

  onCumulativeChange() {
    this.menuService.setCumulative(this.checkedCumulative);
  }

}
