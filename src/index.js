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
  loadMoreBtn.style.display = 'none';
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

         if (foundData.totalHits > 40) {
          loadMoreBtn.style.display = 'block';
        }
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

loadMoreBtn.addEventListener('click', loadMore);

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    loadMore();
  }
});
async function loadMore() {
  pageNumber++;
  const searchValue = inputEl.value.trim();
  try {
    const foundData = await fetchImg(searchValue, pageNumber);
    let allPages = Math.ceil(foundData.totalHits / 40);
    console.log(foundData);
    const markup = renderImageList(foundData.hits);
    gallery.insertAdjacentHTML('beforeend', markup);
    gallerySimpleLightbox.refresh();
    if (allPages < pageNumber + 1) {
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      loadMoreBtn.style.display = 'none';
    }
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure('Ooops...Something went wrong!');
  }
}



function cleanGallery() {
  gallerySimpleLightbox.close();
  gallery.innerHTML = '';
  pageNumber = 1;
  loadMoreBtn.style.display = 'none';
}