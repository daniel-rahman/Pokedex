import type { ChangeEvent } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import PokemonCard from "./components/PokemonCard";
import PaginationControls from "./components/PaginationControls";

//add to .env
const API_BASE_URL = "http://localhost:8080";

interface Pokemon {
  number: number;
  name: string;
  type_one: string;
  type_two: string | null;
  total: number;
  hit_points: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
  generation: number;
  legendary: boolean;
  is_captured: boolean;
}

type Theme = "light" | "dark";

function App() {
  const [itemsPerPage, setItemsPerPage] = useState<number>(() => {
    return Number(localStorage.getItem("itemsPerPage"));
  });

  const [currentPage, setCurrentPage] = useState<number>(() => {
    return Number(localStorage.getItem("currentPage"));
  });

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(() => {
    const sortOrder = localStorage.getItem("sortOrder");
    return sortOrder as "asc" | "desc";
  });

  const [selectedType, setSelectedType] = useState<string>(() => {
    const type = localStorage.getItem("selectedType");
    return type ?? "";
  });

  const [theme, setTheme] = useState<Theme>(() => {
    let savedTheme = localStorage.getItem("theme") as Theme | null;
    if (!savedTheme) {
      savedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return savedTheme;
  });

  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total_items, setTotal_items] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("currentPage", JSON.stringify(currentPage));
  }, [currentPage]);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const typeQuery = selectedType || "all";
        const response = await axios.get(`${API_BASE_URL}/pokemon`, {
          params: {
            page: currentPage,
            page_size: itemsPerPage,
            sort_order: sortOrder,
            sort_by: "number",
            type: typeQuery,
          },
        });

        setPokemonList(response.data.pokemon);
        setCurrentPage(response.data.current_page);
        setTotal_items(response.data.total_items);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error("Error fetching Pokemon:", error);
      }
    };

    fetchPokemon();
  }, [currentPage, itemsPerPage, sortOrder, selectedType]);

  const goToNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  const handleItemsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    localStorage.setItem("itemsPerPage", e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as "asc" | "desc");
    localStorage.setItem("sortOrder", e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
    setCurrentPage(1);
    localStorage.setItem("selectedType", e.target.value);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const allTypes = [
    "all",
    "Grass",
    "Poison",
    "Fire",
    "Water",
    "Bug",
    "Flying",
    "Normal",
    "Electric",
  ];

  return (
    <div className={`app ${theme}-mode`}>
      <div className="card">
        <h1 className="header">Pokedex</h1>

        <button className="theme-toggle-button" onClick={toggleTheme}>
          {theme === "light" ? "☀️" : "🌙"}
        </button>

        <div className="controls-top">
          <div>
            <label htmlFor="filterType">Filter by Type: </label>
            <select
              id="filterType"
              className="items-per-page-select"
              value={selectedType}
              onChange={handleFilterChange}
            >
              {allTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sortOrder">Sort by Number: </label>
            <select
              id="sortOrder"
              className="items-per-page-select"
              value={sortOrder}
              onChange={handleSortChange}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        <div className="pokemon-list-container">
          {pokemonList &&
            pokemonList.map((p, index) => (
              <PokemonCard key={`${p.number}-${index}`} pokemon={p} />
            ))}
        </div>

        <PaginationControls
          itemsPerPage={itemsPerPage}
          handleItemsPerPageChange={handleItemsPerPageChange}
          currentPage={currentPage}
          totalPages={totalPages}
          goToPreviousPage={goToPreviousPage}
          goToNextPage={goToNextPage}
          pokemonListLength={total_items}
        />
      </div>
    </div>
  );
}

export default App;
