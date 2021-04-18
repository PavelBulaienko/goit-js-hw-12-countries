export default function fetchCountries(e) {
  return fetch(
    `https://restcountries.eu/rest/v2/name/${e.target.value}`,
  ).then(r => r.json());
}
