import { AppService } from './../services/app.service';
import { Router } from '@angular/router';

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class TeacherGuard implements CanActivate {
  constructor(private router: Router, public sevice: AppService) {}
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.sevice.localStorage.get('userLogin')['gidNumber'] == '4500') {
      this.router.navigate(['/notfound']);
      return false;
    }
    return true;
  }
}
