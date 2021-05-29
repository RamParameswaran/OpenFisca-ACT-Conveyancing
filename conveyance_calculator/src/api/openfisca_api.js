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

function calculate_HBCS_eligibility(date, all_buyers_are_18_years_old, residence_requirements_satisfied, property_requirements_satisfied, household_income, number_dependent_children, eligible_for_home_buyer_concession ) {
  return OpenFiscaApiBase({
    url: '/calculate/',
    method: 'POST',
    data: {
      "persons": {
        "person 1": {}
      },
      "households": {
        "household_1": {
          "eligible_for_home_buyer_concession": {
            [date]: eligible_for_home_buyer_concession
          },
          "all_buyers_are_18_years_old": {
            [date]: all_buyers_are_18_years_old
          },
          "residence_requirements_satisfied": {
            [date]: residence_requirements_satisfied
          },
          "property_requirements_satisfied": {
            [date]: property_requirements_satisfied
          },
          "household_income": {
            [date]: household_income
          },
          "number_dependent_children": {
            [date]: number_dependent_children
          }
        }
      }
    },
  });
}

const OpenFiscaApi = {
  calculate_conveyance_duty,
  calculate_HBCS_eligibility
};

export default OpenFiscaApi;
