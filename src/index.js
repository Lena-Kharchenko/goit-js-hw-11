import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-aio';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchImgForm: document.getElementById('search-form'),
  imgNameInput: document.querySelector('input'),
  imgGallery: document.querySelector('.gallery'),
  API_KEY: '35661093-d03a926eaf01982ed473b40fb',
  API_URL: 'https://pixabay.com/api/',
};

let page = 0;

refs.searchImgForm.addEventListener('submit', onSubmitBtnClick);

function onSubmitBtnClick(event) {
  event.preventDefault();
  refs.imgGallery.innerHTML = '';
  page = 1;
  getImages();
}

async function getImages() {
  const { imgNameInput, API_KEY, API_URL } = refs;
  const paramsList = new URLSearchParams({
    key: API_KEY,
    q: imgNameInput.value.split(' ').join('+'),
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  });

  try {
    const response = await axios.get(
      `${API_URL}?${paramsList}&page=${page}&per_page=40`
    );
    return renderImgFunc(response);
  } catch (error) {
    console.log(error.message);
  }
}

function renderImgFunc(response) {
  if (!response.data.totalHits) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    if (response.data.hits.length < 40) {
      return Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
    if (page <= 1) {
      Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
    }

    const images = response.data.hits;
    const imgList = images
      .map(image => {
        return `<div class="photo-card">
	                    <a class="gallery__link" href="${image.largeImageURL}">
	                        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy"/>
	                            <div class="info">
	                                <p class="info-item">
	                                <b>Likes</b><br> <i>${image.likes}</i>
	                                </p>
	                                <p class="info-item">
	                                <b>Views</b><br> <i>${image.views}</i>
	                                </p>
	                                <p class="info-item">
	                                <b>Comments</b><br> <i>${image.comments}</i>
	                                </p>
	                                <p class="info-item">
	                                <b>Downloads</b><br> <i>${image.downloads}</i>
	                                </p>
	                            </div>
	                    </a>
	                </div>`;
      })
      .join(' ');
    page += 1;
    refs.imgGallery.insertAdjacentHTML('beforeend', imgList);
    gallery.refresh();
  }
}

var gallery = new SimpleLightbox('.gallery a', {});

// =========================================== SCROLL ==========================================================
function smoothScrollGallery() {
  const { height } =
    refs.galleryContainer.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: height * 2,
    behavior: 'smooth',
  });
}
