/*\
title: $:/plugins/oflg/fishing-analysis/type/type.js
type: application/javascript
module-type: echarts-component
Tiddler type for Fishing.
\*/
exports.shouldUpdate = "[{$:/temp/fishing!!year}]";

exports.onUpdate = function (myChart) {
    var typeLan = $tw.wiki.filterTiddlers("[{$:/language}removeprefix[$:/]addprefix[$:/plugins/oflg/fishing-analysis/]getindex[type]]~[[$:/plugins/oflg/fishing-analysis/languages/en-GB]getindex[type]]")[0],
        excerptLan = $tw.wiki.filterTiddlers("[{$:/language}removeprefix[$:/]addprefix[$:/plugins/oflg/fishing-analysis/]getindex[excerpt]]~[[$:/plugins/oflg/fishing-analysis/languages/en-GB]getindex[excerpt]]")[0],
        questionLan = $tw.wiki.filterTiddlers("[{$:/language}removeprefix[$:/]addprefix[$:/plugins/oflg/fishing-analysis/]getindex[question]]~[[$:/plugins/oflg/fishing-analysis/languages/en-GB]getindex[question]]")[0],
        clozeLan = $tw.wiki.filterTiddlers("[{$:/language}removeprefix[$:/]addprefix[$:/plugins/oflg/fishing-analysis/]getindex[cloze]]~[[$:/plugins/oflg/fishing-analysis/languages/en-GB]getindex[cloze]]")[0],
        selectLan = $tw.wiki.filterTiddlers("[{$:/language}removeprefix[$:/]addprefix[$:/plugins/oflg/fishing-analysis/]getindex[select]]~[[$:/plugins/oflg/fishing-analysis/languages/en-GB]getindex[select]]")[0];

    var typeData = [
        { value: $tw.wiki.filterTiddlers("[all[tiddlers+shadows]has[due]search:caption:literal,casesensitive[Excerpt}}]count[]]")[0], name: excerptLan },
        { value: $tw.wiki.filterTiddlers("[all[tiddlers+shadows]has[due]search:caption:literal,casesensitive[Question}}]count[]]")[0], name: questionLan },
        { value: $tw.wiki.filterTiddlers("[all[tiddlers+shadows]has[due]search:caption:literal,casesensitive[Cloze}}]count[]]")[0], name: clozeLan },
        { value: $tw.wiki.filterTiddlers("[all[tiddlers+shadows]has[due]search:caption:literal,casesensitive[Select}}]count[]]")[0], name: selectLan }
    ]


    var option = {
        tooltip: {
            trigger: "item",
            formatter: "{b} : {c} ({d}%)"
        },
        legend: {
            left: "center"
        },
        toolbox: {
            show: true,
            orient: "vertical",
            itemSize: 8,
            feature: {
                mark: { show: true },
                restore: { show: true },
                saveAsImage: {
                    show: true,
                    name: typeLan
                }
            }
        },
        series: [
            {
                type: "pie",
                width: "80%",
                radius: ["20", "100"],
                roseType: "radius",
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 5
                },
                label: {
                    show: false,
                    position: "center"
                },
                emphasis: {
                    label: {
                        show: false,
                        fontSize: "20",
                        fontWeight: "bold"
                    }
                },
                labelLine: {
                    show: false
                },
                data: typeData
            }
        ]
    };

    option && myChart.setOption(option);

};