import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImg } from './api-service';
import { renderImageList } from './createMarkup';

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
        const markup = renderImageList(foundData.hits);
        gallery.innerHTML = markup;

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
    const markup = renderImageList(foundData.hits);
      gallery.insertAdjacentHTML('beforeend', markup);
      gallerySimpleLightbox.refresh();
       if (gallery.querySelectorAll('.gallery__item').length >= foundData.totalHits) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    } else {
      loadMoreBtn.style.display = 'block';
    }
    } catch (error) {
        console.error(error);
        Notiflix.Notify.failure('Ooops...Something went wrong!');
    }
});


function cleanGallery() {
  gallerySimpleLightbox.close();
  gallery.innerHTML = '';
  pageNumber = 1;
  loadMoreBtn.style.display = 'none';
}
