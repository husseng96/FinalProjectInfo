/* global d3, Promise */

(function() { 
    // Read data from the CSV files
    Promise.all([
        d3.csv("overall.csv"),
        d3.csv("la_liga.csv"),
        d3.csv("national.csv"),
        d3.csv("yearly_goals.csv")

        ])

    })();