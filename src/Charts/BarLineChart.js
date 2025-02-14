import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const EmployeeExperienceChart = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 400;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    const dataYears = [
      { year: "2021", score: 7 },
      { year: "2022", score: 15 },
      { year: "2023", score: 11 },
    ];

    const dataMonths = [
      { month: "Apr", plan: 10, revised: 8, actual: 12 },
      { month: "May", plan: 12, revised: 11, actual: 10 },
      { month: "Jun", plan: 14, revised: 12, actual: 8 },
      { month: "Jul", plan: 16, revised: 14, actual: 7 },
      { month: "Aug", plan: 18, revised: 15, actual: 6 },
      { month: "Sep", plan: 15, revised: 13, actual: 5 },
      { month: "Oct", plan: 12, revised: 10, actual: 6 },
      { month: "Nov", plan: 8, revised: 7, actual: 7 },
      { month: "Dec", plan: 5, revised: 6, actual: 9 },
      { month: "Jan", plan: 9, revised: 8, actual: 3 },
      { month: "Feb", plan: 12, revised: 10, actual: 5 },
      { month: "Mar", plan: 14, revised: 11, actual: 4 },
    ];

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background", "#f4f4f4");

    const xScaleYears = d3
      .scaleBand()
      .domain(dataYears.map((d) => d.year))
      .range([margin.left, width / 4])
      .padding(0.4);

    const yScale = d3
      .scaleLinear()
      .domain([0, 20])
      .range([height - margin.bottom, margin.top]);

    const xScaleMonths = d3
      .scalePoint()
      .domain(dataMonths.map((d) => d.month))
      .range([width / 4 + margin.left, width - margin.right]);

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

    const lineGenerator = d3
      .line()
      .x((d) => xScaleMonths(d.month))
      .y((d) => yScale(d.plan));

    svg
      .append("path")
      .datum(dataMonths)
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 2)
      .attr("d", lineGenerator);

    const lineRevised = d3
      .line()
      .x((d) => xScaleMonths(d.month))
      .y((d) => yScale(d.revised));

    svg
      .append("path")
      .datum(dataMonths)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-dasharray", "5,5")
      .attr("stroke-width", 2)
      .attr("d", lineRevised);

    const lineActual = d3
      .line()
      .x((d) => xScaleMonths(d.month))
      .y((d) => yScale(d.actual));

    svg
      .append("path")
      .datum(dataMonths)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-dasharray", "3,3")
      .attr("stroke-width", 2)
      .attr("d", lineActual);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScaleMonths));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    svg
      .append("g")
      .attr("transform", `translate(${width / 4},${height - margin.bottom})`)
      .call(d3.axisBottom(xScaleYears));

    // Legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 200},${20})`);

    legend
      .append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "green");
    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 12)
      .text("Plan")
      .style("font-size", "12px");

    legend
      .append("rect")
      .attr("y", 20)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "blue");
    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 32)
      .text("Revised Plan")
      .style("font-size", "12px");

    legend
      .append("rect")
      .attr("y", 40)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "red");
    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 52)
      .text("Last Year Actuals")
      .style("font-size", "12px");
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default EmployeeExperienceChart;
