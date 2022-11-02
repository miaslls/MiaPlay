import "./GameList.css";

import GameListItem from "../GameListItem";
import { GameListProps } from "./types";

const GameList = ({ genre, games }: GameListProps) => {
  games.sort((a, b) => (a.title > b.title ? 1 : b.title > a.title ? -1 : 0));

  return (
    <>
      <section className="game-list-container">
        <div className="game-list-header">
          <div className="genre">
            <h2>{genre.name}</h2>
          </div>
        </div>

        <ul className="game-list-items">
          {games.map((game, index) => (
            <GameListItem
              key={`game-list-item-${index}`}
              image={game.cover_imgUrl}
              title={game.title}
              year={game.year}
              rating={game.imdbScore}
              favorite={game.favorite}
            />
          ))}
        </ul>
      </section>
    </>
  );
};

export default GameList;