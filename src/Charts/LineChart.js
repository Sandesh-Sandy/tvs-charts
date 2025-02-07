import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const LineChart = () => {
  const svgRef = useRef();
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

  useEffect(() => {
    // Sample data - you can replace this with your actual data
    const data = [
      { date: "2021", Plan: 20, "Revised Plan": 19, "Last Year Actuals": 6 },
      { date: "2022", Plan: 19, "Revised Plan": 17, "Last Year Actuals": null },
      { date: "2023", Plan: 18, "Revised Plan": 18, "Last Year Actuals": null },
      { date: "Apr", Plan: 8, "Revised Plan": 5, "Last Year Actuals": null },
      { date: "May", Plan: 12, "Revised Plan": 11, "Last Year Actuals": null },
      { date: "Jun", Plan: 9, "Revised Plan": 6, "Last Year Actuals": 9 },
      { date: "Jul", Plan: 13, "Revised Plan": 12, "Last Year Actuals": 13 },
      { date: "Aug", Plan: 15, "Revised Plan": 13, "Last Year Actuals": 9 },
      { date: "Sep", Plan: 12, "Revised Plan": 11, "Last Year Actuals": 11 },
      { date: "Oct", Plan: 7, "Revised Plan": 6, "Last Year Actuals": 4 },
      { date: "Nov", Plan: 4, "Revised Plan": 3, "Last Year Actuals": 3 },
      { date: "Dec", Plan: 5, "Revised Plan": 5, "Last Year Actuals": 5 },
      { date: "Jan", Plan: 10, "Revised Plan": 7, "Last Year Actuals": 8 },
      { date: "Feb", Plan: 9, "Revised Plan": 5, "Last Year Actuals": 6 },
      { date: "Mar", Plan: 9, "Revised Plan": 5, "Last Year Actuals": 6 },
    ];

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

    // X scale
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.date))
      .range([0, width])
      .padding(0.1);

    // Y scale
    const y = d3.scaleLinear().domain([0, 22]).range([height, 0]);

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(-height))
      .style("stroke-opacity", 0.2)
      .style("stroke-dasharray", "3 3")
      .selectAll("text")
      .style("text-anchor", "middle")
      .attr("dx", "-1em")
      .attr("dy", "1em")
      .attr("transform", "rotate(-45)");

    // Add grid lines
    svg
      .append("g")
      .call(
        d3
          .axisLeft(y)
          .tickValues(d3.range(0, 20.1, 2.5))
          .tickSize(-width)
          .tickFormat(d3.format(".1f"))
      )
      .style("stroke-dasharray", "3 3")
      .style("stroke-opacity", 0.2);

    // Line generators
    const createLine = d3
      .line()
      .x((d) => x(d.date) + x.bandwidth() / 2)
      .y((d) => y(d.value));

    // Create lines for each series
    const series = ["Plan", "Revised Plan", "Last Year Actuals"];
    const colors = ["blue", "red", "green"];

    series.forEach((serie, i) => {
      const seriesData = data
        .map((d) => ({
          date: d.date,
          value: d[serie],
        }))
        .filter((d) => d.value !== null);

      // Add lines
      svg
        .append("path")
        .datum(seriesData)
        .attr("fill", "none")
        .attr("stroke", colors[i])
        .attr("stroke-width", 2)
        .attr("d", createLine);

      seriesData.forEach((d) => {
        let shape;
        if (serie === "Plan") {
          shape = svg
            .append("circle")
            .attr("cx", x(d.date) + x.bandwidth() / 2)
            .attr("cy", y(d.value))
            .attr("r", 4)
            .attr("fill", colors[i])
            .on("mouseover", (event) => {
              tooltip
                .style("display", "block")
                .html(`${serie}: ${d.value}`)
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
        } else if (serie === "Revised Plan") {
          shape = svg
            .append("rect")
            .attr("x", x(d.date) + x.bandwidth() / 2 - 4)
            .attr("y", y(d.value) - 4)
            .attr("width", 8)
            .attr("height", 8)
            .attr("fill", colors[i]);
        } else if (serie === "Last Year Actuals") {
          shape = svg
            .append("path")
            .attr(
              "d",
              `M ${x(d.date) + x.bandwidth() / 2} ${y(d.value) - 5} 
                 L ${x(d.date) + x.bandwidth() / 2 + 5} ${y(d.value)} 
                 L ${x(d.date) + x.bandwidth() / 2} ${y(d.value) + 5} 
                 L ${x(d.date) + x.bandwidth() / 2 - 5} ${y(d.value)} Z`
            )
            .attr("fill", colors[i]);
        }
      });
    });

    // Add title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Line Graph Representation of Plans and Actuals");

    // Add legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 180}, ${20})`); // Moves it above the graph

    // Add background rectangle
    legend
      .append("rect")
      .attr("x", -10)
      .attr("y", -10)
      .attr("width", 180)
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

      if (key === "Plan") {
        // Circle for Plan
        legendRow
          .append("circle")
          .attr("cx", 10)
          .attr("cy", 5)
          .attr("r", 5)
          .attr("fill", colors[i]);
      } else if (key === "Revised Plan") {
        // Square for Revised Plan
        legendRow
          .append("rect")
          .attr("x", 5)
          .attr("y", 0)
          .attr("width", 10)
          .attr("height", 10)
          .attr("fill", colors[i]);
      } else if (key === "Last Year Actuals") {
        // Diamond for Last Year Actuals
        legendRow
          .append("path")
          .attr("d", `M 10 0 L 15 5 L 10 10 L 5 5 Z`)
          .attr("fill", colors[i]);
      }

      // Add text label
      legendRow
        .append("text")
        .attr("x", 25)
        .attr("y", 8)
        .text(key)
        .style("font-size", "12px")
        .style("fill", "#000"); // Black text for contrast
    });
  }, []);

  return (
    <div className='w-full h-full'>
      <svg ref={svgRef} className='w-full h-full'></svg>
    </div>
  );
};

export default LineChart;
