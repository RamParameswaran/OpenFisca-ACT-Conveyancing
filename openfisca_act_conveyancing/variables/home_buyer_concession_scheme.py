# Import from openfisca-core the Python objects used to code the legislation in OpenFisca
from openfisca_core.indexed_enums import Enum
from openfisca_core.periods import DAY
from openfisca_core.variables import Variable

# Import the Entities specifically defined for this tax and benefit system
from openfisca_act_conveyancing.entities import Household

import numpy


class PropertyType(Enum):
    __order__ = "new_home vacant_land established"
    new_home = "New Home"
    vacant_land = "Vacant Land"
    established = "Established home"


class property_type(Variable):
    value_type = Enum
    possible_values = PropertyType
    default_value = PropertyType.established
    entity = Household
    definition_period = DAY
    label = "Property type"
    reference = "https://www.revenue.act.gov.au/home-buyer-assistance/home-buyer-concession-scheme/transactions-entered-into-on-or-before-30-june-2019"


class all_buyers_are_18_years_old(Variable):
    value_type = bool
    entity = Household
    definition_period = DAY
    label = "Are all buyers at least 18 years old?"
    reference = "https://www.revenue.act.gov.au/home-buyer-assistance/home-buyer-concession-scheme/transactions-entered-into-on-or-before-30-june-2019"  # Always use the most official source
    default_value = False
    unit = "boolean"


class residence_requirements_satisfied(Variable):
    value_type = bool
    entity = Household
    definition_period = DAY
    label = "Will at least one of the owners live in the home continuously for at least one year?"
    reference = "https://www.revenue.act.gov.au/home-buyer-assistance/home-buyer-concession-scheme/transactions-entered-into-on-or-before-30-june-2019"  # Always use the most official source
    default_value = False
    unit = "boolean"


class property_requirements_satisfied(Variable):
    value_type = bool
    entity = Household
    definition_period = DAY
    label = "No buyer has owned a property in the previous two years"
    reference = "https://www.revenue.act.gov.au/home-buyer-assistance/home-buyer-concession-scheme/transactions-entered-into-on-or-before-30-june-2019"  # Always use the most official source
    default_value = False
    unit = "boolean"


class household_income(Variable):
    value_type = float
    entity = Household
    definition_period = DAY
    label = "Gross household income"
    reference = "https://www.revenue.act.gov.au/home-buyer-assistance/home-buyer-concession-scheme"  # Always use the most official source
    default_value = 0
    unit = "currency-AUD"


class number_dependent_children(Variable):
    value_type = int
    entity = Household
    definition_period = DAY
    label = "Number of dependent children"
    reference = "https://www.revenue.act.gov.au/home-buyer-assistance/home-buyer-concession-scheme/transactions-entered-into-on-or-before-30-june-2019"  # Always use the most official source
    default_value = 0
    unit = "number"


class household_income_requirement_satisfied(Variable):
    value_type = bool
    entity = Household
    definition_period = DAY
    label = "No buyer has owned a property in the previous two years"
    reference = "https://www.revenue.act.gov.au/home-buyer-assistance/home-buyer-concession-scheme/transactions-entered-into-on-or-before-30-june-2019"  # Always use the most official source
    default_value = False
    unit = "boolean"

    def formula(household, period, parameters):
        number_dependent_children = household("number_dependent_children", period)
        household_income = household("household_income", period)

        return household_income <= parameters(period).home_buyer_concession_scheme.income_threshold.calc(number_dependent_children)


class eligible_for_home_buyer_concession(Variable):
    value_type = bool
    entity = Household
    definition_period = DAY
    label = "No buyer has owned a property in the previous two years"
    reference = "https://www.revenue.act.gov.au/home-buyer-assistance/home-buyer-concession-scheme/transactions-entered-into-on-or-before-30-june-2019"  # Always use the most official source
    default_value = False
    unit = "boolean"

    def formula(household, period, parameters):
        """
        Home Buyer Concession (until 30 June 2019)

        The ACT Government has a concession scheme to help people buy a home or residential land. The scheme is administered by the ACT Revenue Office.
        """

        home_is_new_or_vacant = (household("property_type", period) == PropertyType.vacant_land) + (household("property_type", period) == PropertyType.new_home)
        all_buyers_are_18_years_old = household("all_buyers_are_18_years_old", period) 
        residence_requirements_satisfied = household("residence_requirements_satisfied", period) 
        property_requirements_satisfied = household("property_requirements_satisfied", period) 
        household_income_requirement_satisfied = household("household_income_requirement_satisfied", period)

        return home_is_new_or_vacant * all_buyers_are_18_years_old * residence_requirements_satisfied * property_requirements_satisfied * household_income_requirement_satisfied

    def formula_2019_07_01(household, period, parameters):
        """
        Home Buyer Concession (from 01 July 2019 onwards)

        The ACT Government has a concession scheme to help people buy a home or residential land. The scheme is administered by the ACT Revenue Office.
        """

        all_buyers_are_18_years_old = household("all_buyers_are_18_years_old", period) 
        residence_requirements_satisfied = household("residence_requirements_satisfied", period) 
        property_requirements_satisfied = household("property_requirements_satisfied", period) 
        household_income_requirement_satisfied = household("household_income_requirement_satisfied", period)

        return all_buyers_are_18_years_old * residence_requirements_satisfied * property_requirements_satisfied * household_income_requirement_satisfied


class conveyance_duty_under_HBCS(Variable):
    value_type = float
    entity = Household
    definition_period = DAY
    label = "Conveyance Duty Under HBCS"
    reference = "https://www.revenue.act.gov.au/home-buyer-assistance/home-buyer-concession-scheme"  # Always use the most official source
    default_value = 0
    unit = "currency-AUD"

    def formula(household, period, parameters):
        """
        Conveyance Duty Under the Home Buyers Concession Scheme.

        The ACT Government has a concession scheme to help people buy a home or residential land. The scheme is administered by the ACT Revenue Office.
        """

        property_is_new = household("property_type", period) == PropertyType.new_home
        property_is_vacant_land = household("property_type", period) == PropertyType.vacant_land

        property_price = household("property_price", period)

        conveyance_HBCS_new = parameters(period).home_buyer_concession_scheme.conveyance_duty_schedule.new_home.calc(property_price)
        conveyance_HBCS_vacant_land = parameters(period).home_buyer_concession_scheme.conveyance_duty_schedule.vacant_land.calc(property_price)

        return numpy.select(
            [property_is_new, property_is_vacant_land], [conveyance_HBCS_new, conveyance_HBCS_vacant_land]
        )

    def formula_2019_07_01(household, period, parameters):
        """
        Conveyance Duty Under the Home Buyers Concession Scheme.

        The ACT Government has a concession scheme to help people buy a home or residential land. The scheme is administered by the ACT Revenue Office.
        """

        return 0