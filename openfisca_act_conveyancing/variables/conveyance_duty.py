# Import from openfisca-core the Python objects used to code the legislation in OpenFisca
from openfisca_core.indexed_enums import Enum
from openfisca_core.periods import DAY
from openfisca_core.variables import Variable

# Import the Entities specifically defined for this tax and benefit system
from openfisca_act_conveyancing.entities import Household, Person

import numpy

# Possible values for the land_use_type variable, defined further down
class LandUseType(Enum):
    __order__ = "rural residential commercial"
    rural = "Rural"
    residential = "Residential"
    commercial = "Commercial"


class land_use_type(Variable):
    value_type = Enum
    possible_values = LandUseType
    default_value = LandUseType.residential
    entity = Household
    definition_period = DAY
    label = "Declared land use type"
    reference = [
        "https://www.revenue.act.gov.au/duties/conveyance-duty?result_1060955_result_page=2",
        "https://www.revenue.act.gov.au/duties/conveyance-duty",
    ]  # You can list multiple sources in a list


class property_price(Variable):
    value_type = float
    entity = Household
    definition_period = DAY
    label = "Purchase price or market value of home and land"
    reference = "https://www.revenue.act.gov.au/duties/conveyance-duty"  # Always use the most official source
    default_value = 0
    unit = "currency-AUD"


class conveyance_duty(Variable):
    value_type = float
    entity = Household
    definition_period = DAY
    label = "Conveyance Duty"
    reference = "https://www.revenue.act.gov.au/duties/conveyance-duty"  # Always use the most official source
    default_value = 0
    unit = "currency-AUD"

    def formula_2017_06_07(household, period, parameters):
        """
        Conveyance Duty.

        Conveyance duty, commonly known as stamp duty, is a tax you pay when you buy property in the ACT, whether it’s a home, land, or a commercial property.
        The amount of duty you pay depends on the property’s purchase price or market value.
        """

        is_residential_or_rural = (household("land_use_type", period) == LandUseType.rural) + (household("land_use_type", period) == LandUseType.residential)
        is_commercial = (household("land_use_type", period) == LandUseType.commercial)

        property_price = household("property_price", period)

        ### Commercial properties
        # Calculate the duty for commercial property
        conveyance_commercial = numpy.where(
            property_price >= parameters(period).conveyance_duty_schedule.commercial.minimum_threshold,
            parameters(period).conveyance_duty_schedule.commercial.rate.calc(property_price),
            0,
        )
        # Now apply the minimum duty (if applicable)
        conveyance_commercial = numpy.maximum(conveyance_commercial, parameters(period).conveyance_duty_schedule.commercial.minimum_duty)

        ### Residential properties
        # Calculate the duty for residential property
        conveyance_residential = numpy.where(
            property_price >= parameters(period).conveyance_duty_schedule.residential.minimum_threshold,
            parameters(period).conveyance_duty_schedule.residential.rate.calc(property_price),
            0,
        )
        # Now apply the minimum duty (if applicable)
        conveyance_residential = numpy.maximum(conveyance_residential, parameters(period).conveyance_duty_schedule.residential.minimum_duty)

        return numpy.select(
            [is_residential_or_rural, is_commercial], [conveyance_residential, conveyance_commercial]
        )
