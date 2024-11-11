const axios = require('axios');

exports.getCountriesWithFlags = async (req, res) => {
  try {
    const countriesResponse = await axios.get('https://date.nager.at/api/v3/AvailableCountries');
    const countries = countriesResponse.data;

    const flagsResponse = await axios.get('https://countriesnow.space/api/v0.1/countries/flag/images');
    const flagsData = flagsResponse.data.data;

    const flagMap = {};
    flagsData.forEach(flag => {
      flagMap[flag.name] = flag.flag;
    });

    const countriesWithFlags = countries.map(country => ({
      name: country.name,
      countryCode: country.countryCode,
      flagUrl: flagMap[country.name] || null
    }));

    res.json(countriesWithFlags);
  } catch (error) {
    console.error('Error getting list of countries with flags:', error.message);
    res.status(500).json({ error: 'Error getting list of countries with flags:'});
  }
};

// Função para obter informações detalhadas do país
exports.getCountryInfo = async (req, res) => {
  const countryCode = req.params.countryCode.toUpperCase();

  try {
    const countryInfoResponse = await axios.get(`https://date.nager.at/api/v3/CountryInfo/${countryCode}`);
    const countryInfo = countryInfoResponse.data;
    const countryName = countryInfo.commonName;
    const borderCountryCodes = countryInfo.borders;

    const availableCountriesResponse = await axios.get('https://date.nager.at/api/v3/AvailableCountries');
    const availableCountries = availableCountriesResponse.data;
    const borderCountryNames = borderCountryCodes.map(code => {
      const country = availableCountries.find(c => c.countryCode === code);
      return country ? country.name : code;
    });

    const populationResponse = await axios.post('https://countriesnow.space/api/v0.1/countries/population', {
      country: countryName
    });
    const populationData = populationResponse.data.data.populationCounts;

    const flagResponse = await axios.post('https://countriesnow.space/api/v0.1/countries/flag/images', {
      country: countryName
    });
    const flagUrl = flagResponse.data.data.flag;

    const result = {
      countryName,
      flagUrl,
      borders: borderCountryNames,
      populationData,
    };

    res.json(result);
  } catch (error) {
    console.error('Error getting country information:', error.message);
    res.status(500).json({ error: 'Error getting country information' });
  }
};
