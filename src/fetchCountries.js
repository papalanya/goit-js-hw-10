const filterOptions = '?fields=name,capital,population,flags,languages';

export function fetchCountries(name) {
    const url = `https://restcountries.com/v3.1/name/{name}`;

    return fetch(url + filterOptions)
        .then(response => {
            if(response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        })
        .then(countries => {
            return countries;
        });
}
