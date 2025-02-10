import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

declare const $: any;

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private render: Renderer2, private httpClient: HttpClient, private router: Router, private cookieService: CookieService) {
    this.render.addClass(document.body, "login-page");

    this.render.removeClass(document.body, "sidebar-mini");
    this.render.removeClass(document.body, "layout-fixed");

    this.render.setAttribute(document.body, "style", "min-height: 464px;");
  }

  showPeringatanModal (message:string): void {
    $("#peringatanModal").modal();
    $("#pm_message").html(message);
  }

  signIn(): void {
    console.log("signIn()");

    var userId = $("#idText").val();
    userId = encodeURIComponent(userId);

    var password = $("#passwordText").val();
    password = encodeURIComponent(password);

    var url = "https://stmikpontianak.cloud/011100862/login.php" + 
      "?id=" + userId + 
      "&password=" + password;
    console.log("url : " + url);
    
    this.httpClient.get(url).subscribe((data: any) => {
      console.log(data);
      var row = data[0];

      if (row.idCount != "1"){
        this.showPeringatanModal("Id atau Password tidak cocok");
        return;
      }

      this.cookieService.set("userId", userId);
      console.log("Session data berhasil dibuat");
      this.router.navigate(['/dashboard'])
    });
  }

  ngOnInit(): void {
      
  }
}
