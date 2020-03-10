import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { World } from '../model/world.model';
import { Pallier } from '../model/pallier.model'
import { Product } from '../model/product.model';


@Injectable({
  providedIn: 'root'
})
export class RestService {

  server = "http://localhost:8080/adventureisis/";
  user = "";

  constructor(private http: HttpClient) { }

  public getUser() : string{
    return this.user;
  }
  public setUser(user : string){
    this.user = user;
  }

  public getServer() : string{
    return this.server;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
   }

   getWorld(): Promise<World> {
    return this.http.get(this.server + "webresources/generic/world", {
      headers: this.setHeaders(this.user)})
    .toPromise().then(response => response)
    .catch(this.handleError);
   };

   private setHeaders(user : string) : HttpHeaders {
    var headers = new HttpHeaders();
    headers.append("X-User",user);
    return headers;
   }
}
