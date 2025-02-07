import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const MilestoneChart = () => {
  const svgRef = useRef();

  useEffect(() => {
    // Sample data
    const data = [
      { date: "2021", plan: 20, "Revised Plan": 19, lastYear: 6 },
      { date: "2022", plan: 19, "Revised Plan": 17, lastYear: null },
      { date: "2023", plan: 18, "Revised Plan": 18, lastYear: null },
      { date: "Apr", plan: 8, "Revised Plan": 5, lastYear: null },
      { date: "May", plan: 12, "Revised Plan": 6, lastYear: 11 },
      { date: "Jun", plan: 9, "Revised Plan": 6, lastYear: 9 },
      { date: "Jul", plan: 13, "Revised Plan": 12, lastYear: 13 },
      { date: "Aug", plan: 15, "Revised Plan": 13, lastYear: 9 },
      { date: "Sep", plan: 12, "Revised Plan": 6, lastYear: 11 },
      { date: "Oct", plan: 7, "Revised Plan": 3, lastYear: 4 },
      { date: "Nov", plan: 4, "Revised Plan": 3, lastYear: 3 },
      { date: "Dec", plan: 5, "Revised Plan": 5, lastYear: 5 },
      { date: "Jan", plan: 10, "Revised Plan": 7, lastYear: 8 },
      { date: "Feb", plan: 9, "Revised Plan": 7, lastYear: 6 },
      { date: "Mar", plan: 9, "Revised Plan": 5, lastYear: 6 },
    ];

    // Clear any existing SVG
    d3.select(svgRef.current).selectAll("*").remove();

    // Set dimensions
    const margin = { top: 40, right: 120, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X scale
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.date))
      .range([0, width])
      .padding(0.1);

    // Y scale
    const y = d3
      .scaleLinear()
      .domain([0, 22]) // Set fixed domain to match the image
      .range([height, 0]);

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "middle")
      .attr("dy", "1em");

    // Add Y axis
    svg.append("g").call(
      d3
        .axisLeft(y)
        .tickValues(d3.range(0, 22.5, 2.5)) // Set ticks every 2.5 units
        .tickFormat((d) => d.toFixed(1))
    );

    // Add grid lines
    svg
      .append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(y)
          .tickValues(d3.range(0, 22.5, 2.5))
          .tickSize(-width)
          .tickFormat("")
      )
      .style("stroke", "#e0e0e0")
      .style("stroke-dasharray", "2,2");

    // Define series properties
    const seriesConfig = [
      { key: "plan", color: "#0000FF", symbol: "circle", label: "Plan" },
      {
        key: '"Revised Plan"',
        color: "#FF0000",
        symbol: "square",
        label: '"Revised Plan"',
      },
      {
        key: "lastYear",
        color: "#008000",
        symbol: "diamond",
        label: "Last Year Actuals",
      },
    ];

    // Create and add series
    seriesConfig.forEach((series) => {
      const seriesData = data
        .map((d) => ({
          date: d.date,
          value: d[series.key],
        }))
        .filter((d) => d.value !== null);

      // Add points
      svg
        .selectAll(`point-${series.key}`)
        .data(seriesData)
        .enter()
        .append("path")
        .attr(
          "transform",
          (d) => `translate(${x(d.date) + x.bandwidth() / 2},${y(d.value)})`
        )
        .attr(
          "d",
          d3
            .symbol()
            .type(
              series.symbol === "circle"
                ? d3.symbolCircle
                : series.symbol === "square"
                ? d3.symbolSquare
                : d3.symbolDiamond
            )
            .size(100)
        )
        .attr("fill", series.color);
    });

    // Add title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Milestone Chart");

    // Add legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width + 10}, 0)`);

    seriesConfig.forEach((series, i) => {
      const legendItem = legend
        .append("g")
        .attr("transform", `translate(0, ${i * 20})`);

      legendItem
        .append("path")
        .attr(
          "d",
          d3
            .symbol()
            .type(
              series.symbol === "circle"
                ? d3.symbolCircle
                : series.symbol === "square"
                ? d3.symbolSquare
                : d3.symbolDiamond
            )
            .size(100)
        )
        .attr("fill", series.color)
        .attr("transform", "translate(0, 8)");

      legendItem
        .append("text")
        .attr("x", 15)
        .attr("y", 12)
        .text(series.label)
        .style("font-size", "12px");
    });
  }, []);

  return (
    <div className='w-full h-full'>
      <svg ref={svgRef} className='w-full h-full'></svg>
    </div>
  );
};

export default MilestoneChart;
