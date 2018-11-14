import * as moment from 'moment';

import { Utils } from './utils';
import { Movie } from './movie';

export class MovieDetails extends Movie {
  directorMovies: Movie[];

  collectionMovies: Movie[];

  recoMovies: Movie[];

  collection: any;

  originalTitle: string;

  overview: string;

  runtime: string;

  tagLine: string;

  imdbId: string;

  popularity: string;

  trailer: string;

  credits: any[];

  images: any[];

  director;

  constructor(options, moviesSeen = {}) {
    super(options, moviesSeen);
    this.collection = options.belongs_to_collection;
    this.originalTitle = options.original_title;
    this.overview = options.overview;
    this.popularity = options.popularity;
    this.runtime = moment.utc().startOf('day').add(options.runtime, 'minutes').format('h[h] mm[min]');
    this.tagLine = options.tagline;
    this.imdbId = options.imdb_id;
    this.voteCount = options.vote_count;
    this.releaseDate = moment(this.releaseDate, 'YYYY-MM-DD').format('YYYY');
    this.images = this.formatImages(options.images);
    this.trailer = this.formatVideos(options.videos);
    this.credits = this.formatCredits(options.credits);
    // TODO: Take into consideration page 2 from recommendations
    this.recoMovies = this.formatRecoMovies(options.recommendations, moviesSeen);
    this.director = this.credits && this.credits[0] && this.credits[0].job === 'Director' && this.credits[0];
  }

  async addDetails(director, collection, moviesSeen) {
    this.collectionMovies = this.formatCollectionMovies(collection, moviesSeen);
    this.directorMovies = this.formatDirectorMovies(director, moviesSeen);
  }

  private formatDirectorMovies(director, moviesSeen) {
    const directorMovies = director.movie_credits.crew
      .filter(movie => movie.job === 'Director')
      .map(m => new Movie(m, moviesSeen))
      .filter(m => m.poster);
    return Utils.orderBy(directorMovies, 'voteCount');
  }

  private formatCollectionMovies(collection, moviesSeen): Movie[] {
    if (!collection) { return []; }
    const movies = collection.parts.map(m => new Movie(m, moviesSeen))
      .filter(m => m.poster);
    return Utils.orderBy(movies, 'releaseDate', 'asc');
  }

  public toggleSeen(movie: Movie) {
    [].concat(this, this.directorMovies, this.collectionMovies, this.recoMovies)
      .filter(m => m && m.id === movie.id)
      .forEach((m) => { m.seen = !m.seen; });
  }

  private formatRecoMovies(movies, moviesSeen) {
    if (!movies.results.length) { return null; }
    return movies.results.map(m => new Movie(m, moviesSeen));
  }

  private formatImages(images) {
    if (!images) { return null; }
    images = images.backdrops;
    images = Utils.orderBy(images, 'vote_count');
    images = images.slice(0, 6);
    return images;
  }

  private formatVideos(videos) {
    const { results } = videos;
    if (!results.length) { return null; }
    let trailers = results.filter(t => t.type === 'Trailer');
    if (!trailers.length) { trailers = results; }
    trailers = Utils.orderBy(trailers, 'size');
    return `https://www.youtube.com/watch?v=${trailers[0].key}` || null;
  }

  private formatCredits(credits) {
    if (!credits) { return null; }
    let directors = credits.crew;
    let actors = credits.cast;
    directors = directors.filter(crew => crew.job === 'Director');
    actors = actors.filter((cast, index) => cast.profile_path)
      .filter((cast, index) => index < 20);
    return directors.concat(actors).map((credit) => {
      credit.role = credit.job || credit.character;
      return credit;
    });
  }
}

