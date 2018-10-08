angular.module('givka')
  .component('moviesComponent', {
    bindings: {
      movies: '<',
    },
    templateUrl: 'Components/Movies/movies.component.html',
    controller: ['$scope', '$q', 'TmdbService', 'StorageService', 'MovieFactory', 'BackgroundFactory', class MoviesComponent {
      constructor($scope, $q, TmdbService, StorageService, MovieFactory, BackgroundFactory) {
        this.$scope = $scope;
        this.$q = $q;
        this.TmdbService = TmdbService;
        this.StorageService = StorageService;
        this.MovieFactory = MovieFactory;
        this.BackgroundFactory = new BackgroundFactory();
        this.isLoading = false;
        this.type = 'seen';

        this.orderAsc = true;
      }

      $onInit() {
        this._getMovies(this.type);

        this.$scope.$on('clickPoster', ($event, data) => {
          this.onClickPoster(data.movie, data.event);
        });
      }

      $onDestroy() {
        this.BackgroundFactory.removeBackground();
      }

      onCloseMovieDetails() {
        this.showMovieDetails = false;
        this.BackgroundFactory.removeBackground();

        this._getMovies(this.type);
      }

      onClickNavigation(type) {
        this.showMovieDetails = false;
        this.BackgroundFactory.removeBackground();

        this._getMovies(type);
      }

      _getMovies(type) {
        this.isLoading = true;
        const promises = [];
        promises.push(this.StorageService.readDB('movie'));
        if (type === 'discover') {
          promises.push(this.TmdbService.getDiscover('top_rated', 20));
        }

        this.$q.all(promises)
          .then(([watchedMovies, discoverMovies]) => {
            let _movies = discoverMovies || Object.keys(watchedMovies).map(id => watchedMovies[id]);
            _movies = _movies.map(movie => new this.MovieFactory(movie, watchedMovies));

            this.movies = _movies;

            this.type = type;
          })
          .finally(() => {
            this.isLoading = false;
          });
      }

      search(query) {
        if (!query) { this.searchResult = null; return; }

        this.TmdbService.getSearchResult(query)
          .then((data) => {
            this.searchResult = data.results;
            console.log(data.results);
          });
      }

      sortBy(key) {
        const order = this.orderAsc ? 'asc' : 'desc';
        this.movies = _.orderBy(this.movies, movie => movie[key], order);

        this.orderAsc = !this.orderAsc;
      }

      toggleMovieDetails(movie) {
        this.isLoading = true;

        this.BackgroundFactory.addBackground(movie.backdrop || movie.backdrop_path);

        const promises = [this.TmdbService.getMovie(movie.id), this.StorageService.readDB('movie')];

        this.$q.all(promises)
          .then(([movieDetails, moviesSeen]) => {
            const _movie = new this.MovieFactory(movieDetails, moviesSeen);
            return _movie.getDetails(moviesSeen);
          })
          .then((movieDetails) => {
            this.movieDetails = movieDetails;

            this.showMovieDetails = true;
          })
          .finally(() => {
            this.isLoading = false;
          });
      }

      onClickPoster(movie, event) {
        if (event.ctrlKey || event.metaKey) {
          movie.toggleSeen(this.movieDetails, this.showMovieDetails);

          movie.seen ? this.StorageService.addKeyDB('movie', movie) : this.StorageService.deleteKeyDB('movie', movie);
        }
        else {
          this.toggleMovieDetails(movie);
        }
      }
    }],

  });
