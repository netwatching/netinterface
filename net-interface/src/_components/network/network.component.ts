import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import {json} from "d3";
import data from './graph.json'

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnInit {
  private margin = {top: 1, right: 1, bottom: 1, left: 1};
  private width: number;
  private height: number;
  public svg: any;
  private links: any;
  private nodes: any;

  constructor() {
    this.width = window.innerWidth / 2 - this.margin.left - this.margin.right;
    this.height = window.innerHeight / 2 - this.margin.top - this.margin.bottom;
    this.links = data.links;
    this.nodes = data.nodes;
  }

  ngOnInit(): void {
    this.buildSvg();
  }

  private buildSvg() {
    this.svg = d3.select("#networkGraph")
                  .append("svg")
                  .attr("width", this.width)
                  .attr("height", this.height)
                  .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    const simulation = d3.forceSimulation(this.nodes)
                          .force("link", d3.forceLink(this.links).id((d:any) => d.id))
                          .force("charge", d3.forceManyBody())
                          .force("center", d3.forceCenter(this.width / 2, this.height / 3));

    const drag = (simulation: d3.Simulation<any, undefined>) => {

      function dragstarted(event: { active: any; subject: { fx: any; x: any; fy: any; y: any; }; }) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: { subject: { fx: any; fy: any; }; x: any; y: any; }) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: { active: any; subject: { fx: null; fy: null; }; }) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended);
    }

    const link = this.svg.append("g")
                          .attr("stroke", "#777")
                          .attr("stroke-opacity", 1)
                          .selectAll("line")
                          .data(this.links)
                          .join("line")
                          .attr("stroke-width", (d: { value: number; }) => Math.sqrt(d.value));

    const node = this.svg.append("g")
                          .attr("class", "nodes")
                          .selectAll("circle")
                          .data(this.nodes)
                          .enter()
                          .append("circle")
                          .attr("r", 8)
                          .call(drag(simulation))
                          .text((d:any)=>d.id)
                          .attr("fill", (d: any) => {
                            const scale = d3.scaleOrdinal(d3.schemeCategory10);
                            return (d: { group: string; }) => scale(d.group);
                          })
                          .attr("fill", "#43afb5")
                          .style("fill-opacity","0.9")
                          .attr("stroke", "#555")
                          .attr("stroke-width", 3);

    simulation.on("tick", () => {
      link.attr("x1", (d: { source: { x: any; }; }) => d.source.x)
          .attr("y1", (d: { source: { y: any; }; }) => d.source.y)
          .attr("x2", (d: { target: { x: any; }; }) => d.target.x)
          .attr("y2", (d: { target: { y: any; }; }) => d.target.y);

      node.attr("cx", (d: { x: any; }) => d.x)
          .attr("cy", (d: { y: any; }) => d.y);
    });
  }
}
