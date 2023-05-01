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

    })();