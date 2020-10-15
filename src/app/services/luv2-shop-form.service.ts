import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem } from '../common/cart-item';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  private countriesUrl = 'http://localhost:8080/api/countries' ;
  private stateUrl ='http://localhost:8080/api/states' ;

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();

  totalQuantity: Subject<number> = new Subject<number>();

  constructor(private httpClient : HttpClient) { }

  //------------------------------------------------------------------------------------
  getCountries() : Observable<Country[]> {
  return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
    map(response => response._embedded.countries)
  );
  }
 //------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------
  getStates(theCountryCode: string) : Observable<State[]> {
    //Search URL
    const searchStateUrl =`${this.stateUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetResponseStates>(searchStateUrl).pipe(
      map(response => response._embedded.states)
    );
  }
 //------------------------------------------------------------------------------------


  //------------------------------------------------------------------------------------
  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    // build an array for "month" dropdown list
    // - start at current month and loop until

    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }

    return of(data);
  }


  //------------------------------------------------------------------------------------
  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];

    //Build an array for "Year" dropdown list
    // - start at current year and loop for 10 years next

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }
    return of(data);
  }
//------------------------------------------------------------------------------------
}
//------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------
interface GetResponseCountries {
  _embedded: {
    countries : Country[];
  }
}
//------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------
interface GetResponseStates {
  _embedded: {
    states : State[];
  }
}
//------------------------------------------------------------------------------------