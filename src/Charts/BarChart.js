import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const D3BarChart = () => {
  const svgRef = useRef(null);

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
    // Clear any existing SVG
    d3.select(svgRef.current).selectAll("*").remove();

    // Set dimensions
    const margin = { top: 40, right: 100, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Set scales
    const x0 = d3.scaleBand()
      .domain(data.map(d => d.period))
      .range([0, width])
      .padding(0.2);

    const x1 = d3.scaleBand()
      .domain(['Plan', 'RevisedPlan', 'LastYearActuals'])
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3.scaleLinear()
      .domain([0, 20.1])
      .range([height, 0]);

    // Add gridlines
    svg.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y).tickValues(d3.range(0, 22.5, 2.5))
        .tickSize(-width)
        .tickFormat('')
      )
      .style('stroke-dasharray', '3 3')
      .style('stroke-opacity', 0.2);

   

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x0).tickSize(-height)
      )
      .style('stroke-dasharray', '3 3')
      .style('stroke-opacity', 0.2)
      .selectAll('text')
      .style('text-anchor', 'middle');

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y));

    // Add X axis label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .style('text-anchor', 'middle')
      .text('Year/Month');

    // Add Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Values');

    // Color scale
    const color = d3.scaleOrdinal()
      .domain(['Plan', 'RevisedPlan', 'LastYearActuals'])
      .range(['#0000FF', '#FF0000', '#008000']);

    // Add bars
    data.forEach(d => {
      svg.append('g')
        .selectAll('rect')
        .data(['Plan', 'RevisedPlan', 'LastYearActuals'])
        .join('rect')
        .attr('x', key => x0(d.period) + x1(key))
        .attr('y', key => y(d[key] || 0))
        .attr('width', x1.bandwidth())
        .attr('height', key => height - y(d[key] || 0))
        .attr('fill', key => color(key));
    });

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 10}, 0)`);

    ['Plan', 'RevisedPlan', 'LastYearActuals'].forEach((key, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`);
        
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

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 0 - margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text('Bar Graph Representation of Plans and Actuals');

  }, []);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default D3BarChart;