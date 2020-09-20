import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
//import * as d3 from "d3";
import * as d3 from 'd3';

@Component({
  selector: 'app-grouped-bar-chart',
  templateUrl: './grouped-bar-chart.component.html',
  styleUrls: ['./grouped-bar-chart.component.css']
})

export class GroupedBarChartComponent implements OnInit {
  // Input Parameter
  @Input() private chartService: any;

  @ViewChild('chart', { static: true }) private chartContainer: ElementRef;

  private margin = { top: 50, left: 30, bottom: 100, right: 150 };
  private svg: any;
  private width: number;
  private height: number;
  private xLabelName: string;
  private xColumn: string;
  private g1: any;
  private g2: any;
  private g3: any;
  private z: any;

  // Request Variables
  private data: Array<any> = [];
  private keys: string[];
  private currkeys: string[];
  private keyMap = new Map<string, boolean>();
  private speed: number = 500;

  constructor() { }


  ngOnInit() {
    this.chartService.getParameterListener().subscribe((newParameter) => {
      this.xLabelName = newParameter.xLabel;
      this.xColumn = newParameter.xColumn
      this.keys = newParameter.keys;
      this.keyMap = new Map<string, boolean>();
      for (let key of this.keys)
        this.keyMap.set(key, true);

      this.keyMap.set("Population", false);
      this.createChart();
    });

    this.chartService.getDataListener().subscribe((newData) => {
      this.data = newData.data;
      this.updateChart();
    });
  }
  createChart() {
    let element = this.chartContainer.nativeElement;


    d3.select("#" + this.xColumn + this.chartService.name() + "gbc").remove();
    this.svg = d3.select(element)
      .append('svg')
      .attr("id", this.xColumn + this.chartService.name() + "gbc")
      .attr('width', element.offsetWidth + this.margin.left + this.margin.right)
      .attr('height', element.offsetHeight + this.margin.top + this.margin.bottom);

    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    this.g1 = this.svg.append('g').attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    this.g2 = this.svg.append('g').attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    this.g3 = this.svg.append('g').attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // add the Y gridlines
    this.g1.append("g")
      //.attr("transform", `translate(${-10},0)`)
      .attr("class", "y-axis-grid")
      .style("color", "lightgray")
      .style('opacity', 0.5)
      .transition().duration(this.speed)
      .call(d3.axisLeft(d3.scaleLinear()
        .rangeRound([this.height, 0]))
        .ticks(10)
        .tickSize(-this.width)
        .tickFormat("")
      );

    // X Axis
    this.g3.append("g")
      .attr("transform", `translate(0,${this.height})`)
      .attr("class", "x-axis");

    // X Label
    this.g3.append("text")
      .attr("y", this.height + 100)
      .attr("x", this.width / 2)
      .attr("font-size", "18px")
      .attr("text-anchor", "middle")
      .attr("font-weight", "bold")
      .attr("font-family", "sans-serif")
      .text(this.xLabelName);

    // set the colors "#ca0020","#f4a582","#d5d5d5","#92c5de","#0571b0"
    this.z = d3.scaleOrdinal(["#f52727", "#2E86C1", "#28B463", "#212F3D"]);
    this.z.domain(this.keys);

    // Set Legend  
    let legend = this.g3.selectAll(".legend")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .data(this.keys.slice())
      .enter().append("g")
      .attr("class", "legend")
      .style("opacity", (d) => this.keyMap.get(d) ? 1 : 0.2)
      .attr("transform", function (d, i) { return "translate(30," + i * 21 + ")"; })
      .attr("cursor", "pointer")
      .on('click', function (d) {
        d3.select(this).style("opacity", legendFunc(d) ? 1 : 0.2);
      });

    let legendFunc = (d) => {
      this.keyMap.set(d, !this.keyMap.get(d))
      this.updateChart();
      return this.keyMap.get(d);
    }

    legend.append("rect")
      .attr("x", this.width + 10)
      .attr("width", 18)
      .attr("height", 15)
      .attr("y", 3.5)
      .attr("stroke", "black")
      .style("stroke-width", 0.5)
      .attr("fill", (d) => this.z(d));

    legend.append("text")
      .attr("x", this.width + 35)
      .attr("y", 11.5)
      .attr("dy", ".35em")
      .attr("font-size", "15px")
      .attr("text-anchor", "start")
      .text(function (d) { return d; });
  }

  updateChart() {
    this.currkeys = [];
    for (let [key, bool] of this.keyMap)
      if (bool) this.currkeys.push(key);
    //  
    // Set x scale
    let x0 = d3.scaleBand()
      .range([0, this.width])
      .domain(this.data.map(d => d[this.xColumn]))
      .paddingInner(0.25)
      .align(0.1);

    let x1 = d3.scaleBand()
      .domain(this.currkeys)
      .range([0, x0.bandwidth()]);

    // Set y scale
    let y = new Map<string, any>()
    for (let key of this.currkeys)
      y.set(key, d3.scaleLinear()
        .range([this.height, 0])
        .domain([0, d3.max(this.data, d => (d[key] == 0) ? 0.1 : d[key])])
        .nice())

    this.g2.selectAll(".g-rect").remove()
    let slice = this.g2.selectAll(".slice")
      .data(this.data)
      .enter().append("g")
      .attr("class", "g-rect")
      .attr("transform", (d) => "translate(" + x0(d[this.xColumn]) + ",0)");
    slice.exit().remove();

    let bars = slice.selectAll("rect")
      .data((d) => { return this.currkeys.map(function (key) { return { key: key, value: d[key] }; }); });

    bars.exit().remove();

    bars.enter().append("rect")
      .merge(bars)

      .attr("width", x1.bandwidth())
      .attr("x", (d) => x1(d.key))
      .style("fill", (d) => this.z(d.key))
      .attr("y", (d) => y.get(d.key)(0))
      //.attr("height", (d) => this.height - y.get(d.key)(0))
      .on("mouseover", function (d) {
        //d3.select(this).style("fill", d3.rgb(color(d.key)).darker(2));
      })
      .on("mouseout", function (d) {
        //d3.select(this).style("fill", color(d.key));
      });

    slice.selectAll("rect")
      .transition()
      //.delay(function (d) { return Math.random() * 1000; })
      .duration(this.speed)
      .attr("y", (d) => y.get(d.key)(d.value))
      .attr("height", (d) => this.height - y.get(d.key)(d.value));

    // Update X Axis 
    this.g3.selectAll(".x-axis").transition().duration(1000)
      .call(d3.axisBottom(x0).tickSizeOuter(0)).selectAll("text")
      .attr("y", "3")
      .attr("x", "-5")
      .attr("font-size", "14px")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-55)");

    // Text above each bar  
    this.g2.selectAll(".g-text").remove();
    let slicetext = this.g2.selectAll(".slicetext")
      .data(this.data)
      .enter().append("g")
      .attr("class", "g-text")
      .attr("transform", (d) => "translate(" + x0(d[this.xColumn]) + ",0)");

    slicetext.exit().remove();

    slicetext.selectAll("text")
      .data((d) => { return this.currkeys.map(function (key) { return { key: key, value: d[key] }; }); })
      .enter().append("text").attr("class", "text")
      .attr("text-anchor", "middle")
      .attr("transform", function (d) { return "rotate(-0)" })
      .attr("font-size", 11)
      //.attr("fill", "#787878")
      .style("fill", (d) => this.z(d.key))
      .attr("y", x1.bandwidth() / 2 + 3)
      .attr("x", 30)
      .attr("transform", (d) => {
        return ("translate(" + x1(d.key) + "," + this.height + ")rotate(-90)")
      })
      .merge(slicetext)
      .transition().duration(this.speed)
      .attr("transform", (d) => {
        return ("translate(" + x1(d.key) + "," + y.get(d.key)(d.value) + ")rotate(-90)")
      })
      .text(d => d.value.toLocaleString());
  }
}
