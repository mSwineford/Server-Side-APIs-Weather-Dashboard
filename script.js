const List =$("#list");
const cities = [];
const key = "41d7cbff5ce6dfafd73be76ef164cb7e";

function FormatDate(date) {
    const date = new Date();
    console.log(date);
    const month = date.getMonth()+1;
    const day = date.getDate();

    const daysResult = date.getFullYear() + "/" + (month<10 ? "0" : "") + month + "/" + (day<10 ? "0" : "") + day;

    return daysResult;
}

init();

function init() {
    const storedCities = JSON.parse(localStorage.getItem("cities"));
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
    for (const i =0; i < cities.length; i++) {
        const city = cities[i];
        const addList = $("<li>").text(city);
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
    const city = $("#input").val().trim();

    if (city === "") {
        return;
    }
    cities.push(city);
    saveCities();
    renderCities();
});

function getWeather(cityArea) {
    const queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +cityArea+ "&appid=" +key;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {

        cityName = $("<h2>").text(response.name + " " + FormatDate());
        $("#current-weather").append(cityName);

        const TempValue = parseInt((response.main.temp)* 9/5 -459);
        const cityTemp = $("<div>").text("Temp: " + TempValue + " F");
        $("#current-weather").append(cityTemp);

        const cityHumid = $("<div>").text("Humidity: " + response.main.humidity + " %");
        $("#current-Weather").append(cityHumid);

        const cityWind = $("<div>").text("Wind Speed: " + response.wind.speed + " MPH");
        $("#current-weather").append(cityWind);

        const Lat = response.coord.lat;
        const Lon = response.coord.lon;

        const queryURL2 = "https://api.openweathermap.org/data/2.5/uvi?appid=" + key + "&lat=" + Lat + "&lon=" + Lon;
        $.ajax({
            url: queryURL2,
            method: "GET"
        }).then(function(uvIndex) {
            const divUV = $("<div>").text(uvIndex.value);
            const pUV = $("<p>").text("UV Index: ");

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
    
}
