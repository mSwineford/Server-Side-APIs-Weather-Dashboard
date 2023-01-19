var List =$("#list");
var cities = [];
var key = "41d7cbff5ce6dfafd73be76ef164cb7e";

function FormatDate(date) {
    var dates = new Date();
    console.log(dates);
    var month = dates.getMonth()+1;
    var day = dates.getDate();

    var daysResult = dates.getFullYear() + "/" + (month<10 ? "0" : "") + month + "/" + (day<10 ? "0" : "") + day;

    return daysResult;
}

init();

function init() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    if (storedCities !== null) {
        cities = storedCities;
    }
    renderCities();
}

function saveCities() {
    localStorage.setItem("cities", JSON.stringify(cities));
    console.log(localStorage);
}

function renderCities() {
    List.empty();
    for (var i =0; i < cities.length; i++) {
        var city = cities[i];
        var addList = $("<li>").text(city);
        addList.attr("id","listCity");
        addList.attr("data-city", city);
        addList.attr("class", "list-group-item");
        console.log(addList);
        List.prepend(addList);
    }
    if (!city) {
        return;
    } else {
        getWeather(city)
    };
}

$("#add-city").on("click", function(event) {
    event.preventDefault();
    var city = $("#input").val().trim();

    if (city === "") {
        return;
    }
    cities.push(city);
    saveCities();
    renderCities();
});

function getWeather(cityArea) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +cityArea+ "&appid=" +key;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {

        cityName = $("<h2>").text(response.name + " " + FormatDate());
        $("#current-weather").append(cityName);

        var TempValue = parseInt((response.main.temp)* 9/5 -459);
        var cityTemp = $("<div>").text("Temp: " + TempValue + " F");
        $("#current-weather").append(cityTemp);

        var cityHumid = $("<div>").text("Humidity: " + response.main.humidity + " %");
        $("#current-Weather").append(cityHumid);

        var cityWind = $("<div>").text("Wind Speed: " + response.wind.speed + " MPH");
        $("#current-weather").append(cityWind);

        var Lat = response.coord.lat;
        var Lon = response.coord.lon;

        var queryURL2 = "https://api.openweathermap.org/data/2.5/uvi?appid=" + key + "&lat=" + Lat + "&lon=" + Lon;
        $.ajax({
            url: queryURL2,
            method: "GET"
        }).then(function(uvIndex) {
            var divUV = $("<div>").text(uvIndex.value);
            var pUV = $("<p>").text("UV Index: ");

            pUV.append(divUV);

            $("#current-weather").append(divUV);
            console.log(typeof uvIndex.value);

            if(uvIndex.value > 0 && uvIndex.value <=2) {
                divUV.attr("class", "blue")
            }  else if (uvIndex.value > 2 && uvIndex.value <=5 ) {
                divUV.attr("class", "green")
            } else if (uvIndex.value > 5 && uvIndex.value <= 7 ) {
                divUV.attr("class","yellow")
            } else if (uvIndex.value > 7 && uvIndex.value <=10) {
                divUV.attr("class","red")
            } else {
                divUV.attr("class","black");
            }
        })
    });
    var queryForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityArea + "&appid=" + key;
        $.ajax({
            url: queryForecast,
            method: "GET"
        }).then(function(fiveDays) {
            $("#boxes").empty();
            console.log(fiveDays);
            for (var i=0, x=0; x<=5; i=i+6) {
                var listedDate = fiveDays.list[i].dt;
                if(fiveDays.list[i].dt != fiveDays.list[i+1].dt) {
                    var forecastDiv =$("<div>");
                    forecastDiv.attr("class", "col-3 m-2")
                    var newDay = new Date(0);
                    newDay.setUTCSeconds(listedDate);
                    var dates = newDay;
                    console.log(dates);
                    var month = dates.getMonth()+1;
                    var day = dates.getDate();
                    var daysResult = dates.getFullYear() + "/" + (month<10 ? "0" : "") + month + "/" + (day<10 ? "0" : "") + day;
                    var weekWeather = $("<h3>").text(daysResult);

                    var currentTemp = fiveDays.list[i].main.temp;
                    var TempValue = parseInt((currentTemp) *  9/5 -459);
                    var cityTemp = $("<div>").text("Temp: " + TempValue + " F");
                    var cityHumid = $("<div>").text("Humidity: " + fiveDays.list[i].main.humidity + " %");
                    forecastDiv.append(weekWeather);
                    forecastDiv.append(cityHumid);
                    forecastDiv.append(cityTemp);
                    $("#boxes").append(forecastDiv);
                    x++;

                }
            }
        });
}

                    $(document).on("click", "#listCity", function() {
                        var currentCity = $(this).attr("data-city");
                        getWeather(currentCity);
                    });