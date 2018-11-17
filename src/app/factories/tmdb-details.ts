import * as moment from 'moment';
import { Tmdb } from './tmdb';
import { Utils } from './utils';
import { Credit } from './credit';

export class TmdbDetails extends Tmdb {
  public originalTitle: string;

  public releaseYear: string;

  public overview: string;

  public trailer: string;

  public credits: Credit[];

  public images: any[];

  constructor(options, database) {
    super(options, database);
    this.originalTitle = options.original_title || options.original_name;
    this.overview = options.overview;
    this.releaseYear = moment(this.releaseDate, 'YYYY-MM-DD').format('YYYY');
    this.trailer = this.formatVideos(options.videos);
    this.credits = this.formatCredits(options.credits);
    this.images = this.formatImages(options.images);
  }

  private formatVideos(videos) {
    const { results } = videos;
    let trailers = results.filter(t => t.type === 'Trailer');
    if (!trailers.length) { trailers = results; }
    trailers = Utils.orderBy(trailers, 'size');
    return trailers[0] ? `https://www.youtube.com/watch?v=${trailers[0].key}` : `https://www.youtube.com/results?search_query=${this.title}+${this.releaseYear}`;
  }

  private formatCredits(credits) {
    let directors = credits.crew;
    let actors = credits.cast;
    directors = directors.filter(crew => crew.job === 'Director');
    actors = actors.filter((cast, index) => cast.profile_path)
      .filter((cast, index) => index < 20);
    return directors.concat(actors).map(c => new Credit(c));
  }

  private formatImages(images) {
    // images = images.backdrops.concat(images.posters);
    images = images.backdrops;
    images = Utils.orderBy(images, 'vote_count');

    return images.map(image => image.file_path);
  }
}
