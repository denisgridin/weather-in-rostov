var average = function(data, value, count, start){
    let average = 0;
    let state = [];
    for (let i = start; i <= start + count; i++){
        if (value == "temperature"){
            average += data.list[i].main.temp / count;
        }
        else if (value == "condition"){
            state.push(data.list[i].weather[0].main);
        }
    }
    if (state.length > 0){
        let max_times = 0;
        let popular = "";
        let k;
        for (let n = 0; n <= state.length; n++){
            k = 0;
            for (let m = 0; m <= state.length; m++){
                if (state[m] == state[n]){
                    k++;
                }
            }
            if (k > max_times){
                max_times = k;
                popular = state[n];
            }
        }
        return popular;
    }
    else if(value == "temperature"){
        return Math.round(average);
    }
}

var check_condition = function (data, n, condition_flag, icon_flag, average){
    if (typeof(n) == "number"){
        let amount = data.list[n].weather.length;
        for (let i = 0; i <= amount -1 ; i++){
            if (data.list[n].weather[i].main == 'Rain'){
                icon = "img/rain.svg";
                condition = "Дождь";
                break;
            }
            else if (data.list[n].weather[i].main == 'Drizzle'){
                icon = "img/rain_2.svg";
                condition = "Моросящий дождь";
                break;
            }
            else if (data.list[n].weather[i].main == 'Snow'){
                condition = "Снег";
                icon = "img/snow.svg";
                break;
            }
            else if (data.list[n].weather[i].main == 'Snow'){
                icon = "img/snow.svg";
                condition = "Снег";
                break;
            }
            else if (data.list[n].weather[i].main == 'Clouds'){
                icon = "img/cloud-1.svg";
                condition = "Облачно";
                break;
            }
            else if (data.list[n].weather[i].main == 'Clear'){
                icon = "img/sun.svg";
                condition = "Ясно";
                break;
            }
        }

    }

    else if (typeof(n) == "string"){
        if (average == 'Rain'){
            icon = "img/rain.svg";
        }
        else if (average == 'Drizzle'){
            icon = "img/rain_2.svg";
        }
        else if (average == 'Snow'){
            icon = "img/snow.svg";
        }
        else if (average == 'Snow'){
            icon = "img/snow.svg";
        }
        else if (average == 'Clouds'){
            icon = "img/cloud-1.svg";
        }
        else if (average == 'Clear'){
            icon = "img/sun.svg";
        }
    }

    if (condition_flag){
        return condition;
    }
    else if(icon_flag){
        return icon;
    }
}



var app = new Vue({
    el: "#weather",
    data: {
        main_temperature: "",
        main_condition: "",
        main_icon: "",

        temperature_1: "",
        temperature_2: "",
        temperature_3: "",

        icon: ["", "", ""],

    },
    methods: {
        get_current_weather: function(){
            let location = "501175";
            let appid = "70e1ed322b02acbc57d443dd91065f3e";
            fetch("http://api.openweathermap.org/data/2.5/forecast?id=" + location + "&APPID=" + appid + "&units=metric").then(result => {
                return result.json();
            }).then(result => {
                this.main_temperature = Math.round(result.list[0].main.temp);
                this.main_condition = check_condition(result, 0, 1, 0);
                this.main_icon = check_condition(result, 0, 0, 1);
                $("#main_icon").attr("src", this.main_icon);
            })
        },     

        get_weather_by_day: function(){
            let location = "501175";
            let appid = "70e1ed322b02acbc57d443dd91065f3e";
            fetch("http://api.openweathermap.org/data/2.5/forecast?id=" + location + "&APPID=" + appid + "&units=metric").then(result => {
                return result.json();
            }).then(result => {          
                let index = 0;
                for (let m = 0; m < 8; m++){
                    if ( result.list[m].dt_txt.substr(11, 19) == "00:00:00"){
                        index = m;
                    }
                }
                
                this.temperature_1 = average(result, "temperature", 8, index);
                this.temperature_2 = average(result, "temperature", 8, index + 8);
                this.temperature_3 = average(result, "temperature", 8, index + 16);
                for (let i = 0; i <= 2; i++){
                    
                    let condition = average(result, "condition", 8, index);
                    this.icon[i] = check_condition(result, "s", 0, 1, condition);
                    path = ".icon_" + (i + 1);
                    $(path).attr("src", this.icon[i]);    
                    index += 8;
                }
            })
        }
    }
})