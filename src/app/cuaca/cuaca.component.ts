import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';

declare const $: any;
declare const moment: any;

@Component({
  selector: 'app-cuaca',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './cuaca.component.html',
  styleUrl: './cuaca.component.css',
})
export class CuacaComponent implements OnInit, AfterViewInit {
  private table1: any;
  constructor(private renderer: Renderer2, private http: HttpClient) { }

  ngAfterViewInit(): void {
    this.renderer.removeClass(document.body, "sidebar-open");
    this.renderer.addClass(document.body, "sidebar-close");

    this.table1 = $("#table1").DataTable
    (
      {
        "columnDefs" :
        [
          {
            "targets" : 0,
            "render" : function (data: string)
            {
              var waktu = moment(data + " UTC");
              console.log(waktu);

              var html = waktu.local().format("YYYY-MM-DD") + "<br />" + waktu.local().format("HH:mm") + "WIB";
              return html;
            }
          },
          {
            "targets" : 1,
            "render" : function (data: string)
            {
              var html = "<img src='" + data +"'>";
              return html;
            }
          },
          {
            "targets" : 2,
            "render" : function (data: string)
            {
              var array = data.split('||');
              var cuaca = array[0];
              var deskripsi = array[1];
              var html = "<strong>" + cuaca + "</strong><br />" + deskripsi;
              return html;
            }
          }
        ]
      }
    );
    this.bind_tabe1();
  }
  bind_tabe1(): void {
    this.http.get("http://api.openweathermap.org/data/2.5/forecast?id=1630789&appid=2005b50114910b5dadd3f7bb194830d8")
      .subscribe((data: any) => {
        console.log(data);

        var list = data.list;
        console.log(list);

        this.table1.clear();

        list.forEach((element: any) => {
          var weather = element.weather[0];
          console.log(weather);

          var iconUrl = "https://openweathermap.org/img/wn/" + weather.icon + "@2x.png";
          var cuacaDeskripsi = weather.main + "||" + weather.description;

          var main = element.main;
          console.log(main);

          var tempMin = this.kelvinToCelcius(main.temp_min);
          console.log("tempMin : " + tempMin);

          var tempMax = this.kelvinToCelcius(main.temp_max);
          console.log("tempMax : " + tempMax);

          var temp = tempMin + "℃ - " + tempMax + "℃";

          var row = [
            element.dt_txt,
            iconUrl,
            cuacaDeskripsi,
            temp
          ]

          this.table1.row.add(row);
        });
        this.table1.draw(false);
      }
      );
  }
  kelvinToCelcius(kelvin: any): any {
    var celcius = kelvin - 273.15;
    celcius = Math.round(celcius * 100) / 100;
    return celcius;
  }
  ngOnInit(): void {

  }
}
