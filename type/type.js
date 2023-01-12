/*\
Tiddler type for Fishing.
\*/
exports.shouldUpdate = "[{$:/temp/fishing}]";

exports.onUpdate = function (myChart) {
    var excerptLan = $tw.wiki.filterTiddlers("[{$:/language/fishing-analysis/excerpt}]")[0],
        typeLan = $tw.wiki.filterTiddlers("[{$:/language/fishing-analysis/type}]")[0],
        questionLan = $tw.wiki.filterTiddlers("[{$:/language/fishing-analysis/question}]")[0],
        clozeLan = $tw.wiki.filterTiddlers("[{$:/language/fishing-analysis/cloze}]")[0],
        selectLan = $tw.wiki.filterTiddlers("[{$:/language/fishing-analysis/select}]")[0],
        wordLan = $tw.wiki.filterTiddlers("[{$:/language/fishing-analysis/word}]")[0],
        otherLan = $tw.wiki.filterTiddlers("[{$:/language/fishing-analysis/other}]")[0];

    var excerptFilter = "[has[?]search:caption:literal,casesensitive[Excerpt}}]count[]]",
        questionFilter = "[tag[?]search:caption:literal,casesensitive[Question}}]count[]]",
        clozeFilter = "[tag[?]search:caption:literal,casesensitive[Cloze}}]count[]]",
        selectFilter = "[tag[?]search:caption:literal,casesensitive[Select}}]count[]]",
        wordFilter = "[tag[?]search:caption:literal,casesensitive[Word}}]count[]]",
        otherFilter = "[tag[?]!search:caption:literal,casesensitive[Excerpt}}]!search:caption:literal,casesensitive[Question}}]!search:caption:literal,casesensitive[Cloze}}]!search:caption:literal,casesensitive[Select}}]!search:caption:literal,casesensitive[Word}}]count[]]";

    var typeData = [
        { value: $tw.wiki.filterTiddlers(excerptFilter)[0], name: excerptLan, filter: excerptFilter.replace(/count\[\]/g, "") },
        { value: $tw.wiki.filterTiddlers(questionFilter)[0], name: questionLan, filter: questionFilter.replace(/count\[\]/g, "") },
        { value: $tw.wiki.filterTiddlers(clozeFilter)[0], name: clozeLan, filter: clozeFilter.replace(/count\[\]/g, "") },
        { value: $tw.wiki.filterTiddlers(selectFilter)[0], name: selectLan, filter: selectFilter.replace(/count\[\]/g, "") },
        { value: $tw.wiki.filterTiddlers(wordFilter)[0], name: wordLan, filter: wordFilter.replace(/count\[\]/g, "") },
        { value: $tw.wiki.filterTiddlers(otherFilter)[0], name: otherLan, filter: otherFilter.replace(/count\[\]/g, "") }
    ];


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

    myChart.on('click', 'series', function (params) {

        console.log(params.data.filter);

        var filter = params.data.filter;

        $tw.rootWidget.invokeActionString('<$action-setfield $tiddler="$:/temp/advancedsearch" text="""' + filter + '"""/><$action-setfield $tiddler="$:/temp/advancedsearch/input" text="""' + filter + '"""/><$action-setfield $tiddler="$:/temp/advancedsearch/refresh" text="yes"/><$action-setfield $tiddler="$:/state/tab--1498284803" text="$:/core/ui/AdvancedSearch/Filter"/>');

        new $tw.Story().navigateTiddler("$:/AdvancedSearch");

    });
};