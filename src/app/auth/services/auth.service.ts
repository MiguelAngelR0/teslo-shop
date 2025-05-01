import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';

import { environment } from 'src/environments/environment';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl

@Injectable({providedIn: 'root'})
export class AuthService {

  private _authStatus = signal<AuthStatus>('checking')
  private _user = signal<User | null>(null)
  private _token = signal<string | null>(localStorage.getItem('token'))

  private http = inject(HttpClient);


  checkStatusResource = rxResource({
    loader:() => this.checkStatus(),
  })

  authstatus = computed<AuthStatus>(() => {
    if(this._authStatus() === 'checking') return 'checking';

    if(this._user()){
      return 'authenticated';
    }

    return 'not-authenticated';
  })

  user = computed<User | null>(() => this._user());
  token = computed(this._token);
  isAdmin = computed(() => this._user()?.roles.includes('admin') ?? false)

  login(email: string, password: string):Observable<boolean> {

    return this.http.post<AuthResponse>(`${baseUrl}/auth/login`,{
      email:email,
      password:password
    }).pipe(
      map(resp => this.HandleAuthSucess(resp)),
      catchError((error : any) => this.HandleAuthError(error)));
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if(!token){
      this.logout();
      return of(false);
    }
    //Implementar cache, Se pregunta cuando fue la ultima vez que se hizo la peticion a /auth/check-status , y cuando ya tienes resp y el usuario esta activo, se regresa un objeto, asi no bombardeamos al backend para verificar el estado
    return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`, {
      // headers: {
      //   Authorization: `Bearer ${token}`
      // }
    }).pipe(
      map(resp => this.HandleAuthSucess(resp)),
      catchError((error : any) => this.HandleAuthError(error)));
  }

  logout(){
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');
    localStorage.removeItem('token');
  }

  private HandleAuthSucess( {token, user}: AuthResponse){
    this._user.set(user);
    this._authStatus.set('authenticated');
    this._token.set(token);

    localStorage.setItem('token', token);
    return true;
  }

  private HandleAuthError( errro : any ){
    this.logout();
    return of(false);
  }

}
