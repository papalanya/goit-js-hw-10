import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
}

refs.input.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function clearInput() {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
}

function searchCountry() {
    const searchInput = String(refs.input.value);
    clearInput();

    if (searchInput.trim()) {
        fetchCountries(searchInput)
            .then(countries => {
                if (countries.length > 10) {
                    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
                } else if (countries.length >= 2 && countries.length < 10) {
                    renderCountries(countries);
                } else {
                    renderInfo(countries);
                }
            }
        ).catch(error => {
            Notiflix.Notify.failure('Oops, there is no country with that name');
        });
    }
}

function renderCountries(countries = []) {
    clearInput();

    const markupContries = countries
    .map(({flag: {svg}, name: {official}}) => {
        return `
            <li class="country-list__item>
            <img class="country-list__icon" width="20px" src="${country.flag.svg}" alt="${country.name.official}">
            <p class="country-list__name">${country.name.official}</p>
            </li>    
        `;
    }).join('');
    refs.countryList.innerHTML = markupContries;
}

function renderInfo(countries = []) {
    clearInput();
    const markupContries = countries
      .map(country => {
        return `
          <div class="country-info__item">
            <img class="country-list__icon" src="${country.flags.svg}" alt="${
          country.name.official
        }" width="40px" height="30px" />
            <h2 class="country-info__title">${country.name.official}</h2>
          </div>
          <div class="article-wrapper">
            <p class="country-info__article">
              Capital:
            </p><span class="country-info__span">${country.capital}</span>
          </div>
          <div class="article-wrapper">
            <p class="country-info__article">
              Population:
            </p><span class="country-info__span">${country.population}</span>
          </div>
          <div class="article-wrapper">
            <p class="country-info__article">
              Languages:
            </p><span class="country-info__span">${Object.values(
              country.languages
            ).join(',')}</span>
          </div>
        `;
      })
      .join('');
    refs.countryInfo.innerHTML = markupContries;
  }
