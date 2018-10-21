import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { Movie } from '../factories/movie';

@Injectable({ providedIn: 'root' })

export class BroadcastService {
  private portraitSubject = new Subject<any>();

  private movieSubject = new Subject<any>();

  public sendPortrait(portrait, event) {
    this.portraitSubject.next({ portrait, event });
  }

  getPortrait(): Observable<any> {
    return this.portraitSubject.asObservable();
  }

  public sendMovie(movie: Movie, event) {
    this.movieSubject.next({ movie, event });
  }

  getMovie(): Observable<any> {
    return this.movieSubject.asObservable();
  }
}