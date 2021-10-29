const appid = "674c8b0e05a9900603ca7a7d133ac963";

const today = document.getElementById("today");
const five_days = document.getElementById("five_days");

const weather_today = document.getElementById("weather_today");
const weather_5days = document.getElementById("weather_5days");

weather_5days.style.setProperty("display", "none");
today.style.setProperty("background-color", "slateblue");

var city = document.getElementById('input_city').value;
console.log("Місто по замовчуванню " + city);


function convertTemperature(value) {
    let temp = Math.round(value - 273,15);
    if (temp > 0) {
        temp = "+" + temp + "<span>&deg;</span>";
    }else {
        temp = temp + "<span>&deg;</span>";   
    }     
    return temp;
}

function convertPressure(value) {
    return Math.round(value/1.33);
}

//Запит погоди на сьогодні по кнопці "Пошук"
document.getElementById("find_city").addEventListener("click", () => {
    city = document.getElementById('input_city').value;
    
    today.style.setProperty("background-color", "slateblue");
    five_days.style.setProperty("background-color", "white");
    weather_5days.style.setProperty("display", "none");
    weather_today.style.setProperty("display", "block");
    const xhr = new XMLHttpRequest;
    xhr.addEventListener("readystatechange", () => {
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                const Json = xhr.responseText;
                const data= JSON.parse(Json);
                console.log(data);

                const city_name = document.getElementById("city_name");
                city_name.textContent = city;
                
                const temperature = document.getElementById("temperature");
                temperature.innerHTML = convertTemperature(data.main.temp);    

                const feels_like = document.getElementById("feels_like");
                feels_like.innerHTML = convertTemperature(data.main.feels_like);     

                const pressure = document.getElementById("pressure");
                pressure.textContent = convertPressure(data.main.pressure);

                const humidity = document.getElementById("humidity");
                humidity.textContent = data.main.humidity;

                const wind = document.getElementById("wind");
                wind.textContent = Math.round(data.wind.speed);

                const iconImage = document.getElementsByTagName("img")[0];
                iconImage.src = "http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png"

            }else {    
            console.log(xhr.statusText);
            }
        }
    });

    xhr.open("GET", `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${appid}`);
    xhr.send();

    //Запит погоди на 5 днів по кнопці "5 днів"
    five_days.addEventListener("click", () => {
        console.log("Тепер погода на 5 днів!!!");
        
        weather_5days.style.setProperty("display", "flex");
        weather_today.style.setProperty("display", "none");
        today.style.setProperty("background-color", "white");
        five_days.style.setProperty("background-color", "slateblue");

        const xhr5 = new XMLHttpRequest;
        xhr5.addEventListener("readystatechange", () => {
            if(xhr5.readyState === 4){
                if(xhr5.status === 200){
                    const Json5 = xhr5.responseText;
                    const data5= JSON.parse(Json5);
                    console.log(data5);

                    const pressure_every3hours = document.getElementById("pressure_every3hours");
                    

                   for (let i=0; i<40; i++){
                        const time_every3hours = document.getElementById(`time${i}`);
                        time_every3hours.textContent = data5.list[i].dt_txt.substr(0,16);
                        const temp_every3hours = document.getElementById(`temp${i}`);
                        temp_every3hours.innerHTML = convertTemperature(data5.list[i].main.temp);
                        const wind_every3hours = document.getElementById(`wind${i}`);
                        wind_every3hours.textContent = Math.round(data5.list[i].wind.speed) + " м/с";
                        
                        //Додаєм інформацію про атмосферний тиск
                        const pressure_item = document.createElement("div");
                        pressure_item.textContent = convertPressure(data5.list[i].main.pressure) + " мм.рт.ст.";
                        pressure_every3hours.appendChild(pressure_item);

                        //Додаєм іконки
                        
                        const iconImage = document.getElementById(`img${i}`);
                        iconImage.src = "http://openweathermap.org/img/wn/" + data5.list[i].weather[0].icon + ".png";
                   }    

                }else {    
                console.log(xhr5.statusText);
                }
            }
        });

        xhr5.open("GET", `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${appid}`);
        xhr5.send();

    });
});

//Переключення на сьогодні
today.addEventListener("click", () => {
    weather_5days.style.setProperty("display", "none");
    weather_today.style.setProperty("display", "block");
    today.style.setProperty("background-color", "slateblue");
    five_days.style.setProperty("background-color", "white"); 
});