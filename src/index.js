import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

let country = '';

refs.input.addEventListener('input', debounce(searchInput, DEBOUNCE_DELAY));

function clearMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function searchInput(e) {
  clearMarkup();
  country = e.target.value.trim();
  fetchCountries(country).then(createMarkup).catch(onError);
}

function onError(error) {
  // if (error.message === '404') {
    return Notiflix.Notify.failure('Oops, there is no country with that name');
  // }
  // return Notiflix.Notify.failure(`Oops, server error:"${error}"`);
}

function createMarkup(data) {
  if (data.length > 10) {
    clearMarkup();
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (data.length >= 2 && data.length <= 10) {
    markupCountiesList(data);
  } else {
    markupCountryInfo(data);
  } 
}

function markupCountiesList(data) {
  clearMarkup();
  const markupList = data
    .map(country => {
      return `<li class="country-list__item">
            <img class="country-list__icon"src=${country.flag.svg} width=40>
            <h2 class="country-list__name">${country.name.official}</h2>
            </li>`;
    })
    .join('');

  refs.countryList.insertAdjacentHTML('afterbegin', markupList);
}

function markupCountryInfo(data) {
  clearMarkup();
  const markupInfo = data
    .map(country => {
      return `<div class="country-info__item">
                <img class="country-list__icon" src="${
                  country.flags.svg
                }" alt="${country.name.official}" width="40px" height="30px" />
                <h2 class="country-info__title">${country.name.official}</h2>
              </div>
              <div class="article-wrapper">
                <p class="country-info__article">Capital:</p><span class="country-info__span">${
                  country.capital
                }</span>
              </div>
              <div class="article-wrapper">
                <p class="country-info__article">Population:</p><span class="country-info__span">${
                  country.population
                }</span>
              </div>
              <div class="article-wrapper">
                <p class="country-info__article">Languages:</p><span class="country-info__span">${Object.values(
                  country.languages
                ).join(',')}</span>
              </div>
            `;
    })
    .join('');

  refs.countryInfo.insertAdjacentHTML('afterbegin', markupInfo);
}
