import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

// *** UNSPLASH-API ***
import Notiflix from 'notiflix';

class UnsplashAPI {
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

//*** GALLERY ***
const searchForm = document.querySelector('.search-form');

const textInput = searchForm.firstElementChild;
const gallery = document.querySelector('.gallery');

const loadMoreBtn = document.querySelector('.load-more');

//*** */
const unSplashInstance = new UnsplashAPI();
let islabelActive = false;

loadMoreBtn.classList.add('is-hidden');

const handleSearchFormSubmit = event => {
  event.preventDefault();

  const searchQuery = textInput.value.trim();
  //   unSplashInstance.query = event.currentTarget.elements.query.value.trim();

  if (!searchForm) {
    return;
  }

  if (searchQuery === '') {
    return Notiflix.Notify.failure('Sorry, please enter your request!');
  }

  unSplashInstance.query = searchQuery;
  islabelActive = true;

  unSplashInstance
    .fetchPhotos()
    .then(data => {
      console.log(data);

      if (!data.hits.length) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        loadMoreBtn.classList.add('is-hidden');
        return;
      }

      // if (data.hits.length < data.per_page) {
      //   loadMoreBtn.classList.add('is-hidden');
      // }

      Notiflix.Notify.success(
        `Hooray! We found totalHits images${data.totalHits}.`
      );

      gallery.innerHTML = renderList(data.hits);

      lightbox.on('schown.simplelightbox');
      lightbox.refresh();

      //***ПЛАВНЕ ПРОКРУЧУВАННЯ */
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    })

    .catch(err => {
      console.log(err);
    })
    .finally(() => (islabelActive = false));

  searchForm.reset();
  loadMoreBtn.classList.remove('is-hidden');
};
searchForm.addEventListener('submit', handleSearchFormSubmit);

//***SIMPLELEIGHTBOX */
let lightbox = new SimpleLightbox('.gallery a', {
  /* options */
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

//**RENDER FRONTEND  */
function renderList(photos) {
  return photos
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a href= "${webformatURL}">
         <div class="photo-card">
        
        <img src="${largeImageURL}" alt="${tags}"  loading="lazy" />
        
        <div class="info">
          <p class="info-item"> ${likes}
            <b>Likes</b>
          </p>
          <p class="info-item"> ${views}
            <b>Views</b>
          </p>
          <p class="info-item">${comments}
            <b>Comments</b>
          </p>
          <p class="info-item"> ${downloads}
            <b>Downloads</b>
          </p>
        </div>
      </div>
      </a>`;
      }
    )
    .join('');
}

//**LOAD MORE */
//const photosQuantity = 100;

function handleLoadMore() {
  unSplashInstance.page += 1;

  unSplashInstance
    .fetchPhotos()
    .then(data => {
      // if (data.page === data.total_pages) {
      //   Notiflix.Notify.failure(
      //     `We're sorry, but you've reached the end of search results.`
      //   );
      //   loadMoreBtn.classList.add('is-hidden');
      // }
      Notiflix.Notify.success(
        `Hooray! We found totalHits images${data.totalHits}.`
      );
      console.log(data);
      gallery.insertAdjacentHTML('beforeend', renderList(data.hits));

      lightbox.on('schown.simplelightbox');
      lightbox.refresh();
    })
    .catch(err => {
      console.log(err);
    });
}
loadMoreBtn.addEventListener('click', handleLoadMore);
