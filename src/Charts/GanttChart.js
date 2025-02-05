import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const D3GanttChart = () => {
  const svgRef = useRef(null);

  const data = [
    { period: 'Mar', Plan: 9, RevisedPlan: 5, LastYearActuals: 6 },
    { period: 'Feb', Plan: 10, RevisedPlan: 7, LastYearActuals: 8 },
    { period: 'Jan', Plan: 7, RevisedPlan: 7, LastYearActuals: 5 },
    { period: 'Dec', Plan: 5, RevisedPlan: 5, LastYearActuals: 3 },
    { period: 'Nov', Plan: 4, RevisedPlan: 3, LastYearActuals: 4 },
    { period: 'Oct', Plan: 7, RevisedPlan: 6, LastYearActuals: 7 },
    { period: 'Sep', Plan: 12, RevisedPlan: 11, LastYearActuals: 11 },
    { period: 'Aug', Plan: 15, RevisedPlan: 13, LastYearActuals: 9 },
    { period: 'Jul', Plan: 13, RevisedPlan: 12, LastYearActuals: 13 },
    { period: 'Jun', Plan: 9, RevisedPlan: 6, LastYearActuals: 9 },
    { period: 'May', Plan: 12, RevisedPlan: 11, LastYearActuals: 11 },
    { period: 'Apr', Plan: 8, RevisedPlan: 5, LastYearActuals: null },
    { period: '2023', Plan: 18, RevisedPlan: 18, LastYearActuals: null },
    { period: '2022', Plan: 19, RevisedPlan: 17, LastYearActuals: null },
    { period: '2021', Plan: 20, RevisedPlan: 19, LastYearActuals: 6 }
  ];

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 40, right: 100, bottom: 60, left: 80 };
    const width = 900 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

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

    svg.append("g").call(d3.axisLeft(y));
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));

    data.forEach(d => {
      ['Plan', 'RevisedPlan', 'LastYearActuals'].forEach((key, i) => {
        if (d[key] !== null) {
          svg.append("rect")
            .attr("x", 0)
            .attr("y", y(d.period) + i * (y.bandwidth() / 3))
            .attr("width", x(d[key]))
            .attr("height", y.bandwidth() / 3)
            .attr("fill", color(key));
        }
      });
    });

    const legend = svg.append("g").attr("transform", `translate(${width - 50}, 0)`);
    ['Plan', 'RevisedPlan', 'LastYearActuals'].forEach((key, i) => {
      const legendRow = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
      legendRow.append("rect").attr("width", 12).attr("height", 12).attr("fill", color(key));
      legendRow.append("text").attr("x", 20).attr("y", 10).text(key).style("font-size", "12px");
    });
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default D3GanttChart;
