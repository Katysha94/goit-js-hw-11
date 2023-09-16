import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImg } from './api-service'

const inputEl = document.querySelector('#search-form input');
const searchButton = document.querySelector('button[type="submit"]');
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");
const gallerySimpleLightbox = new SimpleLightbox('.gallery a');

loadMoreBtn.style.display = 'none';

let pageNumber = 1;

searchButton.addEventListener('click', async (evt) => {
  evt.preventDefault();
  cleanGallery();
  const searchValue = inputEl.value.trim();
  if (searchValue !== '') {
    try {
        const foundData = await fetchImg(searchValue, pageNumber);
        console.log(foundData);
      if (foundData.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        renderImageList(foundData.hits);
        Notiflix.Notify.success(
          `Hooray! We found ${foundData.totalHits} images.`
        );
        loadMoreBtn.style.display = 'block';
        gallerySimpleLightbox.refresh();
      }
    } catch (error) {
      console.error(error);
      Notiflix.Notify.failure('Ooops...Something went wrong!');
    }
  }
});
  
loadMoreBtn.addEventListener('click', async () => {
    pageNumber++;
    const searchValue = inputEl.value.trim();
    loadMoreBtn.style.display = 'none';

    try {
        const foundData = await fetchImg(searchValue, pageNumber);
        console.log(foundData);
        if (foundData.hits.length === 0) {
            Notiflix.Notify.failure(
                'Sorry, there are no images matching your search query. Please try again.'
            );
        } else {
            renderImageList(foundData.hits);
            Notiflix.Notify.success(`Hooray! We found ${foundData.totalHits} images.`);
      
            loadMoreBtn.style.display = 'block';
        }
    } catch (error) {
        console.error(error);
        Notiflix.Notify.failure('Ooops...Something went wrong!');
    }
});

function renderImageList(images) {
  const markup = images
    .map((image) => {
      return `
        <div class="photo-card">
        <a href="${image.largeImageURL}">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy"/></a>
          <div class="stats">
            <p class="stats-item">
              Likes: ${image.likes}
            </p>
            <p class="stats-item">
              Views: ${image.views}
            </p>
            <p class="stats-item">
              Comments: ${image.comments}
            </p>
            <p class="stats-item">
              Downloads: ${image.downloads}
            </p>
          </div>
        </div>
      `;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

function cleanGallery() {
  gallery.innerHTML = '';
  pageNumber = 1;
  loadMoreBtn.style.display = 'none';
}
