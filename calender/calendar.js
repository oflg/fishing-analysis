/*\
title: $:/plugins/oflg/fishing-analysis/calendar/calendar.js
type: application/javascript
module-type: echarts-component
Calendar for Fishing.
\*/
exports.shouldUpdate = "[{$:/temp/fishing!!list}]";

exports.onUpdate = function (myChart) {
    var calendarLan = $tw.wiki.filterTiddlers("[{$:/language/fishing/calendar}]")[0],
        reviewLan = $tw.wiki.filterTiddlers("[{$:/language/fishing/review}]")[0],
        dueLan = $tw.wiki.filterTiddlers("[{$:/language/fishing/due}]")[0],
        undueLan = $tw.wiki.filterTiddlers("[{$:/language/fishing/undue}]")[0],
        year1stLan = $tw.wiki.filterTiddlers("[{$:/language/fishing/year1st}]")[0],
        year2stLan = $tw.wiki.filterTiddlers("[{$:/language/fishing/year2st}]")[0];

    var year = Number($tw.wiki.filterTiddlers("[{$:/temp/fishing!!year}]")[0]) || new Date().getFullYear();

    var fishArry = $tw.wiki.filterTiddlers("[has[due]][has[history]]");

    var reviewDayArry = [],
        dueDayArry = [],
        undueDayArry = [];

    var nowDay = new Date().toISOString().split("T")[0].replace(/-/g, "");

    function twTime2twDayArry(twTime, dayArry) {
        var day = $tw.wiki.filterTiddlers("[[" + twTime + "]format:date[YYYY-0MM-0DD]]")[0];

        var dayIndex = dayArry.findIndex(function (df) {
            return df[0] == day;
        });

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

    function getJson(jsonString) {
        jsonString = jsonString || "[]";
        var result = [];
        try {
            result = JSON.parse(jsonString);
        } catch (error) {
            console.log("JSON error : " + error);
            console.log(jsonString);
        }
        return result;
    }

    for (var f = 0; f < fishArry.length; f++) {

        var fishData = $tw.wiki.getTiddler(fishArry[f]);

        var twTime = fishData.fields["due"],
            twReview = fishData.fields["review"],
            fishHistoryArry = getJson(fishData.fields["history"]);

        var twDue = $tw.wiki.filterTiddlers("[[" + twTime + "]compare:date:lteq[" + nowDay + "]]")[0],
            twUndue = $tw.wiki.filterTiddlers("[[" + twTime + "]compare:date:gt[" + nowDay + "]]")[0];

        if (twReview) {
            twTime2twDayArry(twReview, reviewDayArry);
        }

        if (twDue) {
            twTime2twDayArry(twDue, dueDayArry);
        }

        if (twUndue) {
            twTime2twDayArry(twUndue, undueDayArry);
        }

        if (fishHistoryArry.length > 0) {

            for (var h = 0; h < fishHistoryArry.length; h++) {
                var historyReview = fishHistoryArry[h].review;

                twTime2twDayArry(historyReview, reviewDayArry);
            }

        }
    }

    var option = {
        tooltip: {
            trigger: "item",
            formatter: '{a}<br>{c}'
        },
        toolbox: {
            show: true,
            orient: "herizontal",
            itemSize: 8,
            feature: {
                mark: { show: true },
                restore: { show: true },
                saveAsImage: {
                    show: true,
                    name: calendarLan
                }
            }
        },
        legend: {
            top: "0",
            height: "10%",
            left: "center",
            data: [reviewLan, dueLan, undueLan],
            textStyle: {
                color: ""
            }
        },
        calendar: [
            {
                top: "15%",
                left: "center",
                width: "80%",
                height: "35%",
                range: [year + "-01-01", year + "-06-30"],
                splitLine: {
                    show: true,
                    lineStyle: {
                        // color: "#000",
                        width: 1,
                        type: "solid"
                    }
                },
                yearLabel: {
                    formatter: year1stLan
                },
                itemStyle: {
                    // color: "#323c48",
                    borderWidth: 1,
                    // borderColor: "#111"
                }
            },
            {
                top: "60%",
                left: "center",
                width: "80%",
                height: "35%",
                range: [year + "-07-01", year + "-12-31"],
                splitLine: {
                    show: true,
                    lineStyle: {
                        // color: "#000",
                        width: 1,
                        type: "solid"
                    }
                },
                yearLabel: {
                    formatter: year2stLan
                },
                itemStyle: {
                    // color: "#323c48",
                    borderWidth: 1,
                    // borderColor: "#111"
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
                    return val[1] <= 20 ? val[1] / 2 : 10;
                },
                itemStyle: {
                    opacity: 0.8,
                    color: "#547599"
                }
            },
            {
                name: reviewLan,
                type: "scatter",
                coordinateSystem: "calendar",
                calendarIndex: 1,
                data: reviewDayArry,
                symbolSize: function (val) {
                    return val[1] <= 20 ? val[1] / 2 : 10;
                },
                itemStyle: {
                    opacity: 0.8,
                    color: "#547599"
                }
            },
            {
                name: dueLan,
                type: "effectScatter",
                coordinateSystem: "calendar",
                data: dueDayArry,
                symbolSize: function (val) {
                    return val[1] <= 20 ? val[1] / 2 : 10;
                },
                showEffectOn: "render",
                rippleEffect: {
                    brushType: "stroke"
                },
                itemStyle: {
                    opacity: 0.8,
                    color: "#ff0000",
                    shadowBlur: 10,
                    shadowColor: "#333"
                },
                zlevel: 1
            },
            {
                name: dueLan,
                type: "effectScatter",
                coordinateSystem: "calendar",
                calendarIndex: 1,
                data: dueDayArry,
                symbolSize: function (val) {
                    return val[1] <= 20 ? val[1] / 2 : 10;
                },
                showEffectOn: "render",
                rippleEffect: {
                    brushType: "stroke"
                },
                itemStyle: {
                    opacity: 0.8,
                    color: "#ff0000",
                    shadowBlur: 10,
                    shadowColor: "#333"
                },
                zlevel: 1
            },
            {
                name: undueLan,
                type: "effectScatter",
                coordinateSystem: "calendar",
                data: undueDayArry,
                symbolSize: function (val) {
                    return val[1] <= 20 ? val[1] / 2 : 10;
                },
                showEffectOn: "render",
                rippleEffect: {
                    brushType: "stroke"
                },
                itemStyle: {
                    opacity: 0.8,
                    color: "#5778d8",
                    shadowBlur: 10,
                    shadowColor: "#333"
                },
                zlevel: 1
            },
            {
                name: undueLan,
                type: "effectScatter",
                coordinateSystem: "calendar",
                calendarIndex: 1,
                data: undueDayArry,
                symbolSize: function (val) {
                    return val[1] <= 20 ? val[1] / 2 : 10;
                },
                showEffectOn: "render",
                rippleEffect: {
                    brushType: "stroke"
                },
                itemStyle: {
                    opacity: 0.8,
                    color: "#5778d8",
                    shadowBlur: 10,
                    shadowColor: "#333"
                },
                zlevel: 1
            }
        ]
    };

    option && myChart.setOption(option);

    myChart.on('click', 'series', function (params) {

        if (params.seriesName == dueLan || params.seriesName == undueLan) {

            var day = params.data[0].replace(/\-/g, '');

            var filter = "[sameday:due[" + day + "]]";

            $tw.rootWidget.invokeActionString('<$action-setfield $tiddler="$:/temp/advancedsearch" text="""' + filter + '"""/><$action-setfield $tiddler="$:/temp/advancedsearch/input" text="""' + filter + '"""/><$action-setfield $tiddler="$:/temp/advancedsearch/refresh" text="yes"/><$action-setfield $tiddler="$:/state/tab--1498284803" text="$:/core/ui/AdvancedSearch/Filter"/>');

            new $tw.Story().navigateTiddler("$:/AdvancedSearch");
        }

    });
};