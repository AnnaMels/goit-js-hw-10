import './css/styles.css';
import countriesData from './fetchCountries.js';
import { debounce } from 'throttle-debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.getElementById('search-box'),
    conutryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(DEBOUNCE_DELAY, () => {
    const searchQuery = refs.input.value.trim();

    if (!searchQuery) {
        refs.conutryList.innerHTML = '';
        return;
    };

    countriesData(searchQuery).then(countries => {
        if (countries.length > 1) {
            refs.countryInfo.innerHTML = '';
            const markup = countries.map(country => {
                return `<li><img src="${country.flags.svg}"/>${country.name.official}</li>`
            }).join('');
            refs.conutryList.innerHTML = markup;
        }

        if (countries.length === 1) {
                refs.conutryList.innerHTML = '';
                const markup = countries.map(country => {
                return `<div class="wrapper"><img src="${country.flags.svg}"/><h1>${country.name.official}</h1></div><ul class="country-info-list"><li><b>Capital:</b> ${country.capital}</li><li><b>Population:</b> ${country.population}</li><li><b>Languages:</b> ${Object.values(country.languages)}</li></ul>`
                }).join('');
            refs.countryInfo.innerHTML = markup;
            }

        if (countries.length > 10) {
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
            refs.conutryList.innerHTML = '';
        };
    }).catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name')
    });
}));

