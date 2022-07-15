/*\
title: $:/plugins/oflg/fishing-analysis/calendar/calendar.js
type: application/javascript
module-type: echarts-component
Calendar for Fishing.
\*/

exports.shouldUpdate = "[{$:/temp/fishing!!year}]";

exports.onUpdate = function (myChart) {
    var year = Number($tw.wiki.filterTiddlers("[{$:/temp/fishing!!year}]")[0]) || new Date().getFullYear();

    var reviewDayArry = [],
        dueDayArry = [],
        undueDayArry = [];

    var reviewArry = $tw.wiki.filterTiddlers("[has[history]]"),
        dueArry = $tw.wiki.filterTiddlers("[subfilter{$:/config/fishingpond/duepond}]"),
        undueArry = $tw.wiki.filterTiddlers("[subfilter{$:/config/fishingpond/unduepond}]");

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

    function title2data(titleArry, dataArry) {

        for (var t = 0; t < titleArry.length; t++) {

            var dueTiddler = $tw.wiki.getTiddler(titleArry[t]);

            var dueTime = dueTiddler.fields["due"];

            if (dueTime && (dueTime.slice(0, 4) == year)) {
                twTime2twDayArry(dueTime, dataArry);
            }
        }
    }

    for (var r = 0; r < reviewArry.length; r++) {

        var reviewTiddler = $tw.wiki.getTiddler(reviewArry[r]);

        var reviewTime = reviewTiddler.fields["review"];

        if (reviewTime && (reviewTime.slice(0, 4) == year)) {
            twTime2twDayArry(reviewTime, reviewDayArry);
        }

        var historyArry = getJson(reviewTiddler.fields["history"]);

        if (historyArry.length > 0) {

            for (var h = 0; h < historyArry.length; h++) {

                var historyReviewTime = historyArry[h].review;

                if (historyReviewTime && (historyReviewTime.slice(0, 4) == year)) {
                    twTime2twDayArry(historyReviewTime, reviewDayArry);
                }
            }
        }
    }

    // history2data(reviewArry, reviewDayArry);
    title2data(dueArry, dueDayArry);
    title2data(undueArry, undueDayArry);

    var calendarLan = $tw.wiki.filterTiddlers("[{$:/language/fishing/calendar}]")[0],
        reviewLan = $tw.wiki.filterTiddlers("[{$:/language/fishing/review}]")[0],
        dueLan = $tw.wiki.filterTiddlers("[{$:/language/fishing/due}]")[0],
        undueLan = $tw.wiki.filterTiddlers("[{$:/language/fishing/undue}]")[0],
        year1stLan = $tw.wiki.filterTiddlers("[{$:/language/fishing/year1st}]")[0],
        year2stLan = $tw.wiki.filterTiddlers("[{$:/language/fishing/year2st}]")[0];

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
            data: [reviewLan, dueLan, undueLan]
        },
        visualMap: {
            seriesIndex: [0, 1],
            min: 0,
            max: 10,
            show: false,
            calculable: true,
            orient: 'vertical',
            top: 'center',
            inRange: {
                color: ['rgba(136,255,136,0)', '#8f8']
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
                        width: 1,
                        type: "solid"
                    }
                },
                yearLabel: {
                    formatter: year1stLan
                },
                itemStyle: {
                    borderWidth: 1,
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
                        width: 1,
                        type: "solid"
                    }
                },
                yearLabel: {
                    formatter: year2stLan
                },
                itemStyle: {
                    borderWidth: 1,
                }
            }
        ],
        series: [
            {
                name: reviewLan,
                type: "heatmap",
                coordinateSystem: "calendar",
                data: reviewDayArry,
                itemStyle: {
                    color: "#8f8"
                }
            },
            {
                name: reviewLan,
                type: "heatmap",
                coordinateSystem: "calendar",
                calendarIndex: 1,
                data: reviewDayArry,
                itemStyle: {
                    color: "#8f8"
                }
            },
            {
                name: dueLan,
                type: "scatter",
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
                    color: "#f88",
                    shadowBlur: 10,
                    shadowColor: "#333"
                },
                zlevel: 1
            },
            {
                name: dueLan,
                type: "scatter",
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
                    color: "#f88",
                    shadowBlur: 10,
                    shadowColor: "#333"
                },
                zlevel: 1
            },
            {
                name: undueLan,
                type: "scatter",
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
                    color: "#88f",
                    shadowBlur: 10,
                    shadowColor: "#333"
                },
                zlevel: 1
            },
            {
                name: undueLan,
                type: "scatter",
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
                    color: "#88f",
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