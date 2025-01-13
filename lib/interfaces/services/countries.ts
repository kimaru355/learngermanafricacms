import { Country } from "../country";

export interface CountryServices {
    getCountry(name: string): Promise<Country | null>;
    getAllCountries(): Promise<Country[] | null>;
    createCountry(country: Country): Promise<Country | null>;
    updateCountry(country: Country): Promise<Country | null>;
    deleteCountry(id: string): Promise<boolean>;
}
