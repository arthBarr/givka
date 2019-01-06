import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComicAlbum } from '../classes/comic-album';
import { ComicAuthor } from '../classes/comic-author';
import { ComicSerie } from '../classes/comic-serie';

@Injectable({
  providedIn: 'root',
})
export class ComicsService {

  private baseUrl = 'https://givka-api.netlify.com/.netlify/functions/';

  constructor(private http : HttpClient) {}

  public getAlbums() {
    return this.http.get(`${this.baseUrl}read-all?class=albums&order=voteCount`)
    .toPromise()
    .then((response: any) => response.map((a: any) => new ComicAlbum(a)) as ComicAlbum[]);
  }

  public getSerieDetails(id: number) {
    return this.http.get(`${this.baseUrl}read-serie?serieId=${id}`)
    .toPromise()
    .then(response => new ComicSerie(response));
  }

  public getAuthor(name: string) {
    return this.http.get(`${this.baseUrl}read-author?name=${name}`)
    .toPromise()
    .then((response:any) => new ComicAuthor(response));
  }

}
