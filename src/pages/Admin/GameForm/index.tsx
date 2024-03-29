import "./GameForm.css";

import { useState, useEffect } from "react";

import { GameForm as IGameForm, GameFormProps, ErrorMsgs } from "./types";
import validateGameForm from "./util/validateGameForm";

import GameService from "../../../api/services/GameService";
import { GameBody } from "../../../api/types/game";

import { Genre } from "../../../api/types/genre";

const GameForm = ({
  genres,
  emptyGame,
  gameFormState,
  setGameFormState,
  getAllGames,
  closeGameForm,
}: GameFormProps) => {
  // 📌 errorMsgs
  const [errorMsgs, setErrorMsgs] = useState<ErrorMsgs>({
    title: "",
    cover_imgUrl: "",
    year: "",
    description: "",
    imdbScore: "",
    trailer_youTubeUrl: "",
    gameplay_youTubeUrl: "",
    genres: "",
  });

  // 📌 default input values

  const [defaultInputValues, setDefaultInputValues] =
    useState<IGameForm>(emptyGame);

  useEffect(() => {
    setDefaultInputValues({
      title: gameFormState.title,
      cover_imgUrl: gameFormState.cover_imgUrl,
      year: gameFormState.year,
      description: gameFormState.description,
      imdbScore: gameFormState.imdbScore,
      trailer_youTubeUrl: gameFormState.trailer_youTubeUrl,
      gameplay_youTubeUrl: gameFormState.gameplay_youTubeUrl,
      genres: gameFormState.genres,
    });
  }, [gameFormState]);

  const getTitleInput = () => defaultInputValues.title;
  const getCoverImgInput = () => defaultInputValues.cover_imgUrl;
  const getYearInput = () => defaultInputValues.year;
  const getDescriptionInput = () => defaultInputValues.description;
  const getImdbScoreInput = () => defaultInputValues.imdbScore;
  const getTrailerInput = () => defaultInputValues.trailer_youTubeUrl;
  const getGameplayInput = () => defaultInputValues.gameplay_youTubeUrl;
  // const getGenres = () => defaultInputValues.genres;

  // 📌 handleChange

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    name: string
  ) => {
    setGameFormState({ ...gameFormState, [name]: e.target.value });
    setErrorMsgs({ ...errorMsgs, [name]: "" });
  };

  // 📌 handleKeyPress

  const handleKeyPress = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitGameForm();
    }
  };

  // 📌 handleGenreSelect

  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState<string[]>([]);

  useEffect(() => {
    const genreIds = gameFormState.genres.map((genre) => genre.id);

    setSelectedGenres(gameFormState.genres);
    setSelectedGenreIds(genreIds);
  }, []);

  const handleGenreSelect = (genre: Genre) => {
    setSelectedGenres([...selectedGenres, genre]);
    setSelectedGenreIds([...selectedGenreIds, genre.id]);
    setGameFormState({
      ...gameFormState,
      ["genres"]: [...selectedGenres, genre],
    });
    setErrorMsgs({ ...errorMsgs, ["genres"]: "" });
  };

  const handleGenreDeselect = (genre: Genre) => {
    const afterDeselect = selectedGenres.filter(
      (selected) => genre.id !== selected.id
    );

    const idsAfterDeselect = afterDeselect.map((genre) => genre.id);

    setSelectedGenres(afterDeselect);
    setSelectedGenreIds(idsAfterDeselect);
    setGameFormState({ ...gameFormState, ["genres"]: afterDeselect });
  };

  // 📌 submitGameForm

  const submitGameForm = async () => {
    const formValidation = validateGameForm(gameFormState);

    if (formValidation.gameFormValid) {
      const {
        id,
        title,
        cover_imgUrl,
        year,
        description,
        imdbScore,
        trailer_youTubeUrl,
        gameplay_youTubeUrl,
        genres,
      } = gameFormState;

      const genreIdList = genres.map((genre) => genre.id);

      const gameBody: GameBody = {
        title: title,
        cover_imgUrl: cover_imgUrl,
        year: Number(year),
        description: description,
        imdbScore: Number(imdbScore),
        trailer_youTubeUrl: trailer_youTubeUrl,
        gameplay_youTubeUrl: gameplay_youTubeUrl,
        genres: genreIdList,
      };

      id
        ? await GameService.update(id, gameBody)
        : await GameService.create(gameBody);

      setGameFormState(emptyGame);
      closeGameForm();
      getAllGames();
    } else {
      setErrorMsgs(formValidation.errorMsgs);
    }
  };

  // 📌📌📌🚨 GameForm return

  return (
    <>
      <section className="admin-section admin-games-container">
        <div className="admin-section-header">
          <div className="admin-header-wrapper">
            <h2>games</h2>

            <div className="admin-header-icon-wrapper">
              <div
                className="admin-header-icon clickable"
                onClick={() => closeGameForm()}
              >
                <i className="bi bi-x-lg"></i>
              </div>
            </div>
          </div>
        </div>

        {/* 📌 FORM */}

        <form
          className="game-form"
          autoComplete="off"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="game-form-left-column">
            <div className="game-form-header">
              <div
                className="game-form-cover-img"
                style={{ backgroundImage: `url(${getCoverImgInput()})` }}
              >
                {getCoverImgInput().length === 0 && (
                  <i className="bi bi-controller"></i>
                )}
              </div>
              <div className="game-form-header-inputs">
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={getTitleInput()}
                  autoFocus={true}
                  placeholder="game title"
                  onChange={(e) => handleChange(e, "title")}
                  onKeyUp={(e) => handleKeyPress(e)}
                />

                {errorMsgs.title && (
                  <div className="game-form-error">{errorMsgs.title}</div>
                )}

                <input
                  type="text"
                  name="cover_imgUrl"
                  required
                  defaultValue={getCoverImgInput()}
                  placeholder="cover image URL"
                  onChange={(e) => handleChange(e, "cover_imgUrl")}
                  onKeyUp={(e) => handleKeyPress(e)}
                />

                {errorMsgs.cover_imgUrl && (
                  <div className="game-form-error">
                    {errorMsgs.cover_imgUrl}
                  </div>
                )}
              </div>
            </div>

            {/* 📌 genres */}

            <div className="game-form-genres">
              <h3 className="genre-form-title">genre(s):</h3>
              {genres.map((genre, index) => (
                <div
                  className="game-form-genre"
                  key={`game-form-genre-${index}`}
                >
                  {selectedGenreIds.includes(genre.id) ? (
                    <div
                      className="game-form-genre-checkbox"
                      onClick={() => handleGenreDeselect(genre)}
                    >
                      <i className="bi bi-check-square"></i>
                    </div>
                  ) : (
                    <div
                      className="game-form-genre-checkbox"
                      onClick={() => handleGenreSelect(genre)}
                    >
                      <i className="bi bi-square"></i>
                    </div>
                  )}

                  <div className="game-form-genre-name">{genre.name}</div>
                </div>
              ))}
            </div>

            {errorMsgs.genres && (
              <div className="game-form-error">{errorMsgs.genres}</div>
            )}

            <textarea
              name="description"
              required
              defaultValue={getDescriptionInput()}
              placeholder="description"
              onChange={(e) => handleChange(e, "description")}
              onKeyUp={(e) => handleKeyPress(e)}
            ></textarea>

            {errorMsgs.description && (
              <div className="game-form-error">{errorMsgs.description}</div>
            )}

            <fieldset>
              <div className="wrapper">
                <input
                  type="text"
                  name="year"
                  required
                  defaultValue={getYearInput()}
                  placeholder="year"
                  onChange={(e) => handleChange(e, "year")}
                  onKeyUp={(e) => handleKeyPress(e)}
                />

                {errorMsgs.year && (
                  <div className="game-form-error">{errorMsgs.year}</div>
                )}
              </div>

              <div className="wrapper">
                <input
                  type="text"
                  name="imdbScore"
                  required
                  defaultValue={getImdbScoreInput()}
                  placeholder="IMDB score"
                  onChange={(e) => handleChange(e, "imdbScore")}
                  onKeyUp={(e) => handleKeyPress(e)}
                />

                {errorMsgs.imdbScore && (
                  <div className="game-form-error">{errorMsgs.imdbScore}</div>
                )}
              </div>
            </fieldset>

            <input
              type="text"
              name="trailer_youTubeUrl"
              required
              defaultValue={getTrailerInput()}
              placeholder="trailer - YouTube URL"
              onChange={(e) => handleChange(e, "trailer_youTubeUrl")}
              onKeyUp={(e) => handleKeyPress(e)}
            />

            {errorMsgs.trailer_youTubeUrl && (
              <div className="game-form-error">
                {errorMsgs.trailer_youTubeUrl}
              </div>
            )}

            <input
              type="text"
              name="gameplay_youTubeUrl"
              required
              defaultValue={getGameplayInput()}
              placeholder="gameplay - YouTube URL"
              onChange={(e) => handleChange(e, "gameplay_youTubeUrl")}
              onKeyUp={(e) => handleKeyPress(e)}
            />

            {errorMsgs.gameplay_youTubeUrl && (
              <div className="game-form-error">
                {errorMsgs.gameplay_youTubeUrl}
              </div>
            )}

            {/* 📌 buttons */}

            <div className="game-form-buttons">
              <div
                className="game-form-button clickable"
                onClick={() => closeGameForm()}
              >
                <i className="bi bi-x-circle"></i>
              </div>
              <div
                className="game-form-button clickable"
                onClick={() => submitGameForm()}
              >
                <i className="bi bi-check-circle"></i>
              </div>
            </div>
          </div>

          {/* 📌 videos */}

          <div className="game-form-right-column">
            <div className="game-form-video">
              {getTrailerInput() === "" ? (
                <i className="bi bi-camera-video"></i>
              ) : (
                <iframe
                  src={`https://www.youtube.com/embed/${
                    getTrailerInput().split("=")[1]
                  }`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>

            <div className="game-form-video">
              {getGameplayInput() === "" ? (
                <i className="bi bi-camera-video"></i>
              ) : (
                <iframe
                  src={`https://www.youtube.com/embed/${
                    getGameplayInput().split("=")[1]
                  }`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default GameForm;
