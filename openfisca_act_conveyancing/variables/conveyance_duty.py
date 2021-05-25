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

    def formula(household, period, parameters):
        """
        Conveyance Duty.

        Conveyance duty, commonly known as stamp duty, is a tax you pay when you buy property in the ACT, whether it’s a home, land, or a commercial property.
        The amount of duty you pay depends on the property’s purchase price or market value.
        """
        # We just need two inputs from the user: `land_type` and `property_price` (...and date)
        land_type = household("land_use_type", period)
        property_price = household("property_price", period)


        # Group `land_type` into "is_residential_or_rural" and "is_commercial"
        is_residential_or_rural = (land_type == LandUseType.rural) + (land_type == LandUseType.residential)
        is_commercial = (land_type == LandUseType.commercial)

        ### Calculate the duty for commercial properties
        conveyance_commercial = numpy.where(
            property_price >= parameters(period).conveyance_duty_schedule.commercial.minimum_threshold,
            parameters(period).conveyance_duty_schedule.commercial.rate.calc(property_price),
            0,
        )

        ### Calculate the duty for residential properties
        conveyance_residential = numpy.where(
            property_price >= parameters(period).conveyance_duty_schedule.residential.minimum_threshold,
            parameters(period).conveyance_duty_schedule.residential.rate.calc(property_price),
            0,
        )

        # Conditionally return `conveyance_residential` or `conveyance_commercial` where applicable
        return numpy.select(
            [is_residential_or_rural, is_commercial], [conveyance_residential, conveyance_commercial]
        )
