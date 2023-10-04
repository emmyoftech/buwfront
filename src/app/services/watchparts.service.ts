import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { Watchparts } from '../interfaces/watchparts';
import { SignupLoginModel } from '../interfaces/signup-login-model';
import { environment } from 'src/environments/environment';
import { MyResponse } from '../interfaces/my-response';
import { Cred } from '../interfaces/cred';
import { Collection } from '../interfaces/collection';

@Injectable({
  providedIn: 'root'
})
export class WatchpartsService {
  constructor(private http : HttpClient) {}

  getWatchParts(): Observable<Watchparts[]> {
    return this.http.get<Watchparts[]>(environment.BACKEND_BASE_URL.concat("images"),{
      responseType: "json",
      withCredentials: true
    })
  }

  makeNewUser(data: SignupLoginModel):Observable<string>{
    return this.http.post<string>(environment.BACKEND_BASE_URL.concat("signup"),data,{
      withCredentials: true,
      responseType: "json"
    })
  }

  loginuser(data: SignupLoginModel):Observable<MyResponse>{
    return this.http.post<MyResponse>(environment.BACKEND_BASE_URL.concat("login"),data,{
      withCredentials: true,
      responseType: "json"
    })
  }

  findIfUserExist(data: string):Observable<MyResponse>{
    return this.http.get<MyResponse>(environment.BACKEND_BASE_URL.concat("vali/?name=",data),{
      responseType: "json",
      withCredentials: true
    })
  }

  getHTMLDocument(htmlFilePath: string):Observable<MyResponse>{
    return this.http.get<MyResponse>(environment.HTML_DOCUMENT_BASE_URL.concat(htmlFilePath),{
      responseType: "json"
    })
  }

  get_if_pass_is_valid(user: Cred):Observable<MyResponse>{
    return this.http.post<MyResponse>(environment.BACKEND_BASE_URL.concat("pval"),user,{
      responseType: "json"
    })
  }

  change_password(user_data: Cred):Observable<MyResponse>{
    return this.http.post<MyResponse>(environment.BACKEND_BASE_URL.concat("chpass"),user_data,{
      responseType: "json"
    })
  }

  change_username(user: {old_user:string , new_user: string}): Observable<MyResponse>{
    return this.http.post<MyResponse>(environment.BACKEND_BASE_URL.concat("chuser"),user,{
      responseType: "json"
    })
  }

  verify_email (email: string ): Observable<MyResponse>{
    return this.http.get<MyResponse>(environment.BACKEND_BASE_URL.concat(`vmail/${email}`),{
      responseType: "json"
    })
  }

  set_verification (user:string , email:string): Observable<MyResponse>{
    return this.http.get<MyResponse>(environment.BACKEND_BASE_URL.concat(`acc_mail/${email}/${user}`),{
      responseType: "json"
    })
  }

  store_collection (obj:Collection):Observable<MyResponse>{
    return this.http.post<MyResponse>(environment.BACKEND_BASE_URL.concat("coll_store") , obj , {
      responseType: "json"
    })
  }

  get_collections(user: string): Observable<MyResponse>{
    return this.http.get<MyResponse>(environment.BACKEND_BASE_URL.concat(`colls/?u=${user}`))
  }

  check_mail(user: string , email: string):Observable<MyResponse>{
    return this.http.get<MyResponse>(environment.BACKEND_BASE_URL.concat(`check_mail/${email}/${user}`) , {
      responseType: "json"
    })
  }

  del_our_collect(id: number): Observable<MyResponse>{
    return this.http.delete<MyResponse>(environment.BACKEND_BASE_URL.concat(`dels/${id}`) , {
      responseType: 'json'
    })
  }

  get_all_coll () : Observable<Collection[]>{
    return this.http.get<Collection[]>(environment.BACKEND_BASE_URL.concat("all_coll") , {
      responseType: 'json'
    })
  }

  get_email (m :string) : Observable<MyResponse>{
    return this.http.get<MyResponse>(environment.BACKEND_BASE_URL.concat("g_mail/" + m))
  }
}