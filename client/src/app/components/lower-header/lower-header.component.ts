import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lower-header',
  templateUrl: './lower-header.component.html',
  styleUrls: ['./lower-header.component.css']
})
export class LowerHeaderComponent {
  isCollapsed = true;

  constructor(
    private router: Router
    ) { }

  logout(): void {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
