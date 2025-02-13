import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const MarketShareChart = () => {
  const svgRef = useRef();

  const data = [
    // Historical data (bars)
    { period: "21-22", value: 15.2, type: "historical" },
    { period: "22-23", value: 16.0, type: "historical" },
    { period: "23-24", value: 16.6, type: "historical" },

    // Monthly data
    {
      period: "Apr",
      current: 18.5,
      previous: 17.0,
      reference: 16.5,
      type: "monthly",
    },
    {
      period: "May",
      current: 18.0,
      previous: 16.5,
      reference: 16.5,
      type: "monthly",
    },
    {
      period: "Jun",
      current: 17.5,
      previous: 16.8,
      reference: 16.5,
      type: "monthly",
    },
    {
      period: "Jul",
      current: 17.0,
      previous: 16.5,
      reference: 16.5,
      type: "monthly",
    },
    {
      period: "Aug",
      current: 15.5,
      previous: 12.0,
      reference: 15.0,
      type: "monthly",
    },
    {
      period: "Sep",
      current: 16.0,
      previous: 25.0,
      reference: 18.0,
      type: "monthly",
    },
    {
      period: "Oct",
      current: 16.1,
      previous: 16.5,
      reference: 25.0,
      type: "monthly",
    },
    {
      period: "Nov",
      current: 16.1,
      previous: 16.5,
      reference: 16.5,
      type: "monthly",
    },
    {
      period: "Dec",
      current: 20.8,
      previous: 16.5,
      reference: 16.5,
      type: "monthly",
    },
    {
      period: "Jan",
      current: 20.5,
      previous: 16.5,
      reference: 16.7,
      type: "monthly",
    },
    {
      period: "Feb",
      current: 20.6,
      previous: 16.5,
      reference: 16.7,
      type: "monthly",
    },
    {
      period: "Mar",
      current: 20.6,
      previous: 16.5,
      reference: 16.7,
      type: "monthly",
    },

    // YTD data
    { period: "LY YTD", value: 16.7, type: "ytd", color: "#666" },
    { period: "PY YTD", value: 18.3, type: "ytd", color: "#00F" },
    { period: "TY YTD", value: 15.8, type: "ytd", color: "#F00" },
  ];

  useEffect(() => {
    const margin = { top: 40, right: 30, bottom: 50, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear previous SVG
    d3.select(svgRef.current).selectAll("*").remove();

    // Create SVG container
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const historicalX = d3
      .scaleBand()
      .domain(data.filter((d) => d.type === "historical").map((d) => d.period))
      .range([0, width * 0.2])
      .padding(0.2);

    const monthlyX = d3
      .scaleBand()
      .domain(data.filter((d) => d.type === "monthly").map((d) => d.period))
      .range([width * 0.2, width * 0.8])
      .padding(0.1);

    const ytdX = d3
      .scaleBand()
      .domain(data.filter((d) => d.type === "ytd").map((d) => d.period))
      .range([width * 0.8, width])
      .padding(0.2);

    const y = d3.scaleLinear().domain([6.5, 31]).range([height, 0]);

    // Draw axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(historicalX));

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(monthlyX));

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(ytdX));

    svg.append("g").call(
      d3
        .axisLeft(y)
        .tickValues([12.5, 18.5, 24.5, 30.5])
        .tickFormat((d) => `${d}%`)
    );

    // Draw historical bars
    svg
      .selectAll(".historical-bar")
      .data(data.filter((d) => d.type === "historical"))
      .join("rect")
      .attr("class", "historical-bar")
      .attr("x", (d) => historicalX(d.period))
      .attr("y", (d) => y(d.value))
      .attr("width", historicalX.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1);

    // Draw YTD bars
    svg
      .selectAll(".ytd-bar")
      .data(data.filter((d) => d.type === "ytd"))
      .join("rect")
      .attr("class", "ytd-bar")
      .attr("x", (d) => ytdX(d.period))
      .attr("y", (d) => y(d.value))
      .attr("width", ytdX.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("fill", (d) => d.color);

    // Create line generators
    const currentLine = d3
      .line()
      .x((d) => monthlyX(d.period) + monthlyX.bandwidth() / 2)
      .y((d) => y(d.current));

    const previousLine = d3
      .line()
      .x((d) => monthlyX(d.period) + monthlyX.bandwidth() / 2)
      .y((d) => y(d.previous));

    const referenceLine = d3
      .line()
      .x((d) => monthlyX(d.period) + monthlyX.bandwidth() / 2)
      .y((d) => y(d.reference));

    const monthlyData = data.filter((d) => d.type === "monthly");

    // Draw lines
    svg
      .append("path")
      .datum(monthlyData)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
      .attr("d", currentLine);

    svg
      .append("path")
      .datum(monthlyData)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 2)
      .attr("d", previousLine);

    svg
      .append("path")
      .datum(monthlyData)
      .attr("fill", "none")
      .attr("stroke", "gray")
      .attr("stroke-width", 2)
      .attr("d", referenceLine);

    // Add title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Retail Market Share");
  }, []);

  return (
    <div className='w-full h-full'>
      <svg ref={svgRef} />
    </div>
  );
};

export default MarketShareChart;
