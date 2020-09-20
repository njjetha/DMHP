import { Component, OnInit, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';
import d3Tip from "d3-tip";
import * as _ from "lodash";

import * as topojson from 'topojson';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MapComponent implements OnInit {
  // Input Parameter
  @Input() private mapService: any;

  private mapName: string;
  private mapdata: any;
  private normalize: boolean;
  private mapDirPath: string;
  private fileExt: string;

  private margin: any = { top: 0, bottom: 0, left: 100, right: 100 };
  private svg: any;
  private width: number;
  private height: number;
  private jsondata: any;
  private formattedData: any = null;
  private xColumn: string;
  private dataType: string;
  private keys: string[];
  private currkeys: string[];
  private z: any;
  private populationDisabled: boolean;
  @ViewChild('map', { static: true }) private chartContainer: ElementRef;

  constructor(private http: HttpClient) { }
  public isMapLoaded=false;
  ngOnInit() {
    this.mapService.getParameterListener().subscribe((newParameter) => {
      this.mapName = newParameter.mapName;
      this.mapDirPath = newParameter.mapDirPath;
      this.fileExt = newParameter.fileExt;
      this.xColumn = newParameter.xColumn;
      this.dataType = newParameter.dataType;
      this.keys = newParameter.keys;
      this.populationDisabled = (this.xColumn == "Taluka") ? true : false;//newParameter.populationDisabled;
      this.getMap();
      //this.mapService.onDistrictChanged.emit(this.mapName);

    });

    this.mapService.getDataListener().subscribe((newData) => {
      this.mapdata = newData.data;
      this.normalize = newData.normalise;
      this.currkeys = newData.currkeys;
      if(this.isMapLoaded)
        this.createMap();
    });

  }

  getMap() {
    this.http.get(this.mapDirPath + this.mapName + this.fileExt).subscribe(responseData => {
      this.mapName = this.mapName.replace(" ", "_");
        
        
      this.jsondata = responseData;
      this.isMapLoaded=true;
      // set the colors 
      this.z = d3.scaleOrdinal([...d3.schemeSet2, ...d3.schemePaired, ...d3.schemeTableau10]);
      this.z.domain(this.keys);
      this.createMap();
    }) 
  }

  createMap() {
    let formattedDataTempCopy = null;
    this.formattedData = {};
    if (this.mapdata != null) {
      //for (let d of mapdata){
      //.append({District : d.District, DistrictId : d.DistrictId, Total: d.Total});


      //}
      let groupWiseData = _.groupBy(this.mapdata, this.xColumn);

      this.formattedData = this.mapdata.reduce((acc, cur) => ({ ...acc, [cur[this.xColumn]]: groupWiseData[cur[this.xColumn]][0] }), {});

      formattedDataTempCopy = this.formattedData;


      var maxVal = 0;
      for (var v of this.mapdata) {
        if (v["Total"] > maxVal) {
          maxVal = v["Total"];
        }
      }
    }
    //  


    let element = this.chartContainer.nativeElement;

    d3.select("#" + this.xColumn + this.dataType).remove();
    //  
    this.width = element.offsetWidth - this.margin.left - this.margin.right;   //800
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom; //400

    this.svg = d3.select(element)
      .append('svg')
      .attr("id", this.xColumn + this.dataType)
      .attr('width', this.width)//500)
      .attr('height', this.height)//element.offsetHeight)
      //.attr('viewBox',"0 0 480 450")
      .attr('preserveAspectRatio', "xMinYMax meet")
      .append('g')
    //.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);



    let state = topojson.feature(this.jsondata, this.jsondata.objects[this.mapName]);
      
      
    const projection = d3.geoMercator();
    projection.fitExtent(
      [
        [10, 5],
        //[element.offsetWidth, element.offsetHeight],   // [500,450]
        [this.width, this.height],   // [500,450]
      ],
      state
    );


    const path = d3.geoPath(projection);
    let tempColor = "";

    /* tooptip */
    const tip = d3Tip();
    tip.attr("class", "d3-tip")
      .style('z-index', '99999999999')
      .offset([-10, 0])
      .html(d => {
        let data = formattedDataTempCopy[d.properties.NAME_3];
        let keys = [...this.currkeys];
        let a = (this.normalize) ? "%" : "";
        let ret = "<div style='text-align: center;font-size: 19px;'>" + data[this.xColumn] + "<br>";
        if (!this.populationDisabled)
          ret += "<small> (Population  " + data["Population"].toLocaleString() + ")</small>";
        ret += "</div><br><table style='width:200px;font-size: 17px;'><tbody>";
        for (let key of keys.reverse()) {
          ret += "<tr style='color:" + this.z(key) + ";'><td>" + key + " </td><td style='text-align:right; padding-left:15px;'> " + data[key].toLocaleString() + a + "</td></tr>"
        }
        ret += "<tr  style='font-size: 19px;'><td>Total</td><td style='text-align:right; padding-left:15px;'> " + data["Total"].toLocaleString() + a + "</td></tr>"

        ret += "</tbody></table>";
        return ret;
      });

    this.svg.call(tip);

    let xColumn = this.xColumn;
    this.svg.selectAll(".country")
      .data(state.features)
      .enter()
      .append("path")
      .attr("class", "country")
      .attr("d", path)
      .attr("cursor", "pointer")
      .attr("fill", (d) => {
        //  

        if (formattedDataTempCopy[d.properties.NAME_3] != null) {
          var n = formattedDataTempCopy[d.properties.NAME_3]["Total"] || 0;

          const color =
            n === 0
              ? '#ffffff'
              : d3.interpolateReds(
                (0.8 * n) / (maxVal || 0.009)
              );

          tempColor = color;
          return color;

        }
        else {
          return "white";
        }
        //  
        //return "#cccccc";
      })
      .attr("stroke", "#660000")
      .attr("stroke-width", "0.5")
      .on('mouseover', function (d) {

        //scope of "this" here is to svg element so we can not call "regionSelected" directly
        // when used function(d) scope of "this" is to current svg element
        // when used (d)=> { } scope of "this" is same as angular "this"


        if (formattedDataTempCopy[d.properties.NAME_3] != null) {
          d3.select(this).transition()
            .duration('50')
            .attr("stroke-width", "3");
          //.attr('fill', "grey")
          tip.show(d, this);
          fu(d.properties.NAME_3);
        }
        //d3.select(this).style("fill","#cccccc");
        //abc(d.properties.district);
        //this.regionSelected(d.properties.district);
      })
      .on('mouseout', function (d) {
        // d3.select(this).transition()
        //      .duration('50')
        //      .attr('stroke', '#333333')
        // d3.select(this).classed('selected',false)
        //this.regionSelected(null);

        if (formattedDataTempCopy[d.properties.NAME_3] != null) {
          d3.select(this).transition()
            .duration('50')
            .attr("stroke", "#660000")
            .attr("stroke-width", "0.5")
          tip.hide(d, this);
        }
        else {
          d3.select(this).transition()
            .duration('50')
            .attr('fill', "white")
        }

        //  
      })
      .on('dblclick', (d) => {

          
        //alert(d.properties);
        //this.mapService.onDistrictClicked.emit(d.properties.district);
        this.mapService.onDoubleClick.emit(d.properties.NAME_3);
        //location.href = "#TalukaPanel";  
      });

    let fu = (d) => {
      //  
      this.regionHovered(d);

    }

    this.svg.append("g")
      .selectAll("labels")
      .data(state.features)
      .enter()
      .append("text")
      .attr("x", function (d) { return path.centroid(d)[0] })
      .attr("y", function (d) { return path.centroid(d)[1] })
      .attr("dy", ".35em")
      .text((d) => d.properties.NAME_3)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "central")
      .style("font-size", "11.5px")
      .style('font-family', 'Arial, Helvetica, sans-serif')
      .style("font-weight", "bold")
      .style("fill", "rgba(30, 0, 0, 0.9)")
      .attr("cursor", "pointer")
      .on('mouseover', function (d) { if (formattedDataTempCopy[d.properties.NAME_3] != null) tip.show(d, this); })
      .on('mouseout', function (d) { if (formattedDataTempCopy[d.properties.NAME_3] != null) tip.hide(d, this); })
      .on('dblclick', (d) => { this.mapService.onDoubleClick.emit(d.properties.NAME_3) });

  }

  regionHovered(data) {
    //   
    //   

    var total_cases = this.formattedData[data]["Total"];

    let emitData = {
      data: data,
      total_cases: total_cases.toLocaleString()
      // yColumnName : this.chartParameters.yColumnName,
      // parameterNumber : this.parameterNumber,
      // year: this.year
    }
    this.mapService.onRegionHover.emit(emitData);

  }
}
