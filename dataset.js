var countryData = []
$.ajax({
    async: false,
    url: 'https://corona.lmao.ninja/v2/countries',
    dataType: 'json',
    cache: false,
    success: function (data, status) {
        $.each(data, function (index) {
            countryData[index] = {}
            countryData[index]["code"] = data[index].countryInfo.iso2;
            countryData[index]["name"] = data[index].country;
            countryData[index]["cases"] = data[index].cases;
            countryData[index]["deaths"] = data[index].deaths;
            countryData[index]["recoveries"] = data[index].recovered;
        })
    },
    error: function (xhr, textStatus, err) {
        console.log(xhr);
        console.log(textStatus);
        console.log(err);
    }

})
var cityData = [
    { "code": "wuhan", "name": "Wuhan", "country": "CN", "cases": "50006", "deaths": "2547", "recoveries": "45733", "populations": "11081000", "latitude": "30.58333", "longitude": "114.26667" },
    { "code": "nycit", "name": "New York City", "country": "US", "cases": "43139", "deaths": "0", "recoveries": "0", "populations": "8398748", "latitude": "40.71278", "longitude": "-74.00597" },
    { "code": "lomba", "name": "Lombardia", "country": "IT", "cases": "43208", "deaths": "7199", "recoveries": "10885", "populations": "10078012", "latitude": "45.47907", "longitude": "9.84524" },
    { "code": "madri", "name": "Madrid", "country": "ES", "cases": "27509", "deaths": "3603", "recoveries": "9330", "populations": "6661949", "latitude": "40.41678", "longitude": "-3.70379" }
];
function groupAreas(objectArray, property) {
    return objectArray.reduce(function (acc, obj) {
        var key = obj['code']
        if (!acc[key]) {
            acc[key] = {}
        }
        acc[key].value = obj[property]
        acc[key].attrs = { "href": "#" }
        acc[key].tooltip = { "content": "<strong>" + obj['name'] + "</strong><br />Confirmed cases : " + obj['cases'] + "<br />Deaths : " + obj['deaths'] + "<br />Recoveries : " + obj['recoveries'] }
        return acc
    }, {})
}

var caseCountryAreas = groupAreas(countryData, 'cases');
var deathCountryAreas = groupAreas(countryData, 'deaths');
var recoveryCountryAreas = groupAreas(countryData, 'recoveries');

// Plots or cities
function groupPlots(objectArray, property) {
    return objectArray.reduce(function (acc, obj) {
        var key = obj['code']
        if (!acc[key]) {
            acc[key] = {}
        }
        acc[key].latitude = obj['latitude']
        acc[key].longitude = obj['longitude']
        acc[key].value = obj[property]
        acc[key].attrs = { "href": "#" }
        acc[key].tooltip = { "content": "<strong>" + obj['name'] + "</strong><br />Confirmed cases : " + obj['cases'] + "<br />Deaths : " + obj['deaths'] + "<br />Recoveries : " + obj['recoveries'] }
        return acc
    }, {})
}

var caseCityPlots = groupPlots(cityData, 'cases');
var deathCityPlots = groupPlots(cityData, 'deaths');
var recoveryCityPlots = groupPlots(cityData, 'recoveries');

// VMap plugin
function groupVMap(objectArray, property) {
    return objectArray.reduce(function (acc, obj) {
        var key = obj['code'].toLowerCase()
        if (!acc[key]) {
            acc[key] = obj[property]
        }
        return acc
    }, {})
}

// VMap regions
function groupVMapRegion(objectArray, property, countryId) {
    return objectArray.reduce(function (acc, obj) {
        if (obj['country'] == countryId) {
            var key = obj['code']
            if (!acc[key]) {
                acc[key] = obj[property]
            }
        }
        return acc
    }, {})
}

// Legend area for confirmed cases by country
var caseLegendAreaColors = [
    {
        min: 100000,
        attrs: {
            fill: "#300000"
        },
        label: "100,000+ confirmed cases"
    },
    {
        min: 10000,
        max: 99999,
        attrs: {
            fill: "#510000"
        },
        label: "10,000-9,9999 confirmed cases"
    },
    {
        min: 1000,
        max: 9999,
        attrs: {
            fill: "#900000"
        },
        label: "1,000–9,999 confirmed cases"
    },
    {
        min: 100,
        max: 999,
        attrs: {
            fill: "#c80200"
        },
        label: "100–999 confirmed cases"
    },
    {
        min: 10,
        max: 99,
        attrs: {
            fill: "#ee7070"
        },
        label: "10–99 confirmed cases"
    },
    {
        min: 1,
        max: 9,
        attrs: {
            fill: "#ffC0C0"
        },
        label: "1–9 confirmed cases"
    },
    {
        max: 0,
        attrs: {
            fill: "#eeeeee"
        },
        label: "No confirmed cases or no data"
    }
]

// Legend area for deaths by country
var deathLegendAreaColors = [
    {
        min: 100000,
        attrs: {
            fill: "#980043"
        },
        label: "100,000+ deaths"
    },
    {
        min: 10000,
        max: 99999,
        attrs: {
            fill: "#dd1c77"
        },
        label: "10,000-9,9999 deaths"
    },
    {
        min: 1000,
        max: 9999,
        attrs: {
            fill: "#df65b0"
        },
        label: "1,000–9,999 deaths"
    },
    {
        min: 100,
        max: 999,
        attrs: {
            fill: "#c994c7"
        },
        label: "100–999 deaths"
    },
    {
        min: 10,
        max: 99,
        attrs: {
            fill: "#d4b9da"
        },
        label: "10–99 deaths"
    },
    {
        min: 1,
        max: 9,
        attrs: {
            fill: "#d1d0e6"
        },
        label: "1–9 deaths"
    },
    {
        max: 0,
        attrs: {
            fill: "#e0e0e0"
        },
        label: "No deaths or no data"
    }
]

// Legend area for recoveries by country
var recoveryLegendAreaColors = [
    {
        min: 100000,
        attrs: {
            fill: "#13540d"
        },
        label: "100,000+ recoveries"
    },
    {
        min: 10000,
        max: 99999,
        attrs: {
            fill: "#219217"
        },
        label: "10,000-9,9999 recoveries"
    },
    {
        min: 1000,
        max: 9999,
        attrs: {
            fill: "#3edf30"
        },
        label: "1,000–9,999 recoveries"
    },
    {
        min: 100,
        max: 999,
        attrs: {
            fill: "#80ea76"
        },
        label: "100–999 recoveries"
    },
    {
        min: 10,
        max: 99,
        attrs: {
            fill: "#a9f1a2"
        },
        label: "10–99 recoveries"
    },
    {
        min: 1,
        max: 9,
        attrs: {
            fill: "#caf6c6"
        },
        label: "1–9 recoveries"
    },
    {
        max: 0,
        attrs: {
            fill: "#eafce9"
        },
        label: "No recoveries or no data"
    }
]

// Legend plot for confirmed cases by region/division
var caseLegendPlotColors = [
    {
        max: 499,
        attrs: {
            fill: "#f99200"
        },
        attrsHover: {
            transform: "s1.5",
            "stroke-width": 1
        },
        label: "less than 500 confirmed cases",
        size: 10
    },
    {
        min: 500,
        max: 9999,
        attrs: {
            fill: "#f99200"
        },
        attrsHover: {
            transform: "s1.5",
            "stroke-width": 1
        },
        label: "Between 500 and 9,999 confirmed cases",
        size: 20
    },
    {
        min: 10000,
        attrs: {
            fill: "#f99200"
        },
        attrsHover: {
            transform: "s1.5",
            "stroke-width": 1
        },
        label: "More than 10,000 confirmed cases",
        size: 30
    }
]

// Legend plot for deaths by region/division
var deathLegendPlotColors = [
    {
        max: 499,
        attrs: {
            fill: "#ba491c"
        },
        attrsHover: {
            transform: "s1.5",
            "stroke-width": 1
        },
        label: "less than 500 deaths",
        size: 10
    },
    {
        min: 500,
        max: 9999,
        attrs: {
            fill: "#ba491c"
        },
        attrsHover: {
            transform: "s1.5",
            "stroke-width": 1
        },
        label: "Between 500 and 9,999 deaths",
        size: 20
    },
    {
        min: 10000,
        attrs: {
            fill: "#ba491c"
        },
        attrsHover: {
            transform: "s1.5",
            "stroke-width": 1
        },
        label: "More than 10,000 deaths",
        size: 30
    }
]

// Legend plot for recoveries by region/division
var recoveryLegendPlotColors = [
    {
        max: 499,
        attrs: {
            fill: "#2579b5"
        },
        attrsHover: {
            transform: "s1.5",
            "stroke-width": 1
        },
        label: "less than 500 recoveries",
        size: 10
    },
    {
        min: 500,
        max: 9999,
        attrs: {
            fill: "#2579b5"
        },
        attrsHover: {
            transform: "s1.5",
            "stroke-width": 1
        },
        label: "Between 500 and 9,999 recoveries",
        size: 20
    },
    {
        min: 10000,
        attrs: {
            fill: "#2579b5"
        },
        attrsHover: {
            transform: "s1.5",
            "stroke-width": 1
        },
        label: "More than 10,000 recoveries",
        size: 30
    }
]