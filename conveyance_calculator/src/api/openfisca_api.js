import OpenFiscaApiBase from './api_base';

// Note the change in url for openfisca-djangoapi
function calculate_conveyance_duty(date, property_price, land_use_type ) {
  return OpenFiscaApiBase({
    url: '/calculate/',
    method: 'POST',
    data: {
      "persons": {
        "person 1": {}
      },
      "households": {
        "household_1": {
          "conveyance_duty": {
            [date]: null
          },
          "conveyance_duty_under_HBCS": {
            [date]: null
          },
          "property_price": {
            [date]: property_price
          },
          "property_type": {
            [date]: "new_home"
          },
          "land_use_type": {
            [date]: land_use_type
          }
        }
      }
    },
  });
}

const OpenFiscaApi = {
  calculate_conveyance_duty
};

export default OpenFiscaApi;
