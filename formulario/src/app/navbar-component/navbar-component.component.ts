import { Component, inject, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, Router } from "@angular/router"
import { JwtService } from "../services/jwt.service"

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./navbar-component.component.html",
  styles: [
    `
    .navbar-brand { font-weight: bold; }
    .profile-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 0.25rem;
      padding: 1rem;
      z-index: 1000;
    }
    .profile-content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  `,
  ],
})
export class NavbarComponent implements OnInit {
  private router = inject(Router)
  private jwtService = inject(JwtService)

  isProfileMenuVisible = false
  userName = ""

  ngOnInit() {
    this.updateUserName()
  }

  isLoggedIn(): boolean {
    return this.jwtService.isLoggedIn()
  }

  logout() {
    this.jwtService.removeToken()
    this.router.navigate(["/login"])
    this.isProfileMenuVisible = false
  }

  toggleProfileMenu(): void {
    this.isProfileMenuVisible = !this.isProfileMenuVisible
    if (this.isProfileMenuVisible) {
      this.updateUserName()
    }
  }

  private updateUserName(): void {
    const storage = this.jwtService.getToken()
    if (storage.token) { 
      this.userName = storage.name || "Usuario"
    }
  }
}

