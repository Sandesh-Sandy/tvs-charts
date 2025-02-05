import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LineChart = () => {
  const svgRef = useRef();

  useEffect(() => {
    // Sample data - you can replace this with your actual data
    const data = [
      { date: '2021', plan: 20, revisedPlan: 19, lastYear: 6 },
      { date: '2022', plan: 19, revisedPlan: 17, lastYear: null },
      { date: '2023', plan: 18, revisedPlan: 18, lastYear: null },
      { date: 'Apr', plan: 8, revisedPlan: 5, lastYear: null },
      { date: 'May', plan: 12, revisedPlan: 11, lastYear: null },
      { date: 'Jun', plan: 9, revisedPlan: 6, lastYear: 9 },
      { date: 'Jul', plan: 13, revisedPlan: 12, lastYear: 13 },
      { date: 'Aug', plan: 15, revisedPlan: 13, lastYear: 9 },
      { date: 'Sep', plan: 12, revisedPlan: 11, lastYear: 11 },
      { date: 'Oct', plan: 7, revisedPlan: 6, lastYear: 4 },
      { date: 'Nov', plan: 4, revisedPlan: 3, lastYear: 3 },
      { date: 'Dec', plan: 5, revisedPlan: 5, lastYear: 5 },
      { date: 'Jan', plan: 10, revisedPlan: 7, lastYear: 8 },
      { date: 'Feb', plan: 9, revisedPlan: 5, lastYear: 6 },
      { date: 'Mar', plan: 9, revisedPlan: 5, lastYear: 6 }
    ];

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

    // X scale
    const x = d3.scaleBand()
      .domain(data.map(d => d.date))
      .range([0, width])
      .padding(0.1);

    // Y scale
    const y = d3.scaleLinear()
      .domain([0, 20])
      .range([height, 0]);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y));

    // Add grid lines
    svg.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y)
        .tickSize(-width)
        .tickFormat('')
      )
      .style('stroke-dasharray', '3,3')
      .style('opacity', 0.1);

    // Line generators
    const createLine = d3.line()
      .x(d => x(d.date) + x.bandwidth() / 2)
      .y(d => y(d.value));

    // Create lines for each series
    const series = ['plan', 'revisedPlan', 'lastYear'];
    const colors = ['blue', 'red', 'green'];
    const labels = ['Plan', 'Revised Plan', 'Last Year Actuals'];

    series.forEach((serie, i) => {
      const seriesData = data
        .map(d => ({
          date: d.date,
          value: d[serie]
        }))
        .filter(d => d.value !== null);

      // Add lines
      svg.append('path')
        .datum(seriesData)
        .attr('fill', 'none')
        .attr('stroke', colors[i])
        .attr('stroke-width', 2)
        .attr('d', createLine);

      // Add points
      svg.selectAll(`circle-${serie}`)
        .data(seriesData)
        .enter()
        .append('circle')
        .attr('cx', d => x(d.date) + x.bandwidth() / 2)
        .attr('cy', d => y(d.value))
        .attr('r', 4)
        .attr('fill', colors[i]);
    });

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text('Line Graph Representation of Plans and Actuals');

    // Add legend
    const legend = svg.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'start')
      .selectAll('g')
      .data(labels)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${width + 10},${i * 20})`);

    legend.append('circle')
      .attr('r', 4)
      .attr('fill', (d, i) => colors[i]);

    legend.append('text')
      .attr('x', 10)
      .attr('y', 3)
      .text(d => d);

  }, []);

  return (
    <div className="w-full h-full">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
};

export default LineChart;