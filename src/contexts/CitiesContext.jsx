import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

const CitiesContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };

    case "rejected":
      return { ...state, error: action.payload, isLoading: false };

    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };

    default:
      throw new Error("Unknown action type");
  }
}
const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};
function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    const storedCities = localStorage.getItem("cities");
    if (storedCities) {
      dispatch({ type: "cities/loaded", payload: JSON.parse(storedCities) });
    } else {
      // Optionally, you can load some default cities here if localStorage is empty
      dispatch({ type: "cities/loaded", payload: [] });
    }
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (currentCity.id === Number(id)) return;

      dispatch({ type: "loading" });
      try {
        const city = cities.find((city) => city.id === Number(id));
        dispatch({ type: "city/loaded", payload: city });
      } catch (error) {
        dispatch({
          type: "rejected",
          payload: "there is an error loading the city",
        });
      }
    },
    [currentCity.id, cities]
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });

    try {
      const cityWithId = { ...newCity, id: Date.now() }; // Assign a unique ID
      const updatedCities = [...cities, cityWithId];
      localStorage.setItem("cities", JSON.stringify(updatedCities));
      dispatch({ type: "city/created", payload: cityWithId });
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: "there is an error creating the city",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });

    try {
      const updatedCities = cities.filter(
        (city) => String(city.id) !== String(id)
      );
      localStorage.setItem("cities", JSON.stringify(updatedCities));
      dispatch({ type: "city/deleted", payload: id });
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: "there is an error deleting the city",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("useCities must be used within a CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
