import axios from 'axios';

export class PixabayAPI {
  #API_KEY = '38081191-44fc2de709a1cfc57ee790b0d';

  #BASE_URL = 'https://pixabay.com/api/';

  query = null;
  page = 1;

  per_page = 40;

  //*** FETCH METHOD */
  // fetchPhotos() {
  //   return fetch(
  //     `${this.#BASE_URL}?key=${this.#API_KEY}&q=${this.query}&page=${
  //       this.page
  //     }&image_type=photo&orientation=horizontal&safesearch=true&per_page=${
  //       this.per_page
  //     }`
  //   ).then(response => {
  //     if (!response.ok) {
  //       throw new Error(response.status);
  //     }
  //     return response.json();
  //   });
  // }

  //***AXIOS METHOD  */

  async fetchPhotos() {
    const axiosOptions = {
      method: 'get',
      url: `${this.#BASE_URL}`,
      params: {
        key: `${this.#API_KEY}`,
        q: `${this.query}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: `${this.page}`,
        per_page: `${this.per_page}`,
      },
    };
    try {
      const response = await axios(axiosOptions);

      const data = response.data;

      return data;
    } catch (error) {
      console.error(error);
    }
  }
}
