angular.module('givka')
  .component('movieListComponent', {
    bindings: {
      movieList: '<',
      listName: '@',

    },
    templateUrl: 'Components/Movies/MovieDetails/MovieList/movieList.component.html',
    controller: ['$scope', class MovieListComponent {
      constructor($scope) {
        this.$scope = $scope;
      }

      onClickPoster(movie, event) {
        this.$scope.$emit('clickPoster', { movie, event });
      }
    }],

  });
