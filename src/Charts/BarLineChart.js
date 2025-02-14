import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const EmployeeExperienceChart = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 400;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    // Yearly data for bar chart
    const dataYears = [
      { year: "2021", score: 7 },
      { year: "2022", score: 15 },
      { year: "2023", score: 11 },
    ];

    // Monthly data for line chart
    const dataMonths = [
      { month: "Apr", plan: 10, actual: 12 },
      { month: "May", plan: 12, actual: 10 },
      { month: "Jun", plan: 14, actual: 8 },
      { month: "Jul", plan: 16, actual: 7 },
      { month: "Aug", plan: 18, actual: 6 },
      { month: "Sep", plan: 15, actual: 5 },
      { month: "Oct", plan: 12, actual: 6 },
      { month: "Nov", plan: 8, actual: 7 },
      { month: "Dec", plan: 5, actual: 9 },
      { month: "Jan", plan: 9, actual: 3 },
      { month: "Feb", plan: 12, actual: 5 },
      { month: "Mar", plan: 14, actual: 4 },
    ];

    // Select the SVG element
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background", "#f4f4f4");

    // Scales for the bar chart (left)
    const xScaleYears = d3
      .scaleBand()
      .domain(dataYears.map((d) => d.year))
      .range([margin.left, width / 4])
      .padding(0.4);

    const yScale = d3
      .scaleLinear()
      .domain([0, 20])
      .range([height - margin.bottom, margin.top]);

    // Scales for the line chart (right)
    const xScaleMonths = d3
      .scalePoint()
      .domain(dataMonths.map((d) => d.month))
      .range([width / 4 + margin.left, width - margin.right]);

    // Draw Bar Chart
    svg
      .selectAll(".bar")
      .data(dataYears)
      .enter()
      .append("rect")
      .attr("x", (d) => xScaleYears(d.year))
      .attr("y", (d) => yScale(d.score))
      .attr("width", xScaleYears.bandwidth())
      .attr("height", (d) => height - margin.bottom - yScale(d.score))
      .attr("fill", "steelblue");

    // Function to draw segmented colored lines
    const drawActualLine = () => {
      dataMonths.forEach((d, i) => {
        if (i === 0) return; // Skip first data point, no previous point to connect

        svg
          .append("line")
          .attr("x1", xScaleMonths(dataMonths[i - 1].month))
          .attr("y1", yScale(dataMonths[i - 1].actual))
          .attr("x2", xScaleMonths(d.month))
          .attr("y2", yScale(d.actual))
          .attr(
            "stroke",
            dataMonths[i - 1].plan < dataMonths[i - 1].actual ? "green" : "red"
          ) // Green if above Plan, Red otherwise
          .attr("stroke-width", 2);
      });
    };

    // Draw Plan Line (always blue)
    const linePlan = d3
      .line()
      .x((d) => xScaleMonths(d.month))
      .y((d) => yScale(d.plan));

    svg
      .append("path")
      .datum(dataMonths)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
      .attr("d", linePlan);

    // Draw segmented Actual Line with colors
    drawActualLine();

    // X-Axis for months
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScaleMonths));

    // Y-Axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    // X-Axis for years (bar chart)
    svg
      .append("g")
      .attr("transform", `translate(${0},${height - margin.bottom})`)
      .call(d3.axisBottom(xScaleYears));

    // Legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 200},${20})`);

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "blue");

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 12)
      .text("Plan")
      .style("font-size", "12px");

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 20)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "green");

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 32)
      .text("Actual (Above Plan)")
      .style("font-size", "12px");

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 40)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "red");

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 52)
      .text("Actual (Below Plan)")
      .style("font-size", "12px");
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default EmployeeExperienceChart;
