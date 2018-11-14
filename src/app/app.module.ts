import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

import { MoviesComponent } from './components/movies/movies.component';
import { MovieComponent } from './components/movies/movie/movie.component';
import { SpinnerComponent } from './components/shared/spinner/spinner.component';
import { MovieDetailsComponent } from './components/movies/movie-details/movie-details.component';
import { CreditDetailsComponent } from './components/movies/credit-details/credit-details.component';
import { MovieListComponent } from './components/movies/movie-details/movie-list/movie-list.component';
import { ButtonComponent } from './components/shared/button/button.component';
import { ArtComponent } from './components/art/art.component';
import { ArtistDetailsComponent } from './components/art/artist-details/artist-details.component';
import { PortraitsComponent } from './components/art/portraits/portraits.component';
import { PopupArtComponent } from './components/art/popup-art/popup-art.component';
import { PortraitComponent } from './components/shared/portrait/portrait.component';

const appRoutes: Routes = [
  { path: 'movies/:list', component: MoviesComponent },
  { path: 'movies', redirectTo: 'movies/collection', pathMatch: 'full' },
  { path: 'movie/:id', component: MovieDetailsComponent },
  { path: 'credit/:id', component: CreditDetailsComponent },
  { path: 'tv', component: MoviesComponent },
  { path: 'art', component: ArtComponent },
  { path: '', redirectTo: 'movies/collection', pathMatch: 'full' },

];

@NgModule({
  declarations: [
  AppComponent,
  MoviesComponent,
  MovieComponent,
  SpinnerComponent,
  MovieDetailsComponent,
  CreditDetailsComponent,
  MovieListComponent,
  ButtonComponent,
  ArtComponent,
  ArtistDetailsComponent,
  PortraitsComponent,
  PopupArtComponent,
  PortraitComponent,
  ],
  imports: [
  BrowserModule,
  HttpClientModule,
  RouterModule.forRoot(appRoutes)

  ],
  providers: [],
  bootstrap: [AppComponent]
  })
export class AppModule { }
