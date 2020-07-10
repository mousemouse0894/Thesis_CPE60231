import { AppService } from './../services/app.service';

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class StudentGuard implements CanActivate {
  constructor(private router: Router, public service: AppService) {}
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.service.localStorage.get('userLogin')['gidNumber'] == '4500') {
      return true;
    }
    this.router.navigate(['/notfound']);
    return false;
  }
}
