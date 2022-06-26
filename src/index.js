import { fetchCountries } from './js/fetchCountries';
import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
 

const refs = {
    searchbox: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

refs.searchbox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
   
    const inputValue = event.target.value.trim();
    
    if (inputValue === '') {
        cleanMarkup();
     return;
    }

    fetchCountries(inputValue)
        .then(country => {
        
            const countryLength = country.length;
            
         if (countryLength === 1) {
            
            cleanMarkup();   
        
          refs.countryInfo.innerHTML = makeCountryCardMarkup(country);
          
            } else if (countryLength > 10) {
              cleanMarkup();
              Notify.info("Too many matches found. Please enter a more specific name.");
          return;
            } 
            else {
               cleanMarkup();
               refs.countryList.innerHTML = makeCountryListMarkup(country);
          return;
        }
        
       }).catch(error => {
           
       Notify.failure("Oops, there is no country with that name");
    });
    cleanMarkup();
};


function makeCountryListMarkup(countries) {
    return countries.map(({name,flags}) => {
        return `
       <li class="country-list-item">
       <img  src="${flags.svg}" alt=="Flag of ${name.official}" width="30" height="30">
       <h2 >${name.official}</h2>
       </li>
       ` 
    }).join('')
};

function makeCountryCardMarkup(country) {
    return country.map(({ name, capital, population, flags, languages }) => {
        return `
        <div class="country-info-wrapper">
        <img src="${flags.svg}" alt="flag:${name.official}" width="30" height="30">
        <h2>${name.official}</h2>
        </div>
        <p><b>Capital:</b> ${capital}</p>
        <p><b>Population:</b> ${population}</p>
        <p><b>Languages:</b> ${Object.values(languages).join(', ')}</p>
        `
    }).join('');
};


function cleanMarkup() {
     refs.countryList.innerHTML = '';
     refs.countryInfo.innerHTML = '';
};


