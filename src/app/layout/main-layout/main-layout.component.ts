import { Component, ChangeDetectionStrategy, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { filter, map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HalachaSidebarComponent, SummaryRequestEvent } from '../../features/halacha/components/halacha-sidebar/halacha-sidebar.component';
import { HalachaWithSummaries } from '../../types/halacha.types';

@Component({
  selector: 'app-main-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatTooltipModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
    HalachaSidebarComponent
  ],
  template: `
    <div class="main-layout">
      <!-- Top Navigation Bar -->
      <mat-toolbar class="top-navbar" color="primary">
        <div class="navbar-content">
          <!-- Left Section -->
          <div class="navbar-left">
            <!-- Always show sidebar toggle button -->
            <button 
              mat-icon-button
              (click)="toggleSidebar()"
              class="sidebar-toggle-btn"
              matTooltip="Toggle Sidebar"
              aria-label="Toggle sidebar navigation">
              <mat-icon>{{ sidebarOpened() ? 'menu_open' : 'menu' }}</mat-icon>
            </button>
            
            <!-- Logo/Brand -->
            <button 
              type="button"
              class="brand"
              (click)="navigateHome()"
              matTooltip="Go to Home"
              aria-label="Navigate to home page">
              <mat-icon class="brand-icon">book</mat-icon>
              <span class="brand-text">AI Schone Halacha</span>
            </button>
          </div>

          <!-- Center Section - Navigation Items -->
          <nav class="navbar-center" [class.hidden-mobile]="isMobile()">
            <button 
              mat-button 
              class="nav-item"
              [class.active]="isCurrentRoute('/')"
              (click)="navigate('/')">
              <mat-icon>home</mat-icon>
              <span>Home</span>
            </button>
            
            <button 
              mat-button 
              class="nav-item"
              [class.active]="isCurrentRoute('/search')"
              (click)="navigate('/search')">
              <mat-icon>search</mat-icon>
              <span>Search</span>
            </button>
            
            <button 
              mat-button 
              class="nav-item"
              [class.active]="isCurrentRoute('/recent')"
              (click)="navigate('/recent')">
              <mat-icon matBadge="3" matBadgeColor="accent" matBadgeSize="small">history</mat-icon>
              <span>Recent</span>
            </button>
          </nav>

          <!-- Right Section -->
          <div class="navbar-right">
            <!-- Language Switcher -->
            <div class="language-switcher">
              <button 
                mat-button 
                [matMenuTriggerFor]="languageMenu"
                class="language-btn">
                <mat-icon>language</mat-icon>
                <span class="current-lang">{{ currentLanguage() }}</span>
                <mat-icon class="dropdown-icon">arrow_drop_down</mat-icon>
              </button>
              
              <mat-menu #languageMenu="matMenu" class="language-menu">
                <button mat-menu-item (click)="setLanguage('DE')" [class.active]="currentLanguage() === 'DE'">
                  <span class="lang-flag">🇩🇪</span>
                  <span>Deutsch</span>
                </button>
                <button mat-menu-item (click)="setLanguage('EN')" [class.active]="currentLanguage() === 'EN'">
                  <span class="lang-flag">🇺🇸</span>
                  <span>English</span>
                </button>
                <button mat-menu-item (click)="setLanguage('HE')" [class.active]="currentLanguage() === 'HE'">
                  <span class="lang-flag">🇮🇱</span>
                  <span>עברית</span>
                </button>
                <button mat-menu-item (click)="setLanguage('FR')" [class.active]="currentLanguage() === 'FR'">
                  <span class="lang-flag">🇫🇷</span>
                  <span>Français</span>
                </button>
                <button mat-menu-item (click)="setLanguage('RU')" [class.active]="currentLanguage() === 'RU'">
                  <span class="lang-flag">🇷🇺</span>
                  <span>Русский</span>
                </button>
              </mat-menu>
            </div>

            <!-- Settings Menu -->
            <button 
              mat-icon-button 
              [matMenuTriggerFor]="settingsMenu"
              matTooltip="Settings">
              <mat-icon>more_vert</mat-icon>
            </button>
            
            <mat-menu #settingsMenu="matMenu">
              <button mat-menu-item>
                <mat-icon>settings</mat-icon>
                <span>Settings</span>
              </button>
              <button mat-menu-item>
                <mat-icon>help</mat-icon>
                <span>Help</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item>
                <mat-icon>info</mat-icon>
                <span>About</span>
              </button>
            </mat-menu>

            <!-- בס״ד moved here -->
            <span class="brand-hebrew">בס״ד</span>

            <!-- Mobile Menu Toggle -->
            @if (isMobile()) {
              <button 
                mat-icon-button
                [matMenuTriggerFor]="mobileMenu"
                class="mobile-menu-toggle">
                <mat-icon>more_horiz</mat-icon>
              </button>
              
              <mat-menu #mobileMenu="matMenu" class="mobile-nav-menu">
                <button mat-menu-item (click)="navigate('/')">
                  <mat-icon>home</mat-icon>
                  <span>Home</span>
                </button>
                <button mat-menu-item (click)="navigate('/search')">
                  <mat-icon>search</mat-icon>
                  <span>Search</span>
                </button>
                <button mat-menu-item (click)="navigate('/recent')">
                  <mat-icon>history</mat-icon>
                  <span>Recent</span>
                </button>
              </mat-menu>
            }
          </div>
        </div>
      </mat-toolbar>

      <!-- Main Content Area -->
      <mat-sidenav-container class="sidenav-container">
        <!-- Sidebar - Always available but conditionally shown -->
        <mat-sidenav
          #sidenav
          [mode]="isMobile() ? 'over' : 'side'"
          [opened]="sidebarOpened() && !isMobile()"
          class="halacha-sidenav"
          [fixedInViewport]="false"
          (openedChange)="onSidebarToggle($event)">
          
          <div class="sidebar-header">
            <h3>
              <mat-icon>library_books</mat-icon>
              Recent Halachot
            </h3>
            @if (isMobile()) {
              <button mat-icon-button (click)="closeSidebar()">
                <mat-icon>close</mat-icon>
              </button>
            }
          </div>
          
          <app-halacha-sidebar
            (requestSummary)="onRequestSummary($event)"
            (loadHalacha)="onLoadHalacha($event)">
          </app-halacha-sidebar>
        </mat-sidenav>

        <!-- Main Content -->
        <mat-sidenav-content class="main-content">
          <!-- Content Wrapper with proper spacing -->
          <div class="content-wrapper" [class.with-sidebar]="sidebarOpened() && !isMobile()">
            <router-outlet></router-outlet>
          </div>
          
          <!-- Footer -->
          <footer class="app-footer">
            <div class="footer-content">
              <!-- Main Footer Content -->
              <div class="footer-main">
                <div class="footer-section">
                  <h4>
                    <mat-icon>book</mat-icon>
                    AI Schone Halacha
                  </h4>
                  <p>Innovative AI-powered platform for Halacha study and analysis. Making Jewish law accessible through modern technology.</p>
                  <div class="social-links">
                    <button mat-icon-button matTooltip="Email" aria-label="Contact via email">
                      <mat-icon>email</mat-icon>
                    </button>
                    <button mat-icon-button matTooltip="GitHub" aria-label="View source code">
                      <mat-icon>code</mat-icon>
                    </button>
                    <button mat-icon-button matTooltip="Community" aria-label="Join community">
                      <mat-icon>forum</mat-icon>
                    </button>
                  </div>
                </div>

                <div class="footer-section">
                  <h5>Resources</h5>
                  <ul>
                    <li><a href="/search">Search Halachot</a></li>
                    <li><a href="/recent">Recent Analysis</a></li>
                    <li><a href="/categories">Categories</a></li>
                    <li><a href="/methodology">Methodology</a></li>
                  </ul>
                </div>

                <div class="footer-section">
                  <h5>Support</h5>
                  <ul>
                    <li><a href="/help">Help Center</a></li>
                    <li><a href="/faq">FAQ</a></li>
                    <li><a href="/contact">Contact</a></li>
                    <li><a href="/feedback">Feedback</a></li>
                  </ul>
                </div>

                <div class="footer-section">
                  <h5>About</h5>
                  <ul>
                    <li><a href="/about">About Us</a></li>
                    <li><a href="/privacy">Privacy Policy</a></li>
                    <li><a href="/terms">Terms of Use</a></li>
                    <li><a href="/licenses">Licenses</a></li>
                  </ul>
                </div>
              </div>

              <!-- Footer Bottom -->
              <mat-divider></mat-divider>
              <div class="footer-bottom">
                <div class="footer-left">
                  <p>&copy; {{ currentYear }} AI Schone Halacha. All rights reserved.</p>
                  <p class="disclaimer">This platform provides educational content. Consult a qualified rabbi for practical Halachic decisions.</p>
                </div>
                <div class="footer-right">
                  <span class="version">v{{ appVersion }}</span>
                  <span class="hebrew-blessing">לעילוי נשמת הרבנים הקדושים</span>
                </div>
              </div>
            </div>
          </footer>
          
          <!-- Floating Action Button for quick actions -->
          @if (showQuickActions()) {
            <div class="fab-container">
              <button 
                mat-fab 
                color="accent"
                matTooltip="Quick Submit"
                class="main-fab">
                <mat-icon>add</mat-icon>
              </button>
            </div>
          }
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styleUrls: ['./main-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);
  
  sidebarOpened = signal(true);
  currentLanguage = signal('DE');
  currentRoute = signal('');
  isMobile = signal(false);
  currentYear = new Date().getFullYear();
  appVersion = '1.0.0'; // You can import this from your environment or version file
  
  constructor() {
    // Track route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => (event as NavigationEnd).url)
    ).subscribe(url => {
      this.currentRoute.set(url);
      // Note: Sidebar is always available, just controlled by the toggle button
    });

    // Track mobile breakpoint
    this.breakpointObserver.observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
      .subscribe(result => {
        this.isMobile.set(result.matches);
        if (result.matches) {
          this.sidebarOpened.set(false);
        } else {
          this.sidebarOpened.set(true);
        }
      });
  }

  toggleSidebar(): void {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }

  closeSidebar(): void {
    if (this.sidenav) {
      this.sidenav.close();
    }
  }

  onSidebarToggle(opened: boolean): void {
    this.sidebarOpened.set(opened);
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  navigateHome(): void {
    this.router.navigate(['/']);
  }

  isCurrentRoute(route: string): boolean {
    return this.currentRoute() === route || (route === '/' && this.currentRoute() === '');
  }

  setLanguage(language: string): void {
    this.currentLanguage.set(language);
    
    console.info('[MainLayout] Language switch requested:', {
      from: this.currentLanguage(),
      to: language,
      currentUrl: window.location.href
    });

    // This logic correctly reloads the page to the new language path.
    const baseUrl = window.location.origin;
    const langCode = language.toLowerCase();
    
    if (langCode === 'de') {
      // German is the base URL
      const newUrl = baseUrl;
      console.info('[MainLayout] Redirecting to German (base URL):', newUrl);
      window.location.href = newUrl;
    } else {
      const newUrl = `${baseUrl}/${langCode}`;
      console.info('[MainLayout] Redirecting to localized URL:', newUrl);
      window.location.href = newUrl;
    }
  }

  showQuickActions(): boolean {
    return this.currentRoute() === '/' || this.currentRoute() === '';
  }

  onRequestSummary(event: SummaryRequestEvent): void {
    // TODO: Implement cross-component communication
    console.log('Summary requested:', event);
  }

  onLoadHalacha(halacha: HalachaWithSummaries): void {
    // Navigate to halacha detail page
    this.router.navigate(['/halacha', halacha.halachaNumber]);
    
    // Close sidebar on mobile after navigation
    if (this.isMobile()) {
      this.closeSidebar();
    }
  }
}