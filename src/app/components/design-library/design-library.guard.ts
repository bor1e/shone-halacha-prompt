import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export const designLibraryGuard: CanActivateFn = () => {
    const router = inject(Router);

    // Only allow access in development mode
    if (environment.production) {
        // Redirect to home page in production
        router.navigate(['/']);
        return false;
    }

    return true;
}; 