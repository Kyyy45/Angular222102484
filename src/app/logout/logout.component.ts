import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  constructor(private cookieService: CookieService, private router: Router) {}

  // hapus cookie atau token autentikasi
  ngOnInit(): void {
    this.cookieService.deleteAll();
  
    // arahkan ke halaman login
    this.router.navigate(['/login']);
  }

}
