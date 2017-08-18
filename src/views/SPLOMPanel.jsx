/**
 * Render the SPLOMPanel
 */

import React, { Component } from "react";
import * as d3 from "d3";
import { Container } from "flux/utils";
import SchedulerStore from "../data/SchedulerStore";
import SPLOMStore from "../data/SPLOMStore";
import "./SPLOMPanel.scss";
import { selectJob } from "../data/SchedulerActions";

export default Container.createFunctional(SPLOMPanel, () => [SchedulerStore, SPLOMStore], () => {
      return {
            scheduler: SchedulerStore.getScheduler(),
            SPLOMAttr: SPLOMStore.getState().accessors
      }
});

/**
 * Called every state change
 */
function SPLOMPanel(scheduler) {
      return (
            <span className="SPLOMPanel">
                  <svg ref={(el) => update(el, scheduler)} className="image2">
                  </svg>
            </span>
      );
}

function update(svgElement, { scheduler, SPLOMAttr }) {
      if (!svgElement) return;




      //CREATE NEW SCALE - CHANGE sizeOfMatrix in SPLOMPanel to adjust SPLOM size
      //const sizeOfMatrix = Math.floor(Math.sqrt(2 * (SPLOMAttr.length)) + 1 / 2)
      //const newScale = initSPLOMScale(1000, 1000, sizeOfMatrix);

      var width = 800;
      var height = 700;
      var barPadding = 1;
      var radius = 3;

      var svg = d3.select(svgElement)
            .attr("height", height)
            .attr("width", width)

      var padding = 30;
      /*
      var dataset = [
            [1, 50], [1.5, 100], [2, 150], [2.5, 200], [2, 170],
            [2.5, 230.5], [6, 555], [3, 330], [0.5, 50], [1, 100]
      ];
      */

      var dataset = scheduler.finishedJobs

      var scaleX = d3.scaleLinear().domain([0, d3.max(dataset, function (d) { return d.init.ioFreq; })]).range([padding, width - padding * 2]);
      var scaleY = d3.scaleLinear().domain([0, d3.max(dataset, function (d) { return d.running.avgPriority; })]).range([height - padding, padding]);

      svg.selectAll("circle")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return scaleX(d.init.ioFreq) + radius; })
            .attr("cy", function (d) { return scaleY(d.running.avgPriority); })
            .attr("r", radius);

      svg.selectAll("circle")
            .exit()
            .remove()
      var xAxis = d3.axisBottom(scaleX).ticks(5);
      svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (height - padding) + ")")
            .call(xAxis);

      var yAxis = d3.axisLeft(scaleY).ticks(5);
      svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding + ", 0)")
            .call(yAxis);




/*
      const svg = d3.select(svgElement)
            .attr("height", 100)
            .attr("width", 100)

      const sPlotJoin = svg.selectAll("g.chart")
            .data(SPLOMAttr, d => Math.random())

      const enter = sPlotJoin.enter()
      const exit = sPlotJoin.exit()
            .remove()
      const chart = enter.append("g")
            .classed("chart", true)
            .each(function (d, i) {
                  //calculate X position

                  //calculate shifted coordinates
                  const shiftX = 100 * i;
                  const shiftY = 100;

                  //Generate scatter plot
                  const addScatterplot = d3.select(this)
                        .call(scatterPlot, scheduler, d, 100)
            })
            */
      //MAIN svg
      /*
      const svg = d3.select(svgElement)
         .attr("height", newScale.height + 10)
         .attr("width", newScale.width)
   
      const chartJoin = svg.selectAll("g.chart")
         .data(SPLOMAttr, D => Math.random())
   
      const enter = chartJoin.enter()
   
      const exit = chartJoin.exit()
         .remove()
   
      const chart = enter.append("g")
         .classed("chart", true)
         .each(function (d, i) {
            //calculate X position
            const y = Math.floor(Math.sqrt(2 * (i + 1)) + 1 / 2) - 1
   
            //calculate Y position
            const m = Math.floor((Math.sqrt(8 * i + 1) - 1) / 2)
            const x = i - m * (m + 1) / 2
   
            //calculate shifted coordinates
            const shiftX = (x * (newScale.size + newScale.padding));
            const shiftY = y * (newScale.size + newScale.padding);
   
            //Generate scatter plot
            const addScatterplot = d3.select(this)
               .attr("style", `transform: translate(+${shiftX}px, +${shiftY}px)`)
               .call(scatterPlot, scheduler, d, newScale, shiftX, shiftY)
         })
         */
     
}

/**
 * Generate a scatterPlot
 * @param svg element
 * @param scheduler
 * @param accessor - to access the data
 * @param scale - scale for the axis
 */
function scatterPlot(svg, scheduler, accessor, scale) {
      const ratio = 1.1;
      //MAKING Y AXIS        
      const [minY, maxY] = accessor.getDomainY(scheduler);
      var yAxis = d3.axisLeft(scale.yScale.domain([minY - maxY * .1, maxY * ratio])).ticks(5);

      //MAKING X AXIS  
      const [minX, maxX] = accessor.getDomainX(scheduler);
      var xAxis = d3.axisBottom(scale.xScale.domain([minX - maxX * .1, maxX * ratio])).ticks(5);

      const jobJoin = svg.selectAll("g.axis")
            .data([0])

      const jobEnter = jobJoin.enter()

      //Add frame
      jobEnter.append("rect")
            .attr("class", "frame")
            .attr("width", scale.size - scale.padding)
            .attr("height", scale.size - scale.padding)
            .attr("transform", `translate(${scale.padding},${scale.padding})`);

      //PlotDots if labels are different
      if (accessor.labelX !== accessor.labelY) {
            //Append x Axis
            jobEnter.append("g")
                  .classed("axis x", true)
                  .attr("transform", `translate(${scale.padding / 2},${(scale.size)})`)
                  .call(xAxis)

            // Append y Axis      
            jobEnter.append("g")
                  .classed("axis y", true)
                  .attr("transform", `translate(${scale.padding},${scale.padding / 2})`)
                  .call(yAxis);
            scatterPlotDots(svg, scheduler, accessor, scale)
      }
      //Draw Label Panel if labels are the same
      else {
            drawLabelPanel(jobEnter, accessor, scale)
      }
}

/**
 * Plotting dots on graph
 * @param svg
 * @param scheduler 
 * @param accessor
 * @param scale  
 */
function scatterPlotDots(svg, scheduler, accessor, scale) {
      const update = svg.selectAll("circle.job")
            .classed("job", true)
            // TODO change back to only finished jobs
            .data(scheduler.allJobs, d => d.init.id)
      const enter = update.enter()

      //Creating dots
      enter.append("circle")
            .classed("job", true)
            .on("click", selectJob)
            .call(dot);

      update.call(dot);

      function dot(select) {
            return select.attr("r", scale.size / 100)
                  .attr("cx", d => scale.xScale(accessor.getX(d)))
                  .attr("cy", d => scale.yScale(accessor.getY(d)))
                  .attr("transform", `translate(${(scale.size / 100)},${scale.size / 100})`);
      }
}

/**
 * Draw Label panel
 * @param jobEnter
 * @param accessor 
 * @param scale
 */
function drawLabelPanel(jobEnter, accessor, scale) {
      jobEnter.append("text")
            .style("text-anchor", "middle")
            .style("cursor", "pointer")
            .on("click", e => alert(accessor.tooltipX))
            .attr("x", scale.size / 2 + scale.padding / 2)
            .attr("y", scale.size / 2 + scale.padding / 2)
            .style("font-size", `${scale.size / 9}px`)
            .text(accessor.labelX);
}

/**
 * Generate all the needed scales
 */
function initSPLOMScale(width, height, numberOfGraph) {
      const padding = ((height / numberOfGraph) * 0.1);
      const size = ((height / numberOfGraph) * 0.9);
      const xScale = d3.scaleLinear()
            .range([padding / 2, size - padding / 2]);
      const yScale = d3.scaleLinear()
            .range([size - padding / 2, padding / 2]);
      return {
            width,
            height,
            padding,
            size,
            numberOfGraph,
            //SCALE FOR DATA INPUT
            xScale: xScale,
            yScale: yScale
      }
}

/*
//var dataset = [5,10,15,20,25];
//d3.selectAll("div").data(dataset).enter().append("div").attr("class","bar").style("height", function(d) {var barHeight = d*5; return barHeight+"px"});
var w = 500;
var h = 300;
var barPadding = 1;
var radius = 3;
var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

var padding = 30;
var dataset = [
                [1, 50], [1.5, 100], [2, 150], [2.5, 200], [2, 170],
                [2.5, 230.5], [6, 555], [3, 330], [0.5, 50], [1, 100]
              ];
var scaleX = d3.scale.linear().domain([0, d3.max(dataset, function (d) { return d[0];} )]).range([padding, w - padding * 2]);
var scaleY = d3.scale.linear().domain([0, d3.max(dataset, function (d) { return d[1];} )]).range([h - padding, padding]);

svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return scaleX(d[0]) + radius; })
    .attr("cy", function (d) { return scaleY(d[1]); })
    .attr("r", radius);

svg.selectAll("text")
    .data(dataset)
    .enter()

var xAxis = d3.svg.axis().scale(scaleX).orient("bottom").ticks(5);
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);

var yAxis = d3.svg.axis().scale(scaleY).orient("left").ticks(5);
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding + ", 0)")
    .call(yAxis);
    
*/