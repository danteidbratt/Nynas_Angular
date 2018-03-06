import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { UpdatableTable, WeatherData } from '../data';

@Injectable()
export class WeatherService {

  WEATHER_URL: string = 'https://api.openweathermap.org/data/2.5/forecast?q=nynashamn&APPID=32ba8562153281b2af5f627ea547b75c';

  constructor(private http: HttpClient) { }

  refresh(table: UpdatableTable) {
    this.http.get(this.WEATHER_URL).subscribe(data => {
      var weatherResponse = this.parseWeather(data);
      table.updateWeather(weatherResponse);
    });
  }

  parseWeather(data: any): Array<WeatherData> {
    var weatherData = new Array<WeatherData>();

    var weatherList = data.list;

    for(let i = 0 ; i < 7 ; i++) {
      var time = weatherList[i].dt_txt;
      time = new Date(time).getHours() + ':00';
      if(time.length < 5) {
        time = '0' + time;
      }

      var wind = weatherList[i].wind.speed.toFixed(1);

      var temp = weatherList[i].main.temp;
      temp = Number(temp - 273.15).toFixed(1);

      var desc = weatherList[i].weather[0].description;
      desc = desc[0].toUpperCase() + desc.substring(1);

      weatherData.push({
        clock: time,
        wind: wind,
        temperature: temp,
        description: desc
      });

    }
    return weatherData;
  }
}
