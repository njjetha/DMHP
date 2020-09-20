import { Component, OnInit, ViewChild, Input, ElementRef, HostListener, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';
import { CardLineChartService } from '../../Services/line-chart.card.service';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CardComponent implements OnInit {

  @ViewChild('smallChart', { static: true }) private chartContainer: ElementRef;
  @Input() public CardName: String;
  @Input() color: string;
  //  @Input() data: any;
  @Input() year: number;
  @Input() cardService: any;

  public totalCases: number = 0;
  public margin: any = { top: 50, right: 0, bottom: 0, left: 0 };
  public width: number;
  public height: number;
  public g: any;
  public x: any;
  public y: any;
  public yScaleLine: any;
  yLabel: any;
  xLabel: any;
  public svg: any;

  expenseData: any;

  public xAxis;
  public yAxis;

  public chartData;
  public loadChart = false;


  constructor(private http: HttpClient, private lineChartService: CardLineChartService) { }

  ngOnInit() {
    this.cardService.initialise({
      year: this.year,
      cardName: this.CardName
    })
    this.cardService.getDataListener(this.CardName)
    .pipe(take(1))
    .subscribe((data) => {
      this.chartData = data;
      this.createChart();
      this.createLineChart(data);
    })
  }
  
  createChart() {
    // create the svg
    let element = this.chartContainer.nativeElement;

    this.svg = d3.select(element)
      .append('svg')
      //.attr('width', 400)
      //.attr('height', 130);
      .attr('width', element.offsetWidth + 40)
      .attr('height', element.offsetHeight - 40)
      .style("cursor", "pointer");

    this.width = element.offsetWidth - this.margin.left - this.margin.right + 40;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    //  

    // chart plot area
    this.g = this.svg.append('g')
      .attr('transform', `translate(${this.margin.left - 20}, ${this.margin.top})`);


    // set x scale
    this.x = d3.scaleBand()
      .range([0, this.width]);


    // set y scale
    this.y = d3.scaleLinear()
      .rangeRound([this.height, 0]);

    /* this.xAxis = this.g.append('g')
       .attr('class', 'x axis')
       .attr('transform', `translate(50, ${this.height})`)
 
     this.yAxis = this.g.append('g')
       .attr('class', 'axis axis-y')
       .attr('transform', `translate(50,0)`) */
  }

  createLineChart(data) {
      
      
    for (var i = 0; i < data.length; i++) {
      this.totalCases += (+data[i]["Total Cases"])
    }
      
    //let yDomain = [0, d3.max(data, d => d["total"])];
    //let xDomain = data.map(function(d) { return d.district; });

    let yDomain = [0, d3.max(data, d => d["Total Cases"])];
    let xDomain = data.map(function (d) { return d["Month"]; });

    this.x.domain(xDomain).padding(0.3);
    this.y.domain(yDomain).nice();


    this.yScaleLine = d3.scaleLinear()
      .range([this.height, 0]); // output 

    this.yScaleLine.domain(yDomain);

    /*  this.xAxis.transition().call(d3.axisBottom(this.x));
      this.yAxis.transition().call(d3.axisLeft(this.y));*/

    var line = d3.line()
      .x(d => this.x(d["Month"]) + (this.x.bandwidth() / 2)) // set the x values for the line generator
      .y(d => this.y(d["Total Cases"])) // set the y values for the line generator 
      .curve(d3.curveMonotoneX) // apply smoothing to the line
      

    /*this.g.append("path")
      .datum(data) // 10. Binds data to the line 
      .attr("class", "lines") // Assign a class for styling 
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "lightgrey")
      .attr("stroke-width", 4);
    //.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);; // 11. Calls the line generator
    */


    // define the area
    var area = d3.area()
      .x(d => this.x(d["Month"]) + (this.x.bandwidth() / 2)) // set the x values for the line generator
      .y0(this.height - this.margin.bottom)
      .y1(d => this.y(d["Total Cases"])) // set the y values for the line generator 
      .curve(d3.curveMonotoneX)

    this.g.append("path")
      .data([data])
      .attr("class", "area")
      .attr("d", area)
      .attr("fill", this.color)
      .style("opacity", 0.25)


    this.g.append("path")
      .datum(data) // 10. Binds data to the line 
      .attr("class", "lines") // Assign a class for styling 
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", this.color)
      .style("opacity", 0.7)

      .attr("stroke-width", 3); // 11. Calls the line generator
  }

  onClickLoadChart() {
    //this.loadChart = true;
    //this.lineChartService.updateChartData(this.chartData);
  }

  @HostListener("click") onClick() {
      
    this.lineChartService.updateChartData({
      caseName: this.CardName,
      data: this.chartData,
      color: this.color
    });
  }

}