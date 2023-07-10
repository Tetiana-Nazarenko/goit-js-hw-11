export function renderList(photos) {
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
