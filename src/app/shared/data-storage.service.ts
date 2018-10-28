import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class DataStorageService {
  constructor(private httpClient: HttpClient,
              private recipeService: RecipeService,
              private authService: AuthService) {
  }

  storeRecipes() {
    // const token = this.authService.getToken();

  //   return this.httpClient.put(
  //     'https://udemy-ng-http-befca.firebaseio.com/recipes.json',
  //     this.recipeService.getRecipes(),
  //     {
  //       // observe: 'events'
  //       observe: 'body',
  //       // headerek küldése
  //       // headers: new HttpHeaders()
  //       //   .set('Authorization', 'asdasd asdasd')
  //       //   .append('asdasd', 'asdasd')
  //       params: new HttpParams().set('auth', token)
  //     });

    const req = new HttpRequest('PUT',
    'https://udemy-ng-http-befca.firebaseio.com/recipes.json',
    this.recipeService.getRecipes(), {
      reportProgress: true,
      // params: new HttpParams().set('auth', token)
    });
    return this.httpClient.request(req);
  }



  getRecipes() {
    // ez már interceptorral
    // const token = this.authService.getToken();

    // this.httpClient.get<Recipe[]>('https://udemy-ng-http-befca.firebaseio.com/recipes.json?auth=' + token)
    this.httpClient.get<Recipe[]>('https://udemy-ng-http-befca.firebaseio.com/recipes.json', {
      observe: 'body',      //
      responseType: 'json',  // blob, arrayBuffer, json, text
      // params: new HttpParams().set('auth', token)
    })
      .map(
        (recipes) => {
          console.log(recipes)
          for (let recipe of recipes) {
            if (!recipe['ingredients']) {
              recipe['ingredients'] = [];
            }
          }
          return recipes;
        }
      )
      .subscribe(
        (recipes: Recipe[]) => {
          this.recipeService.setRecipes(recipes);
        }
      );
  }
}
