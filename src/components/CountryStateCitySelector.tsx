import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import {Select,SelectTrigger,SelectContent,SelectItem,SelectValue} from "@/components/ui/select";

// Define the expected structure of State and City objects
interface StateType {
    isoCode: string;
    name: string;
}

interface CityType {
    name: string;
}

interface CountryStateCitySelectorProps {
    onChange?: (data: {
        country: string | null;
        state: string | null;
        city: string | null;
    }) => void;

    value?: {
        country: string | null;
        state: string | null;
        city: string | null;
    };
}

const CountryStateCitySelector: React.FC<CountryStateCitySelectorProps> = ({
    onChange, value
}) => {
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);

    const [states, setStates] = useState<StateType[]>([]);
    const [cities, setCities] = useState<CityType[]>([]);

    useEffect(() => {
        onChange?.({
            country: selectedCountry,
            state: selectedState,
            city: selectedCity,
        });
    }, [selectedCountry, selectedState, selectedCity, onChange]);

    const handleCountryChange = (countryCode: string) => {
        setSelectedCountry(countryCode);
        const statesData = State.getStatesOfCountry(countryCode);
        setStates(statesData);
        setSelectedState(null);
        setCities([]);
        setSelectedCity(null);
    };

    useEffect(() => {
  if (value?.country) {
    setSelectedCountry(value.country);
    const statesData = State.getStatesOfCountry(value.country);
    setStates(statesData);

    if (value?.state) {
      setSelectedState(value.state);
      const citiesData = City.getCitiesOfState(value.country, value.state);
      setCities(citiesData);

      if (value?.city) {
        setSelectedCity(value.city);
      }
    }
  }
}, [value]);
    

    const handleStateChange = (stateCode: string) => {
        setSelectedState(stateCode);
        if (selectedCountry) {
            const citiesData = City.getCitiesOfState(selectedCountry, stateCode);
            setCities(citiesData);
        }
        setSelectedCity(null);
    };

    const handleCityChange = (cityName: string) => {
        setSelectedCity(cityName);
    };

    return (
        <div className="flex w-full flex-wrap gap-4 justify-between md:justify-start">
            {/* Country Selector */}
            <div className="w-full flex flex-col gap-1">
                <label className="text-sm font-semibold">Country</label>
                <Select
                key={selectedCountry}
                    value={selectedCountry || ""}
                    onValueChange={handleCountryChange}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a Country" />
                    </SelectTrigger>
                    <SelectContent>
                        {Country.getAllCountries().map((country) => (
                            <SelectItem key={country.isoCode} value={country.isoCode}>
                                {country.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* State Selector */}
            {states.length > 0 && (
                <div className="w-full flex flex-col gap-1">
                    <label className="text-sm font-semibold">State</label>
                    <Select
                        value={selectedState || ""}
                        onValueChange={handleStateChange}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a State" />
                        </SelectTrigger>
                        <SelectContent>
                            {states.map((state) => (
                                <SelectItem key={state.isoCode} value={state.isoCode}>
                                    {state.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* City Selector */}
            {cities.length > 0 && (
                <div className="w-full flex flex-col gap-1">
                    <label className="text-sm font-semibold">City</label>
                    <Select
                        value={selectedCity || ""}
                        onValueChange={handleCityChange}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a City" />
                        </SelectTrigger>
                        <SelectContent>
                            {cities.map((city, index) => (
                                <SelectItem key={`${city.name}-${index}`} value={city.name}>
                                    {city.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>
    );
};

export default CountryStateCitySelector;
