import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Router } from '@angular/router';
import { CentralApiService } from '../../_services/central-api.service';
import { Tree } from 'src/_interfaces/tree';
import { Link } from 'src/_interfaces/links';
import { Node } from 'src/_interfaces/nodes';
import { FormControl, Validators } from '@angular/forms';

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
  private tree: Tree;
  private links: Link[];
  private nodes: Node[];
  private color: any;
  errorMessage: string | undefined;
  clickedDeviceId!: string;
  vlanId = new FormControl('', Validators.maxLength(5));

  constructor(
    private central: CentralApiService,
    private router: Router
  ) {
    this.width = window.innerWidth / 1.5 - this.margin.left - this.margin.right;
    this.height = window.innerHeight / 1.5 - this.margin.top - this.margin.bottom;
    this.color = d3.scaleOrdinal(d3.schemeCategory10);
  }

  ngOnInit(): void {
    this.generateNetwork();
  }

  async searchVlan(): Promise<void> {
    if (this.vlanId.valid){
      if (this.vlanId.value > 0){
        this.generateNetworkByVlanID(this.vlanId.value);
      } else {
        console.log('vlanID not valid');
        this.generateNetwork();
      }
    }
  }

  async showAllVlans(): Promise<void> {
    this.generateNetwork();
  }

  private generateNetwork() {
    this.central.getTree().subscribe((tree) => {
      this.tree = tree;
      this.links = tree.links;
      this.nodes = tree.nodes;
      console.log(this.tree);
      this.buildSVG();
    },
    (error) => {
        if (error.status == 404) {
            this.router.navigate(['']);
        }
        this.errorMessage = error.message;
    });
  }

  private generateNetworkByVlanID(vlanId: number) {
    this.central.getTreeByVLAN(vlanId).subscribe((tree) => {
      this.tree = tree;
      this.links = tree.links;
      this.nodes = tree.nodes;
      if (this.links.length == 0 && this.nodes.length == 0) {
        this.nodes = [{
          "id": "There are no devices in this VLAN",
          "group": 1,
          "index": 0,
          "x": 0,
          "y": 0
        }]
      }
      console.log(this.nodes);
      this.buildSVG();
    },
    (error) => {
        if (error.status == 404) {
            this.router.navigate(['']);
        }
        this.errorMessage = error.message;
    });
  }

  private buildSVG() {
    this.svg = null;
    let link = null;
    let node = null;
    let texts = null;
    let simulation = null;
    d3.select("svg").remove();

    this.svg = d3.select("#networkGraph")
                  .append("svg")
                  .attr("width", this.width)
                  .attr("height", this.height)
                  .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    simulation = d3.forceSimulation(this.nodes)
                  .force("link", d3.forceLink(this.links).id((d:any) => d.id))
                  .force("charge", d3.forceManyBody().strength(-3000))
                  .force("center", d3.forceCenter(this.width / 2, this.height / 2))
                  .force("x", d3.forceX(this.width / 2).strength(1))
                  .force("y", d3.forceY(this.height / 2).strength(1));

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


    link = this.svg.append("g")
                          .attr("stroke", "#777")
                          .attr("stroke-opacity", 0.6)
                          .selectAll("line")
                          .data(this.links)
                          .join("line")
                          .attr("stroke-width", (d: { value: number; }) => Math.sqrt(d.value));

    node = this.svg.append("g")
                          .attr("class", "nodes")
                          .selectAll("circle")
                          .data(this.nodes)
                          .enter()
                          .append("circle")
                          .attr("r", 8)
                          .call(drag(simulation))
                          .text((d:any)=>d.id)
                          .attr("fill", "#ff0000")
                          .attr("stroke", "#555")
                          .attr("stroke-width", 3);

    texts = this.svg.selectAll("text.label")
                        .data(this.nodes)
                        .enter().append("text")
                        .attr("class", "label")
                        .attr("fill", "#6e6e6e")
                        .text(function(d) {  return d.id;  });

    simulation.on("tick", () => {
      link.attr("x1", (d: { source: { x: any; }; }) => d.source.x)
          .attr("y1", (d: { source: { y: any; }; }) => d.source.y)
          .attr("x2", (d: { target: { x: any; }; }) => d.target.x)
          .attr("y2", (d: { target: { y: any; }; }) => d.target.y);

      node.attr("cx", (d: { x: any; }) => d.x)
          .attr("cy", (d: { y: any; }) => d.y);

      texts.attr("transform", function(d) {
            let x = d.x + 10;
            let y = d.y + 10;
            return "translate(" + x + "," + y + ")";
        });
    });

    node.on("click", function(d){
      console.log("clicked node: " + d.target.__data__.device_id);
      if (d.target.__data__.device_id != null || d.target.__data.device_id != undefined){
        window.location.href = '/devices/' + d.target.__data__.device_id;
      }
    });
  }
}
