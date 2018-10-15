import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Movie } from '../../../../factories/movie';

import { MoviesComponent } from '../../movies.component';
import { MovieService } from '../../../../services/movie.service';

@Component({
  selector: 'movie-list-component',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
  encapsulation: ViewEncapsulation.None
  })
export class MovieListComponent {
  @Input() listName: string;

  @Input() listMovies: Movie[];

  constructor(private movieService: MovieService) { }
}
