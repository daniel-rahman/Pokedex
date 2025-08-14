import { useState } from "react";
import axios from "axios";

export const API_BASE_URL = "http://localhost:8080";

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


interface PokemonCardProps {
  pokemon: Pokemon;
}

function PokemonCard({ pokemon }: PokemonCardProps) {
  if (!pokemon) {
    console.error("PokemonCard received an undefined pokemon prop.");
    return null;
  }

  const [captured, setCaptured] = useState<boolean>(pokemon.is_captured);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = `https://placehold.co/80x80/e9eef6/6b7280?text=${pokemon.number}`;
  };

  const handleCaptured = async () => {
    if (captured || loading) return;
    setLoading(true);
    setError(null);

    try {
      const url = `${API_BASE_URL}/capture/${encodeURIComponent(pokemon.name)}`;
      const res = await axios.post(url, null, {
        withCredentials: true,
        validateStatus: () => true,
      });

      if (res.status === 200) {
        // Successfully captured
        setCaptured(true);
      } else {
        setError("Network error");
      }
    } catch (err: any) {
      setError(err?.message || "Network error while capturing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pokemon-list-item">
      <img
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.number}.png`}
        alt={pokemon.name}
        onError={handleImageError}
      />
      <div className="pokemon-info">
        <div className="number"># {String(pokemon.number)}</div>
        <div className="name">{pokemon.name}</div>
        <div className="pokemon-types">
          {pokemon.type_one && (
            <span className={`type ${pokemon.type_one}`}>
              {pokemon.type_one}
            </span>
          )}
          {pokemon.type_two && (
            <span className={`type ${pokemon.type_two}`}>
              {pokemon.type_two}
            </span>
          )}
        </div>
        <div className="pokemon-attributes">
          <div>
            <strong>Total:</strong> {pokemon.total}
          </div>
          <div>
            <strong>HP:</strong> {pokemon.hit_points}
          </div>
          <div>
            <strong>Attack:</strong> {pokemon.attack}
          </div>
          <div>
            <strong>Defense:</strong> {pokemon.defense}
          </div>
        </div>
        <button
          onClick={handleCaptured}
          className="captured-button"
          disabled={captured || loading}
          aria-pressed={captured}
          title={captured ? "Already captured" : "Mark as captured"}
        >
          {captured ? "Captured" : loading ? "Capturing…" : "Capture"}
        </button>
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}

export default PokemonCard;
