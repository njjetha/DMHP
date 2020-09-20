import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import d3Tip from "d3-tip";

@Component({
  selector: 'app-group-pie-chart',
  templateUrl: './group-pie-chart.component.html',
  styleUrls: ['./group-pie-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GroupPieChartComponent implements OnInit {
  // Input Parameter
  @Input() private chartService: any;

  @ViewChild('chart', { static: true }) private chartContainer: ElementRef;
  @ViewChild('chartLabel', { static: true }) private chartContainerLabel: ElementRef;
  private margin = { top: 20, left: 20, bottom: 20, right: 20 };
  private thickness: number;
  private svg: any;
  private svgLabel: any;
  private keys: string[];
  private xColumn: string;
  private width: number;
  private height: number;
  private radius: number;
  private data: any;
  private currkeys: string[];
  private total: any;
  private g1: any;
  private g2: any;
  private gl1: any;
  private z: any;
  private color: string[];
  tip: any;
  constructor() { }

  ngOnInit() {
    this.chartService.getParameterListener().subscribe((newParameter) => {
      this.xColumn = newParameter.xColumn
      this.keys = newParameter.keys;
      this.data = newParameter.data;
      this.color = newParameter.color;
      this.createChart();
    });

    this.chartService.getDataListener().subscribe((newData) => {
      this.currkeys = newData.currkeys;
      this.total = newData.total;
      this.updateChart();
    });
  }

  createChart() {
    let element1 = this.chartContainer.nativeElement;

    d3.select("#" + this.xColumn + this.chartService.name() + "gpc").remove();
    this.svg = d3.select(element1)
      .append('svg')
      .attr("id", this.xColumn + this.chartService.name() + "gpc")
      .attr('width', element1.offsetWidth)// +200+ this.margin.left + this.margin.right)
      .attr('height', element1.offsetHeight)
      .attr('preserveAspectRatio', "xMinYMax meet")
    //.attr('transform', `translate(${300}, ${300})`)

    let element2 = this.chartContainerLabel.nativeElement;
    d3.select("#" + this.xColumn + this.chartService.name() + "gpcl").remove();
    this.svgLabel = d3.select(element2)
      .append('svg')
      .attr("id", this.xColumn + this.chartService.name() + "gpcl")
      .attr('width', 300)// +200+ this.margin.left + this.margin.right)
      .attr('height', element2.offsetHeight + 30)
      .attr('preserveAspectRatio', "xMinYMax meet");


    this.width = Math.min(element1.offsetHeight - 60, element1.offsetWidth - 60)//element.offsetWidth / 3 //- this.margin.left - this.margin.right;
    this.height = Math.min(element1.offsetHeight - 60, element1.offsetWidth - 60)//element.offsetHeight / 3// - this.margin.top - this.margin.bottom;
    this.radius = Math.min(this.width, this.height) / 2;
    this.thickness = this.radius / 3;

    this.g1 = this.svg.append('g')
      .attr('transform', `translate(${this.width / 2 + 30}, ${this.height / 2 + 30})`)
    this.g2 = this.svg.append('g')
      .attr('transform', `translate(${this.width / 2 + 30}, ${this.height / 2 + 30})`)
    this.gl1 = this.svgLabel.append('g')
      .attr('transform', `translate(${0}, ${30})`)

    this.z = d3.scaleOrdinal()
      .domain(this.keys)
      .range(d3.quantize(t => d3[this.color[1]](t * 0.8 + 0.1), this.keys.length).reverse());

    this.g2.append("text")
      .attr("class", "name-text")
      .attr('text-anchor', 'middle')
      .attr("font-size", "1em")
      .attr('dy', '-1.2em')
      .attr("font-weight", "bold");

    this.g2.append("text")
      .attr("class", "value-text")
      .attr('text-anchor', 'middle')
      .attr("font-size", "3em")
      .attr('dy', '0.6em');

    /* tooptip */
    this.tip = d3Tip();
    this.tip.attr("class", "d3-tip")
      .style('z-index', '99999999999')
      .offset([-10, 0])
      .html((key) => {
        let percent = (this.data[this.currkeys[key]] / this.total) * 100;
        percent = Number(percent.toFixed(2));
        let ret = "<span>" + this.currkeys[key] + " </span>"
        ret += "<span style=' color:" + this.color[0] + ";padding-left:5px'> " + this.data[this.currkeys[key]].toLocaleString()
        ret += "  (" + percent + "%)</span>"
        return ret;
      });
    this.svg.call(this.tip);
  }

  updateChart() {
    let tip = this.tip;
    let arcs = [];

    let data = this.keys.map((key) => {
      return {
        label: key,
        index: this.currkeys.indexOf(key),
        display: this.currkeys.includes(key) ? true : false,
        value: this.data[key]
      }
    });

      
    // Set Legend  
    this.svgLabel.selectAll(".legend").remove();
    let legend = this.gl1.selectAll(".legend")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .data(data)
      .enter().append("g")
      .attr("class", "legend")
      .style("opacity", (d) => d.display ? 1 : 0.2)
      .attr("transform", function (d, i) { return "translate(30," + i * 19 + ")"; })
      .attr("cursor", "pointer")
      .on("mouseenter", (d) => { if (d.display) arcHoverFunc(d.index) })
      .on("mouseout", (d) => { if (d.display) arcHoverExitFunc(d.index) })
      .on('click', (d) => {
        if (d.display) arcHoverExitFunc(d.index);
        this.chartService.onLegendClick.emit(d.label);
      });

    legend.append("rect")
      .attr("x", 0)
      .attr("width", 18)
      .attr("height", 15)
      .attr("y", 3.5)
      .attr("stroke", "black")
      .style("stroke-width", 0.5)
      .attr("fill", (d) => this.z(d.label));

    legend.append("text")
      .attr("x", 25)
      .attr("y", 11.5)
      .attr("dy", ".35em")
      .attr("font-size", "12")
      .attr("text-anchor", "start")
      .text((d) => d.label);

    data = this.currkeys.map((key, index) => {
      return {
        label: key,
        index: index,
        display: this.currkeys.includes(key) ? true : false,
        value: this.data[key]
      }
    });

    let pie = d3.pie()
      .sort(null)
      .value((d) => d.value.value);

    let arc = d3.arc()
      .innerRadius(this.radius - this.thickness)
      .outerRadius(this.radius);

    let arcHover = d3.arc()
      .innerRadius(this.radius - this.thickness * 1.1)
      .outerRadius(this.radius * 1.1);

    /* ------- PIE SLICES -------*/
    this.g1.selectAll(".slice").remove()
    let slice = this.g1.selectAll("path.slice")
      .data(pie(d3.entries(data)))
      .enter().append("g")
      .attr("class", "slice")
      .style("cursor", "pointer")
      .append("path")
      .each(function (d) { arcs.push(this); })
      .style("fill", (d) => this.z(d.data.value.label))
      .attr("id", (d) => "a" + d.data.key)
      .on("mouseenter", (d) => arcHoverFunc(d.data.key))
      .on("mouseout", (d) => arcHoverExitFunc(d.data.key))
      .transition().duration(1000)
      .attr('d', arc)
      .style("stroke-width", "0.5px")
      .attr("stroke", this.color[0])
      .attr("stroke-opacity", 0.3)

    this.g2.select(".name-text")
      .text("Total " + this.xColumn);

    this.g2.select(".value-text")
      .text(this.total.toLocaleString());

    let arcHoverFunc = (key) => {
      tip.show(key, arcs[key]);
      this.g1.select("#a" + key)
        .transition().duration(100)
        .attr('d', arcHover)
        .attr("stroke", this.color[0])
        .style("stroke-width", "5px")
    }

    let arcHoverExitFunc = (key) => {
      tip.hide(key, arcs[key]);
      this.g1.select("#a" + key)
        .transition().duration(100)
        .attr('d', arc)
        .style("stroke-width", "0.5px")
      }
  }
}
