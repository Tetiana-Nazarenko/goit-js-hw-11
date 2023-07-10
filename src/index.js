import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

import Notiflix from 'notiflix';

import { renderList } from './renderHtml';

// *** Pixabay-API ***
import { PixabayAPI } from './pixabayApi';

//*** GALLERY ***
const searchForm = document.querySelector('.search-form');

const textInput = searchForm.firstElementChild;
const gallery = document.querySelector('.gallery');

const loadMoreBtn = document.querySelector('.load-more');

//***  ***/
const pixabayInstance = new PixabayAPI();
let islabelActive = false;

loadMoreBtn.classList.add('is-hidden');

//*** FUNCTION SEARCHFORMSUBMIT ***/

const handleSearchFormSubmit = event => {
  event.preventDefault();

  const searchQuery = textInput.value.trim();

  if (!searchForm) {
    return;
  }

  if (searchQuery === '') {
    return Notiflix.Notify.failure('Sorry, please enter your request!');
  }

  pixabayInstance.query = searchQuery;
  islabelActive = true;

  pixabayInstance
    .fetchPhotos()
    .then(data => {
      console.log(data);

      if (!data.hits.length) {
        loadMoreBtn.classList.add('is-hidden');
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );

        return;
      }

      if (data.hits.length < pixabayInstance.per_page) {
        loadMoreBtn.classList.add('is-hidden');
      }

      Notiflix.Notify.success(
        `Hooray! We found totalHits images${data.totalHits}.`
      );

      gallery.innerHTML = renderList(data.hits);

      lightbox.on('schown.simplelightbox');
      lightbox.refresh();

      //***SMOOTH-SCROLL ***/
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

//***SIMPLELEIGHTBOX ***/
let lightbox = new SimpleLightbox('.gallery a', {
  /* options */
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

//*** FUNCTION LOAD-MORE */

function handleLoadMore() {
  pixabayInstance.page += 1;

  pixabayInstance
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
