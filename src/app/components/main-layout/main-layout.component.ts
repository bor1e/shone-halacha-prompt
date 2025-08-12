import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { filter, map } from 'rxjs/operators';
import { signal } from '@angular/core';

import { HalachaSidebarComponent, SummaryRequestEvent } from '../halacha-sidebar/halacha-sidebar.component';
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
    HalachaSidebarComponent
  ],
  template: `
    <div class="main-layout">
      <mat-sidenav-container class="sidenav-container">
        <!-- Sidebar - only show on main page -->
        @if (showSidebar()) {
          <mat-sidenav 
            #sidenav 
            mode="side" 
            opened="true" 
            class="halacha-sidenav"
            [fixedInViewport]="true"
            [fixedTopGap]="64">
            <app-halacha-sidebar 
              (requestSummary)="onRequestSummary($event)"
              (loadHalacha)="onLoadHalacha($event)">
            </app-halacha-sidebar>
          </mat-sidenav>
        }

        <!-- Main content -->
        <mat-sidenav-content class="main-content">
          <!-- Toggle button for mobile - only when sidebar is visible -->
          @if (showSidebar()) {
            <div class="sidebar-toggle mobile-only">
              <button mat-fab 
                      color="primary" 
                      (click)="toggleSidebar()"
                      class="toggle-fab">
                <mat-icon>menu</mat-icon>
              </button>
            </div>
          }

          <!-- Router content -->
          <div class="content-wrapper">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styleUrls: ['./main-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent {
  private router = inject(Router);

  showSidebar = signal(true);

  constructor() {
    // Track route changes to show/hide sidebar
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => (event as NavigationEnd).url)
    ).subscribe(url => {
      // Show sidebar only on main page (root path)
      const isMainPage = url === '/' || url === '';
      this.showSidebar.set(isMainPage);
    });
  }

  onRequestSummary(event: SummaryRequestEvent): void {
    // TODO: Implement cross-component communication if needed
    console.log('Summary requested:', event);
  }

  onLoadHalacha(halacha: HalachaWithSummaries): void {
    // TODO: Implement cross-component communication if needed
    console.log('Halacha loaded:', halacha);
  }

  toggleSidebar(): void {
    // For mobile - this would need to be implemented with proper sidenav reference
    console.log('Toggle sidebar');
  }
}
