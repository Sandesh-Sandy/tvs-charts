import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const D3GanttChart = () => {
  const svgRef = useRef(null);

  const tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("background", "#fff")
  .style("border", "1px solid #ccc")
  .style("padding", "5px")
  .style("border-radius", "4px")
  .style("font-size", "12px")
  .style("display", "none");

  const data = [
    { period: '2021', Plan: 20, RevisedPlan: 19, LastYearActuals: 6 },
    { period: '2022', Plan: 19, RevisedPlan: 17, LastYearActuals: null },
    { period: '2023', Plan: 18, RevisedPlan: 18, LastYearActuals: null },
    { period: 'Apr', Plan: 8, RevisedPlan: 5, LastYearActuals: null },
    { period: 'May', Plan: 12, RevisedPlan: 11, LastYearActuals: 11 },
    { period: 'Jun', Plan: 9, RevisedPlan: 6, LastYearActuals: 9 },
    { period: 'Jul', Plan: 13, RevisedPlan: 12, LastYearActuals: 13 },
    { period: 'Aug', Plan: 15, RevisedPlan: 13, LastYearActuals: 9 },
    { period: 'Sep', Plan: 12, RevisedPlan: 11, LastYearActuals: 11 },
    { period: 'Oct', Plan: 7, RevisedPlan: 6, LastYearActuals: 7 },
    { period: 'Nov', Plan: 4, RevisedPlan: 3, LastYearActuals: 4 },
    { period: 'Dec', Plan: 5, RevisedPlan: 5, LastYearActuals: 3 },
    { period: 'Jan', Plan: 7, RevisedPlan: 7, LastYearActuals: 5 },
    { period: 'Feb', Plan: 10, RevisedPlan: 7, LastYearActuals: 8 },
    { period: 'Mar', Plan: 9, RevisedPlan: 5, LastYearActuals: 6 }
  ];

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 40, right: 100, bottom: 60, left: 100 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const y = d3.scaleBand()
      .domain(data.map(d => d.period))
      .range([0, height])
      .padding(0.2);

    const x = d3.scaleLinear()
      .domain([0, 20])
      .range([0, width]);

    const color = d3.scaleOrdinal()
      .domain(['Plan', 'RevisedPlan', 'LastYearActuals'])
      .range(['#0000FF', '#FF0000', '#008000']);

    svg.append('g')
      .call(d3.axisLeft(y));

    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickSize(-(width-margin.left-margin.right))).style('stroke-dasharray', '3 3')
      .style('stroke-opacity', 0.2);

    data.forEach(d => {
      ['Plan', 'RevisedPlan', 'LastYearActuals'].forEach((key, i) => {
        if (d[key] !== null) {
          svg.append('rect')
         
            .attr('x', 0)
            .attr('y', y(d.period))
            .attr('width', x(d[key]))
            .attr('height', y.bandwidth() / 3)
            .attr('fill', color(key))
            .attr('transform', `translate(0, ${i * (y.bandwidth() / 3)})`).on("mouseover", (event, data) => {
              tooltip.style("display", "block")
                .html(`${key} ${d[key]}`)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 20}px`);
            })
            .on("mousemove", (event) => {
              tooltip.style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 20}px`);
            })
            .on("mouseout", () => {
              tooltip.style("display", "none");
            })
        }
      });
    });

    const legend = svg.append('g')
      .attr('transform', `translate(${width - 100}, 0)`);

    ['Plan', 'RevisedPlan', 'LastYearActuals'].forEach((key, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(120, ${i * 20})`);

      legendRow.append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', color(key));

      legendRow.append('text')
        .attr('x', 15)
        .attr('y', 10)
        .text(key)
        .style('font-size', '12px');
    });

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text('Gantt Chart Representation of Plans and Actuals');

  }, []);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default D3GanttChart;
