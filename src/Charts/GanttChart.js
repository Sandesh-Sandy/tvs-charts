import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const D3GanttChart = () => {
  const svgRef = useRef(null);

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
    { period: "Mar", Plan: 9, "Revised Plan": 5, "Last Year Actuals": 6 },
    { period: "Feb", Plan: 10, "Revised Plan": 7, "Last Year Actuals": 8 },
    { period: "Jan", Plan: 7, "Revised Plan": 7, "Last Year Actuals": 5 },
    { period: "Dec", Plan: 5, "Revised Plan": 5, "Last Year Actuals": 3 },
    { period: "Nov", Plan: 4, "Revised Plan": 3, "Last Year Actuals": 4 },
    { period: "Oct", Plan: 7, "Revised Plan": 6, "Last Year Actuals": 7 },
    { period: "Sep", Plan: 12, "Revised Plan": 11, "Last Year Actuals": 11 },
    { period: "Aug", Plan: 15, "Revised Plan": 13, "Last Year Actuals": 9 },
    { period: "Jul", Plan: 13, "Revised Plan": 12, "Last Year Actuals": 13 },
    { period: "Jun", Plan: 9, "Revised Plan": 6, "Last Year Actuals": 9 },
    { period: "May", Plan: 12, "Revised Plan": 11, "Last Year Actuals": 11 },
    { period: "Apr", Plan: 8, "Revised Plan": 5, "Last Year Actuals": null },
    { period: "2023", Plan: 18, "Revised Plan": 18, "Last Year Actuals": null },
    { period: "2022", Plan: 19, "Revised Plan": 17, "Last Year Actuals": null },
    { period: "2021", Plan: 20, "Revised Plan": 19, "Last Year Actuals": 6 },
  ];

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 40, right: 100, bottom: 60, left: 100 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.period))
      .range([0, height])
      .padding(0.6);

    const x = d3.scaleLinear().domain([0, 20]).range([0, width]);

    const color = d3
      .scaleOrdinal()
      .domain(["Plan", "Revised Plan", "Last Year Actuals"])
      .range(["#0000FF", "#FF0000", "#008000"]);

    svg
      .append("g")
      .call(d3.axisLeft(y).tickValues(y.domain()).tickSize(-width))
      .style("stroke-dasharray", "3 3")
      .style("stroke-opacity", 0.2);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(
        d3
          .axisBottom(x)
          .tickValues(d3.range(0, 20.1, 2.5))
          .tickFormat(d3.format(".1f"))
          .tickSize(-(width - margin.left - margin.right))
      )
      .style("stroke-dasharray", "3 3")
      .style("stroke-opacity", 0.2);

    data.forEach((d) => {
      ["Plan", "Revised Plan", "Last Year Actuals"].forEach((key, i) => {
        if (d[key] !== null) {
          svg
            .append("rect")
            .attr("x", 0)
            .attr("y", y(d.period))
            .attr("width", x(d[key]))
            .attr("height", y.bandwidth())
            .attr("fill", color(key))
            // .attr("transform", `translate(0, ${i * (y.bandwidth() / 3)})`)
            .on("mouseover", (event, data) => {
              tooltip
                .style("display", "block")
                .html(`${key} ${d[key]}`)
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
        }
      });
    });

    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 150}, ${margin.top - 30})`); // Moves it above the graph

    // Add background rectangle
    legend
      .append("rect")
      .attr("x", -10)
      .attr("y", -10)
      .attr("width", 130)
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
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", color(key));

      legendRow
        .append("text")
        .attr("x", 15)
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

export default D3GanttChart;
