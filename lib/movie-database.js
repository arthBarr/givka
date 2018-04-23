const rp = require('request-promise');

const API_KEY = 'aa79a25e783821b082e1e241e41889db';
const LANGUAGE = 'en-US';

class MovieDataBase {
  static getCollection(id) {
    const url = `https://api.themoviedb.org/3/collection/${id}`;
    const addRequest = 'images';
    return _getRequest(url, addRequest);
  }

  static getTV(id) {
    const url = `https://api.themoviedb.org/3/tv/${id}`;
    const addRequest = 'credits,images,videos,recommendations';
    return _getRequest(url, addRequest);
  }

  static getPeople(id) {
    const url = `https://api.themoviedb.org/3/person/${id}`;
    const addRequest = 'movie_credits,images,tagged_images';
    return _getRequest(url, addRequest);
  }

  static getMovie(id, addRequest = 'credits,images,videos,recommendations') {
    const url = `https://api.themoviedb.org/3/movie/${id}`;
    return _getRequest(url, addRequest);
  }

  static getDiscover(list, number) {
    const url = `https://api.themoviedb.org/3/movie/${list}`;
    const PromiseArray = [];

    for (let i = 1; i <= number; i += 1) {
      PromiseArray.push(_getRequest(url, null, i));
    }
    return Promise.all(PromiseArray)
      .then((allResponses) => {
        let results = allResponses.map(value => value.results);
        results = [].concat(...results);
        return results;
      });
  }
}

function _getRequest(url, addRequestAppend, nbrPage) {
  const options = {
    method: 'GET',
    url,
    qs: {
      language: LANGUAGE,
      api_key: API_KEY,
      append_to_response: addRequestAppend,
      include_image_language: 'en,null',
      page: nbrPage,
    },
    body: '{}',
    json: true,
  };
  return rp(options)
    .then(response => response)
    .catch((err) => {
      throw err;
    });
}

module.exports = MovieDataBase;

