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
