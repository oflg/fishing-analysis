/*\
title: $:/plugins/oflg/fishing-analysis/heatmap.js
type: application/javascript
module-type: echarts-component
Calendar Heatmap for Fishing.
\*/
exports.shouldUpdate = "[{$:/temp/fishing!!year}]";

exports.onUpdate = function (myChart) {
    var heatmapLan = $tw.wiki.filterTiddlers("[{$:/language}removeprefix[$:/]addprefix[$:/plugins/oflg/fishing-analysis/]getindex[heatmap]]~[[$:/plugins/oflg/fishing-analysis/languages/en-GB]getindex[heatmap]]")[0],
        dueLan = $tw.wiki.filterTiddlers("[{$:/language}removeprefix[$:/]addprefix[$:/plugins/oflg/fishing-analysis/]getindex[due]]~[[$:/plugins/oflg/fishing-analysis/languages/en-GB]getindex[due]]")[0],
        reviewLan = $tw.wiki.filterTiddlers("[{$:/language}removeprefix[$:/]addprefix[$:/plugins/oflg/fishing-analysis/]getindex[review]]~[[$:/plugins/oflg/fishing-analysis/languages/en-GB]getindex[review]]")[0],
        year1stLan = $tw.wiki.filterTiddlers("[{$:/language}removeprefix[$:/]addprefix[$:/plugins/oflg/fishing-analysis/]getindex[year1st]]~[[$:/plugins/oflg/fishing-analysis/languages/en-GB]getindex[year1st]]")[0],
        year2stLan = $tw.wiki.filterTiddlers("[{$:/language}removeprefix[$:/]addprefix[$:/plugins/oflg/fishing-analysis/]getindex[year2st]]~[[$:/plugins/oflg/fishing-analysis/languages/en-GB]getindex[year2st]]")[0];

    var year = Number($tw.wiki.filterTiddlers("[{$:/temp/fishing!!year}]")[0]) || new Date().getFullYear();

    var fishArry = $tw.wiki.filterTiddlers("[has[due]][has[history]]");

    var dueDayArry = [];
    var reviewDayArry = [];

    function twTime2twDayArry(twTime, dayArry) {
        var day = $tw.wiki.filterTiddlers("[[" + twTime + "]format:date[YYYY-0MM-0DD]]")[0];

        var dayIndex = (dayArry).findIndex((df) => df[0] == day);

        if (dayIndex == -1) {
            dayArry.push([
                day,
                1
            ]);

        } else {
            dayArry.splice(dayIndex, 1, [
                day,
                dayArry[dayIndex][1] + 1
            ]);
        }
    }

    for (var f = 0; f < fishArry.length; f++) {

        var fishDue = $tw.wiki.filterTiddlers("[{" + fishArry[f] + "!!due}]")[0],
            fishReview = $tw.wiki.filterTiddlers("[{" + fishArry[f] + "!!review}]")[0],
            fishHistoryArry = JSON.parse($tw.wiki.filterTiddlers("[{" + fishArry[f] + "!!history}]")[0] || "[]");

        if (fishDue) {
            twTime2twDayArry(fishDue, dueDayArry);
        }

        if (fishReview) {
            twTime2twDayArry(fishReview, reviewDayArry);
        }

        if (fishHistoryArry.length > 0) {

            for (var h = 0; h < fishHistoryArry.length; h++) {
                var historyReview = fishHistoryArry[h].review;

                twTime2twDayArry(historyReview, reviewDayArry);
            }

        }
    }

    var option = {
        title: {
            top: 0,
            text: year,
            subtext: heatmapLan,
            left: "center",
            textStyle: {
                color: ""
            }
        },
        tooltip: {
            trigger: "item"
        },
        legend: {
            top: "50",
            left: "center",
            data: [reviewLan, dueLan],
            textStyle: {
                color: ""
            }
        },
        calendar: [
            {
                top: 100,
                left: "center",
                range: [year + "-01-01", year + "-06-30"],
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: "#000",
                        width: 4,
                        type: "solid"
                    }
                },
                yearLabel: {
                    formatter: year1stLan
                },
                itemStyle: {
                    color: "#323c48",
                    borderWidth: 1,
                    borderColor: "#111"
                }
            },
            {
                top: 280,
                left: "center",
                range: [year + "-07-01", year + "-12-31"],
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: "#000",
                        width: 4,
                        type: "solid"
                    }
                },
                yearLabel: {
                    formatter: year2stLan
                },
                itemStyle: {
                    color: "#323c48",
                    borderWidth: 1,
                    borderColor: "#111"
                }
            }
        ],
        series: [
            {
                name: reviewLan,
                type: "scatter",
                coordinateSystem: "calendar",
                data: reviewDayArry,
                symbolSize: function (val) {
                    return val[1] <= 20 ? val[1] : 20;
                },
                itemStyle: {
                    color: "#ddb926"
                }
            },
            {
                name: reviewLan,
                type: "scatter",
                coordinateSystem: "calendar",
                calendarIndex: 1,
                data: reviewDayArry,
                symbolSize: function (val) {
                    return val[1] <= 20 ? val[1] : 20;
                },
                itemStyle: {
                    color: "#ddb926"
                }
            },
            {
                name: dueLan,
                type: "effectScatter",
                coordinateSystem: "calendar",
                calendarIndex: 1,
                data: dueDayArry,
                symbolSize: function (val) {
                    return val[1] <= 20 ? val[1] : 20;
                },
                showEffectOn: "render",
                rippleEffect: {
                    brushType: "stroke"
                },
                itemStyle: {
                    color: "#f4e925",
                    shadowBlur: 10,
                    shadowColor: "#333"
                },
                zlevel: 1
            },
            {
                name: dueLan,
                type: "effectScatter",
                coordinateSystem: "calendar",
                data: dueDayArry,
                symbolSize: function (val) {
                    return val[1] <= 20 ? val[1] : 20;
                },
                showEffectOn: "render",
                rippleEffect: {
                    brushType: "stroke"
                },
                itemStyle: {
                    color: "#f4e925",
                    shadowBlur: 10,
                    shadowColor: "#333"
                },
                zlevel: 1
            }
        ]
    };

    option && myChart.setOption(option);

};