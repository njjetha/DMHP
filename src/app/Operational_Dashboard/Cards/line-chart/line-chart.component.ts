import { Component, OnInit, ViewChild, Input, ElementRef, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';
import { CardLineChartService } from '../../Services/line-chart.card.service';


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LineChartComponent implements OnInit {

  @ViewChild('bigChart', { static: true }) private bigChartContainer: ElementRef;
  @ViewChild('smallChart', { static: true }) private smallChartContainer: ElementRef;
  @Input()
  public data: any;
  @Input()
  public id: string;
  // @Input()
  public needAxis = true;

  private totalCases = 0;

  private yScaleLine: any;

  private width: number;
  private height: number;
  private g: any;
  private svg: any;
  private margin: any = { top: 25, right: 20, bottom: 30, left: 5 };
  private xAxis: any;
  private yAxis: any;
  private xScale: any;
  private yScale: any; false;
  private yLabel: any;
  private xLabel: any;
  private path: any;
  private pathArea: any;
  private line;
  private caseName;
  public loadChart = true;
  public chartOffset = 80;
  private color: string;
  @Output()
  public close: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient, private lineChartService: CardLineChartService) { }

  ngOnInit() {


    this.loadChart = false;
    this.caseName = this.data.caseName;
    this.color = this.data.color;
    this.createChart(this.bigChartContainer);
    this.updateData(this.data.data);
    this.lineChartService.getChartDataListener().subscribe((d) => {


      this.caseName = d.caseName;
      this.color = d.color;
      this.updateData(d.data);
    });

  }

  createChart(chartContainer) {
    const element = chartContainer.nativeElement;

    this.svg = d3.select(element)
      .append('svg')
      .attr('transform', `translate(0,-30)`)
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight + 100);

    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    //

    // chart plot area
    this.g = this.svg.append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    this.xAxis = this.g.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(${this.chartOffset}, ${this.height})`);

    this.yAxis = this.g.append('g')
      .attr('class', 'axis axis-y')
      .attr('transform', `translate(${this.chartOffset},0)`);

    this.path = this.g.append('path')
      .attr('transform', `translate(${this.chartOffset},0)`)
      .attr('class', 'line'); // Assign a class for styling

    this.pathArea = this.g.append('path')
      .attr('transform', `translate(${this.chartOffset},0)`)
      .attr('class', 'area')
      .style('opacity', 0.25);



    // X Label
    this.xLabel = this.g.append('text')
      .attr('y', this.height + 55)
      .attr('x', this.width / 2 + 10)
      .attr('font-size', '16px')
      .attr('text-anchor', 'middle')
      .text('Month')
      .attr('font-family', 'sans-serif')
      .attr('font-weight', 'bold');

    // Y Label
    this.yLabel = this.g.append('text')
      .attr('y', 10)
      .attr('x', -(this.height / 2))
      .attr('font-size', '16px')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text('Random')
      .attr('font-family', 'sans-serif')
      .attr('font-weight', 'bold');

  }

  updateData(data) {



    const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const xValue = 'Month';
    const yValue = 'Total Cases';
    const chartOffset = this.chartOffset;
    const t = function() { return d3.transition().duration(1000); };

    const yDomain = [0, d3.max(data, d => +d[yValue])];
    const xDomain = [d3.min(data, d => +d[xValue]), d3.max(data, d => +d[xValue]) + 1];



    this.xScale = d3.scaleLinear().range([0, this.width]).domain(xDomain);
    this.yScale = d3.scaleLinear().range([this.height, 0]).domain(yDomain);

    this.xAxis.transition().call(d3.axisBottom(this.xScale)
      .tickFormat(function(d) {

        return monthName[d - 1];
      })
      .ticks(12))
      .attr('font-size', '14px');

    this.yAxis.transition().call(d3.axisLeft(this.yScale).ticks(8))
      .attr('font-size', '14px');

    // Labels

    this.yLabel.text(this.caseName);


    const xs = this.xScale;
    const ys = this.yScale;
    const line = d3.line()
      .x(function(d, i) { return +xs(+d[xValue]); })// +this.xScale(+d["Month"]); }) // set the x values for the line generator
      .y(function(d) { return +ys(+d[yValue]); })// +this.yScale(+d["Total Cases"]); }) // set the y values for the line generator
      .curve(d3.curveMonotoneX); // apply smoothing to the line

    this.path.datum(data)
      .attr('stroke', this.color);
    // 10. Binds data to the line

    this.g.select('.line')
      .transition(t)
      .attr('d', line)
      .attr('stroke', this.color);

    const dots = this.g.selectAll('circle')
      .data(data);

    dots.exit()
      .remove();

    dots.transition()
      .attr('cx', function(d, i) { return chartOffset + xs(d[xValue]); })
      .attr('cy', function(d) { return ys(d[yValue]); })
      .attr('r', 5)
      .style('fill', this.color);

    dots.enter()
      .append('circle') // Uses the enter().append() method
      .attr('class', 'dot') // Assign a class for styling
      .attr('cx', function(d, i) { return chartOffset + xs(d[xValue]); })
      .attr('cy', function(d) { return ys(d[yValue]); })
      .attr('r', 5)
      .attr('fill', this.color);


    // define the area
    const area = d3.area()
      .x(d => +xs(+d[xValue])) // set the x values for the line generator
      .y0(this.height)
      .y1(d => +ys(+d[yValue])) // set the y values for the line generator
      .curve(d3.curveMonotoneX);

    this.pathArea.data([data])
      .transition(t)
      .attr('d', area)
      .attr('fill', this.color);

    /* Tooltip code */

    const focus = this.g.append('g')
      .attr('class', 'focus')
      .style('display', 'none');

    focus.append('circle')
      .attr('r', 5);

    const tooltip = focus.append('rect')
      .attr('class', 'tooltip')
      .attr('width', 100)
      .attr('height', 50)
      .attr('x', -110)
      .attr('y', -22)
      .attr('rx', 4)
      .attr('ry', 4);

    let tooltip_date = focus.append('text')
      .attr('class', 'tooltip-date')
      .attr('x', -108)
      .attr('y', -2);

    let tooltip_label = focus.append('text')
      .attr('x', -108)
      .attr('y', 18)
      .text('Cases:');

    let tooltip_value = focus.append('text')
      .attr('class', 'tooltip-likes')
      .attr('x', -65)
      .attr('y', 18);

    this.g.append('rect')
      .attr('class', 'overlay')
      .attr('width', this.width)
      .attr('height', this.height)
      .on('mouseover', () => { focus.style('display', null); })
      .on('mouseout', () => { focus.style('display', 'none'); })
      .on('mousemove', mousemove);

    let xScale_copy = this.xScale;
    let yScale_copy = this.yScale;
    const bisectDate = d3.bisector((d) => d[xValue]).left;
    const yColumnName = yValue;
    const xColumnName = xValue;
    const toolTipTime = d3.timeFormat('%d-%m-%Y');
    // let chartOffset = this.chartOffset;
    let data_copy = data;
    function mousemove() {

      if (data_copy.length != 0) {
        const x0 = xScale_copy.invert(d3.mouse(this)[0]),
          i = bisectDate(data_copy, x0, 1),
          d0 = data_copy[i - 1],
          d1 = data_copy[i],
          d = x0 - d0[xValue] > d1[xValue] - x0 ? d1 : d0;
        focus.attr('transform', 'translate(' + (chartOffset + xScale_copy(d[xValue])) + ',' + yScale_copy(d[yValue]) + ')');

        if (i === 1) {
          tooltip.attr('transform', 'translate(' + (60) + ',' + (-40) + ')');
          tooltip_date.attr('transform', 'translate(' + (60) + ',' + (-40) + ')');
          tooltip_label.attr('transform', 'translate(' + (60) + ',' + (-40) + ')');
          tooltip_value.attr('transform', 'translate(' + (60) + ',' + (-40) + ')');
        } else {
          tooltip.attr('transform', 'translate(' + (-10) + ',' + (20) + ')');
          tooltip_date.attr('transform', 'translate(' + (-10) + ',' + (20) + ')');
          tooltip_label.attr('transform', 'translate(' + (-10) + ',' + (20) + ')');
          tooltip_value.attr('transform', 'translate(' + (-10) + ',' + (20) + ')');
        }
        focus.select('.tooltip-date').text(monthName[d[xValue] - 1]);
        focus.select('.tooltip-likes').text((d[yValue]));
      }
    }
  }

  onClose() {
    this.close.emit();
  }


}
