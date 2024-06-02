import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, CanActivate,Router, RouterStateSnapshot, UrlTree } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class RouteguardGuard implements CanActivate {

  constructor ( 
    private router:Router
  )
  {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const token = sessionStorage.getItem('token');
      const userId = sessionStorage.getItem('id');

      if (token && userId) {
        return true;
      } else {
        this.router.navigate(['']);
        return false;
      }
  }

}
