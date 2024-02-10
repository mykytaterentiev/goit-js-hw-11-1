import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.querySelector('.search-form');
const pictures = document.querySelector('.gallery');
const spanLoader = document.querySelector('.loader');

hideLoader();
searchForm.addEventListener('submit', searchImage);
function searchImage(event) {
    event.preventDefault();
    const image = event.target.elements.image.value.trim();
    if (image === '') {
        pictures.innerHTML = "";
        iziToast.show({
            title: 'Error',
            message: 'Please enter a search term to begin your search.',
            titleSize: '16px',
            titleLineHeight: '150%',
            messageSize: '16px',
            messageLineHeight: '150%',
            backgroundColor: '#ef4040',
            position: 'bottomRight',
        });
        return;
    } else {
        showLoader();
        getImage(image).then(data => {
            if (data.totalHits > 0) {
                const markup = data.hits.map(imageTemplate).join('\n\n');
                pictures.innerHTML = markup;
                gallery.refresh();
            } else {
                pictures.innerHTML = "";
                iziToast.show({
                    title: 'Error',
                    message: 'There are no images matching your search query. Please try again!',
                    titleSize: '16px',
                    titleLineHeight: '150%',
                    messageSize: '16px',
                    messageLineHeight: '150%',
                    backgroundColor: '#ef4040',
                    position: 'bottomRight',
                });
            }
        }).catch(error => console.error(error)) .finally(() => {
        hideLoader();
    });
    }
    evt.target.reset(); 
}

function getImage(imageName) {
    const BASE_URL = 'https://pixabay.com/api/';
    const PARAMS = `?key=42174217-6daf07c41ac875e98ae2151fa&q=${imageName}&image_type=photo&orientation=horizontal&safesearch=true`;
    const url = BASE_URL + PARAMS;
    
    return fetch(url).then(response => {
        if (!response.ok) {
            throw new Error(response.status);
        }
        return response.json();
    }); 
}

function imageTemplate ({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) {
    return `<li class="gallery-item"><a href="${largeImageURL}"><img class="gallery-image" src="${webformatURL}" alt="${tags}" /></a>
<div class="description"> <p>Likes <span>${likes}</span></p><p>Views <span>${views}</span></p><p>Comments <span>${comments}</span></p><p>Downloads <span>${downloads}</span></p></div></li>`;
}

const gallery = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
});

function showLoader() {
    spanLoader.style.display = 'block';
    
}

function hideLoader() {
    spanLoader.style.display = 'none';
}