import './styles.css';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/mobile/dist/PNotifyMobile.css';

import { debounce } from 'lodash';
import {
  alert,
  defaultModules,
} from '../node_modules/@pnotify/core/dist/PNotify.js';
import * as PNotifyMobile from '../node_modules/@pnotify/mobile/dist/PNotifyMobile.js';
defaultModules.set(PNotifyMobile, {});
import countryHbs from './templates/country.hbs';
import fetchCountries from './js/fetchCountries';

const countryOptions = {};
const inputRef = document.querySelector('.input');
const countryDescpRef = document.querySelector('.countryDescp');

const countriesNames = [];
const alertOptions = {
  text: 'Too many matches found. Please enter a more specific query.',
  title: false,
  closer: false,
  sticker: false,
  delay: 1500,
  addClass: 'alert',
};

function createCountryMarkup(country) {
  return [country].map(countryHbs).join('');
}

function renderCountry(country) {
  const countryMarkup = createCountryMarkup(country);
  countryDescpRef.insertAdjacentHTML('beforeend', countryMarkup);
}

const countriesListRef = document.querySelector('.countriesList');

inputRef.addEventListener('input', _.debounce(onInputChange, 500));

function onInputChange(e) {
  if (countriesNames[0] !== undefined) {
    clearList();
  }
  countriesNames.splice(0, countriesNames.length);
  clearCountryMarkup();
  fetchCountries(e)
    .then(countries => {
      countries.map(country => {
        if (countries.length === 1) {
          countryOptions.name = country.name;
          countryOptions.capital = country.capital;
          countryOptions.population = country.population;
          countryOptions.languages = [];
          for (let key in country.languages) {
            countryOptions.languages.push(country.languages[key].name);
          }
          countryOptions.flag = country.flag;
          renderCountry(countryOptions);
        }
        return countriesNames.push(country.name);
      });
    })
    .then(() => {
      renderList(countriesNames);
      notificationCheck();
    })
    .catch(err => {
      alert(alertOptions);
      console.log(err);
    });
}

function renderList(countriesArr) {
  if (countriesArr.length <= 10 && countriesArr.length >= 2) {
    const ulRef = document.createElement('ul');
    countriesArr.forEach(element => {
      const liRef = document.createElement('li');
      liRef.textContent = element;
      ulRef.append(liRef);
    });
    countriesListRef.append(ulRef);
  }
}

function clearList() {
  countriesListRef.innerHTML = '';
}

function notificationCheck() {
  if (countriesNames.length > 10) {
    alert(alertOptions);
  }
}

function clearCountryMarkup() {
  countryDescpRef.innerHTML = '';
}
