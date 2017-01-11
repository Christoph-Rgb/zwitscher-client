import {inject} from 'aurelia-framework';
import ZwitscherService from '../../services/zwitscher-service';
import {EventAggregator} from 'aurelia-event-aggregator';
import {CompletedLoggedInUserUpdate} from '../../services/messages';
import * as d3 from "d3";

@inject(ZwitscherService, EventAggregator, d3)
export class SocialGraph {

  eventSubscriptions = [];

  constructor(zs, ea) {
    this.zwitscherService = zs;
    this.eventAgregator = ea;
    this.graph = {
      "nodes": [],
      "links": []
    };
  }

  attached() {
    this.eventSubscriptions.push (this.eventAgregator.subscribe(CompletedLoggedInUserUpdate, msg => {
      this.refresh();
    }));
    this.refresh();
  }

  detached() {
    this.eventSubscriptions.forEach(event => {
      event.dispose();
    })
  }

  refresh() {
    d3.select('svg').remove();

    this.graph = {
      "nodes": [],
      "links": []
    };

    this.zwitscherService.getUsers().then(users => {
      users.forEach(user => {
        this.graph.nodes.push({
          'id': user._id,
          'name': user.firstName,
          'group': user.gender,
          'profilePicture': user.profilePicture
        });

        user.follows.forEach(followedUser => {
          this.graph.links.push({
            'source': user._id,
            'target': followedUser._id,
            'value': 50
          });
        });
      });

      this.initializeGraph();

    }).catch(err => {
      console.log(err);
    })
  }

  initializeGraph() {
    let width = 960, height = 500;

    // let width = $('#graphContainer').width();
    // if (width < 500) {
    //   width = 500;
    // }
    //
    // let height = width / 2;
    // if (height < 500) {
    //   height = 500;
    // }

    let svg = d3.select('#graph')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody())
      .force("collide", d3.forceCollide(100))
      .force("center", d3.forceCenter(width / 2, height / 2));

    var link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(this.graph.links)
      .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); })
      .attr('marker-end', 'url(#end)')
      .style("fill", "lightgray");

    // // build the arrow.
    // svg.append("svg:defs").selectAll("marker")
    //   .data(["end"])      // Different link/path types can be defined here
    //   .enter().append("svg:marker")    // This section adds in the arrows
    //   .attr("id", String)
    //   .attr("viewBox", "0 -5 10 10")
    //   .attr("refX", 22)
    //   .attr("refY", 0)
    //   .attr("markerWidth", 4)
    //   .attr("markerHeight", 4)
    //   .attr("orient", "auto")
    //   .append("svg:path")
    //   .attr("d", "M0,-5L10,0L0,5")
    //   .style("fill", "lightgray");

    let gnodes = svg.selectAll('g.gnode')
      .data(this.graph.nodes)
      .enter()
      .append('g')
      .classed('gnode', true);

    gnodes.append("image")
      .attr("xlink:href", function(d)
      {
        return d.profilePicture;
      })
      .attr("x", -50)
      .attr("y", -50)
      .attr("width", 100)
      .attr("height", 100)
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    let labels = gnodes.append("text")
      .text(function(d) { return d.name; })
      .attr("x", 50)
      .attr("y", 25)
      .style('fill', '1b1c1d')
      .style('font-weight', 'bold')
      .style('font-size', '25px');

    simulation
      .nodes(this.graph.nodes)
      .on("tick", ticked);

    simulation.force("link")
      .links(this.graph.links);

    function ticked() {
      link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      gnodes
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("transform", function(d) {
          return 'translate(' + [d.x, d.y] + ')';
        });
    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }
}
