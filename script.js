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


