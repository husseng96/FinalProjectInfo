/* global d3, Promise */

(function() { 
    // Read data from the CSV files
    Promise.all([
        d3.csv("overall.csv"),
        d3.csv("la_liga.csv"),
        d3.csv("national.csv"),
        d3.csv("yearly_goals.csv")

    ]).then(([rawDataOverall, rawDataLaLiga, rawDataNational, rawDataYearlyGoals]) => {
        const dataOverall = processData(rawDataOverall);
        const dataLaLiga = processData(rawDataLaLiga);
        const dataNational = processData(rawDataNational);
        const dataYearlyGoals = rawDataYearlyGoals.map(d => ({
            year: +d.Year,
            MessiGoals: +d.MessiGoals,
            RonaldoGoals: +d.RonaldoGoals
        }));
    
        console.log(dataYearlyGoals);
        createBarChart(dataOverall, "#chartOverall");
        createBarChart(dataLaLiga, "#chartLaLiga");
        createBarChart(dataNational, "#chartNational");
        createLineChart(dataYearlyGoals, "#chartYearlyGoals");
    });

    const createBarChart = (data, chartID) => {
        const margin = { top: 50, right: 20, bottom: 100, left: 40 };
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;
    
        const x0 = d3.scaleBand()
            .rangeRound([0, width])
            .paddingInner(0.1);
    
        const x1 = d3.scaleBand()
            .padding(0.05);
    
        const y = d3.scaleLinear()
            .rangeRound([height, 0]);
    
        const xAxis = d3.axisBottom(x0);
        const yAxis = d3.axisLeft(y).ticks(null, "s");
    
        function abbreviateLabel(label) {
            if (label.length > 10) {
                return label.substring(0, 10) + '...';
            } else {
                return label;
            }
        }
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background-color", "#f9f9f9")
            .style("color", "#333")
            .style("border", "1px solid #ccc")
            .style("border-radius", "5px")
            .style("padding", "5px");
    
    
        const svg = d3.select(chartID)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
        
        const keys = ["Messi", "Ronaldo"];
        x0.domain(data.map(d => d.category));
        x1.domain(keys).rangeRound([0, x0.bandwidth()]);
        y.domain([0, d3.max(data, d => Math.max(d.Messi, d.Ronaldo))]).nice();
    
        svg.append("g")
            .selectAll("g")
            .data(data)
            .join("g")
            .attr("transform", d => "translate(" + x0(d.category) + ",0)")
            .selectAll("rect")
            .data(d => keys.map(key => ({ key, value: d[key], category: d.category })))
            .join("rect")
            .attr("x", d => x1(d.key))
            .attr("y", d => y(d.value))
            .attr("width", x1.bandwidth())
            .attr("height", d => height - y(d.value))
            .attr("class", "bar")
            .style("fill", d => d.key === "Messi" ? "steelblue" : "white")
            .on("mouseover", function (event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
            d3.select(event.currentTarget) //add a stroke to highlighted point 
                       .style("stroke", "red");
                tooltip.html(d.category + "<br/>" + d.key + ": " + d.value)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function () {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
             d3.select('#tooltip').style('display', 'none'); // hide tooltip
                   d3.select(event.currentTarget) //remove the stroke from point
                       .style("stroke", "none"); 
            });
    
        svg.append("g")
            .call(xAxis)
            .attr("transform", "translate(0," + height + ")")
            .selectAll("text") // Add this line
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)")
            .text((d) => abbreviateLabel(d)); // Add this line
        svg.append("g")
            .call(yAxis);
    
        svg.append("g")
            .selectAll("g")
            .data(keys)
            .join("text")
            .attr("x", (d, i) => width - 300 + i * 100)
            .attr("y", -10)
            .text(d => d)
            .style("font-weight", "bold")
            .style("fill", (d, i) => i === 0 ? "steelblue" : "white");
    
    
    };
    onst createLineChart = (data, chartID) => {
        const margin = { top: 50, right: 20, bottom: 50, left: 50 };
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;
    
        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.year))
            .range([0, width]);
    
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(d.MessiGoals, d.RonaldoGoals))]).nice()
            .range([height, 0]);
    
        const line = d3.line()
            .x(d => x(d.year))
            .y(d => y(d.MessiGoals));
    
        const line2 = d3.line()
            .x(d => x(d.year))
            .y(d => y(d.RonaldoGoals));
    
    
        const svg = d3.select(chartID)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
       
    
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background-color", "#f9f9f9")
            .style("color", "#333")
            .style("border", "1px solid #ccc")
            .style("border-radius", "5px")
            .style("padding", "5px");
    
        // Add circles to the lines for Messi and Ronaldo
        const circleData = data.flatMap(d => [
            { ...d, key: "Messi", value: d.MessiGoals },
            { ...d, key: "Ronaldo", value: d.RonaldoGoals }
        ]);
    
        svg.selectAll(".circle")
            .data(circleData)
            .enter()
            .append("circle")
            .attr("class", "circle")
            .attr("cx", d => x(d.year))
            .attr("cy", d => y(d.value))
            .attr("r", 4)
            .style("fill", d => d.key === "Messi" ? "steelblue" : "white")
            .style("stroke", "white")
            .style("stroke-width", "1px")
            .on("mouseover", (event, d) => {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
            d3.select(event.currentTarget) //add a stroke to highlighted point 
                       .style("stroke", "red");
                tooltip.html(d.key + " (" + d.year + "): " + d.value)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", () => {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            d3.select('#tooltip').style('display', 'none'); // hide tooltip
                   d3.select(event.currentTarget) //remove the stroke from point
                       .style("stroke", "none"); 
            });
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line);
    
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-width", 1.5)
            .attr("d", line2);
    
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(d3.format("d")));
    
        svg.append("g")
            .call(d3.axisLeft(y));
    
        // Add legend
        svg.append("text")
            .attr("x", width - 150)
            .attr("y", 30)
            .text("Messi")
            .style("font-weight", "bold")
            .style("fill", "steelblue");
    
        svg.append("text")
            .attr("x", width - 150)
            .attr("y", 50)
            .text("Ronaldo")
            .style("font-weight", "bold")
            .style("fill", "white");
    
    };
    
    
    const processData = rawData => {
        const processedData = rawData.map(d => ({
            category: d.Category,
            Messi: +d.Messi,
            Ronaldo: +d.Ronaldo
            //Ronaldo: +d[" Ronaldo"]
        }));
        return processedData;
    };

    ScrollOut({
        targets: ".chart-container > div:first-child",
        onShown: function (el) {
            el.classList.add("sticky");
            el.classList.remove("inactive");
        },
        onHidden: function (el) {
            el.classList.remove("sticky");
            el.classList.add("inactive");
        },
    });

})();