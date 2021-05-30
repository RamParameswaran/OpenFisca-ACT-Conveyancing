import moment from 'moment';

import OpenFiscaApiBase from './api_base';

// Note the change in url for openfisca-djangoapi
function calculate_conveyance_duty(date, property_price, land_use_type) {
  return OpenFiscaApiBase({
    url: '/calculate/',
    method: 'POST',
    data: {
      persons: {
        'person 1': {},
      },
      households: {
        household_1: {
          conveyance_duty: {
            [date]: null,
          },
          conveyance_duty_under_HBCS: {
            [date]: null,
          },
          property_price: {
            [date]: property_price,
          },
          property_type: {
            [date]: 'new_home',
          },
          land_use_type: {
            [date]: land_use_type,
          },
        },
      },
    },
  });
}

function calculate_HBCS_eligibility(
  date,
  all_buyers_are_18_years_old,
  residence_requirements_satisfied,
  property_requirements_satisfied,
  household_income,
  number_dependent_children,
  eligible_for_home_buyer_concession,
) {
  return OpenFiscaApiBase({
    url: '/calculate/',
    method: 'POST',
    data: {
      persons: {
        'person 1': {},
      },
      households: {
        household_1: {
          property_type: {
            [date]: 'new_home',
          },
          eligible_for_home_buyer_concession: {
            [date]: eligible_for_home_buyer_concession,
          },
          all_buyers_are_18_years_old: {
            [date]: all_buyers_are_18_years_old,
          },
          residence_requirements_satisfied: {
            [date]: residence_requirements_satisfied,
          },
          property_requirements_satisfied: {
            [date]: property_requirements_satisfied,
          },
          household_income: {
            [date]: household_income,
          },
          number_dependent_children: {
            [date]: number_dependent_children,
          },
        },
      },
    },
  });
}

function calculate_conveyance_duty_simulation(price_array) {
  var price_array_new = {};
  price_array.map((item) => {
    console.log(item[0]);
    console.log(new Date(item[0]));
    price_array_new[moment(new Date(item[0])).format('YYYY-MM-DD')] = item[1];
  });

  console.log(price_array_new);

  return OpenFiscaApiBase({
    url: '/calculate/',
    method: 'POST',
    data: {
      persons: {
        'person 1': {},
      },
      households: {
        household_1: {
          conveyance_duty: {
            '2017-06-07': null,
            '2017-09-01': null,
            '2017-12-01': null,
            '2018-03-01': null,
            '2018-06-01': null,
            '2018-09-01': null,
            '2018-12-01': null,
            '2019-03-01': null,
            '2019-06-01': null,
            '2019-09-01': null,
            '2019-12-01': null,
            '2020-03-01': null,
            '2020-06-01': null,
            '2020-09-01': null,
            '2020-12-01': null,
          },
          conveyance_duty_under_HBCS: {
            '2017-06-07': null,
            '2017-09-01': null,
            '2017-12-01': null,
            '2018-03-01': null,
            '2018-06-01': null,
            '2018-09-01': null,
            '2018-12-01': null,
            '2019-03-01': null,
            '2019-06-01': null,
            '2019-09-01': null,
            '2019-12-01': null,
            '2020-03-01': null,
            '2020-06-01': null,
            '2020-09-01': null,
            '2020-12-01': null,
          },
          property_price: price_array_new,
          property_type: {
            '2017-06-07': 'new_home',
            '2017-09-01': 'new_home',
            '2017-12-01': 'new_home',
            '2018-03-01': 'new_home',
            '2018-06-01': 'new_home',
            '2018-09-01': 'new_home',
            '2018-12-01': 'new_home',
            '2019-03-01': 'new_home',
            '2019-06-01': 'new_home',
            '2019-09-01': 'new_home',
            '2019-12-01': 'new_home',
            '2020-03-01': 'new_home',
            '2020-06-01': 'new_home',
            '2020-09-01': 'new_home',
            '2020-12-01': 'new_home',
          },
          land_use_type: {
            '2017-06-07': 'residential',
            '2017-09-01': 'residential',
            '2017-12-01': 'residential',
            '2018-03-01': 'residential',
            '2018-06-01': 'residential',
            '2018-09-01': 'residential',
            '2018-12-01': 'residential',
            '2019-03-01': 'residential',
            '2019-06-01': 'residential',
            '2019-09-01': 'residential',
            '2019-12-01': 'residential',
            '2020-03-01': 'residential',
            '2020-06-01': 'residential',
            '2020-09-01': 'residential',
            '2020-12-01': 'residential',
          },
        },
      },
    },
  });
}

const OpenFiscaApi = {
  calculate_conveyance_duty,
  calculate_HBCS_eligibility,
  calculate_conveyance_duty_simulation,
};

export default OpenFiscaApi;
