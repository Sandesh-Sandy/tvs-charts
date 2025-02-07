import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const D3BarChart = () => {
  const svgRef = useRef(null);
  // Append a tooltip div
  const tooltip = d3
    .select("body")
    .append("div")
    .style("position", "absolute")
    .style("background", "#fff")
    .style("border", "1px solid #ccc")
    .style("padding", "5px")
    .style("border-radius", "4px")
    .style("font-size", "12px")
    .style("display", "none");

  const data = [
    { period: "2021", Plan: 20, "Revised Plan": 19, "Last Year Actuals": 6 },
    { period: "2022", Plan: 19, "Revised Plan": 17, "Last Year Actuals": null },
    { period: "2023", Plan: 18, "Revised Plan": 18, "Last Year Actuals": null },
    { period: "Apr", Plan: 8, "Revised Plan": 5, "Last Year Actuals": null },
    { period: "May", Plan: 12, "Revised Plan": 11, "Last Year Actuals": 11 },
    { period: "Jun", Plan: 9, "Revised Plan": 6, "Last Year Actuals": 9 },
    { period: "Jul", Plan: 13, "Revised Plan": 12, "Last Year Actuals": 13 },
    { period: "Aug", Plan: 15, "Revised Plan": 13, "Last Year Actuals": 9 },
    { period: "Sep", Plan: 12, "Revised Plan": 11, "Last Year Actuals": 11 },
    { period: "Oct", Plan: 7, "Revised Plan": 6, "Last Year Actuals": 7 },
    { period: "Nov", Plan: 4, "Revised Plan": 3, "Last Year Actuals": 4 },
    { period: "Dec", Plan: 5, "Revised Plan": 5, "Last Year Actuals": 3 },
    { period: "Jan", Plan: 7, "Revised Plan": 7, "Last Year Actuals": 5 },
    { period: "Feb", Plan: 10, "Revised Plan": 7, "Last Year Actuals": 8 },
    { period: "Mar", Plan: 9, "Revised Plan": 5, "Last Year Actuals": 6 },
  ];

  useEffect(() => {
    // Clear any existing SVG
    d3.select(svgRef.current).selectAll("*").remove();

    // Set dimensions
    const margin = { top: 40, right: 100, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set scales
    const x0 = d3
      .scaleBand()
      .domain(data.map((d) => d.period))
      .range([0, width])
      .padding(0.2);

    const x1 = d3
      .scaleBand()
      .domain(["Plan", "Revised Plan", "Last Year Actuals"])
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3.scaleLinear().domain([0, 20]).range([height, 0]);

    // Add gridlines
    svg
      .append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(y)
          .tickValues(d3.range(0, 22, 2.5))
          .tickFormat(d3.format(".1f"))
          .tickSize(-width)
      )
      .style("stroke-dasharray", "3 3")
      .style("stroke-opacity", 0.2);

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x0).tickSize(-height))
      .style("stroke-dasharray", "3 3")
      .style("stroke-opacity", 0.2)
      .selectAll("text")
      .style("text-anchor", "middle")
      .attr("dx", "-1.5em")
      .attr("dy", "0.8em")
      .attr("transform", "rotate(-45)");

    // Add X axis label
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .style("text-anchor", "middle")
      .text("Year/Month");

    // Add Y axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Values");

    // Color scale
    const color = d3
      .scaleOrdinal()
      .domain(["Plan", "Revised Plan", "Last Year Actuals"])
      .range(["#0000FF", "#FF0000", "#008000"]);

    // Add bars
    data.forEach((d) => {
      svg
        .append("g")
        .selectAll("rect")
        .data(
          data.flatMap((d) =>
            ["Plan", "Revised Plan", "Last Year Actuals"].map((key) => ({
              period: d.period,
              key,
              value: d[key],
            }))
          )
        )
        .join("rect")
        .attr("x", (d) => x0(d.period) + x1(d.key))
        .attr("y", (d) => y(d.value || 0))
        .attr("width", x1.bandwidth())
        .attr("height", (d) => height - y(d.value || 0))
        .attr("fill", (d) => color(d.key))
        .on("mouseover", (event, d) => {
          tooltip
            .style("display", "block")
            .html(`${d.key}: ${d.value} `)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 20}px`);
        })
        .on("mousemove", (event) => {
          tooltip
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 20}px`);
        })
        .on("mouseout", () => {
          tooltip.style("display", "none");
        });
    });

    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 150}, ${20})`); // Moves it above the graph

    // Add background rectangle
    legend
      .append("rect")
      .attr("x", -10)
      .attr("y", -10)
      .attr("width", 150)
      .attr("height", 70)
      .attr("fill", "#fff") // White background
      .attr("stroke", "#ccc") // Light gray border
      .attr("rx", 5) // Rounded corners
      .attr("ry", 5)
      .style("opacity", 0.8); // Slight transparency

    ["Plan", "Revised Plan", "Last Year Actuals"].forEach((key, i) => {
      const legendRow = legend
        .append("g")
        .attr("transform", `translate(10, ${i * 20})`);

      legendRow
        .append("rect")
        .attr("width", 20)
        .attr("height", 10)
        .attr("fill", color(key));

      legendRow
        .append("text")
        .attr("x", 25)
        .attr("y", 10)
        .text(key)
        .style("font-size", "12px")
        .style("fill", "#000"); // Black text for contrast
    });
  }, []);

  return (
    <div className='w-full h-full flex justify-center items-center'>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default D3BarChart;
