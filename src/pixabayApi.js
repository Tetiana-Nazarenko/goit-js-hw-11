export class PixabayAPI {
  #API_KEY = '38081191-44fc2de709a1cfc57ee790b0d';

  #BASE_URL = 'https://pixabay.com/api/';

  query = null;
  page = 1;

  per_page = 40;

  fetchPhotos() {
    return fetch(
      `${this.#BASE_URL}?key=${this.#API_KEY}&q=${this.query}&page=${
        this.page
      }&image_type=photo&orientation=horizontal&safesearch=false&per_page=${
        this.per_page
      }`
    ).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
  }
}
