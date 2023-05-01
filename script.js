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
    };

    })();