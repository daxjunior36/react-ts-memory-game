import { useRef, useState } from "react";
import { Card, CardProps } from "../Card";
import "./styles.css";
import { duplicateRegenerateSortArray } from "../../utils/tempCodeRunnerFile";

export interface GridProps {
  cards: CardProps[];
}

export function Grid({ cards }: GridProps) {
  const [stateCards, seteStateCards] = useState(() => {
    return duplicateRegenerateSortArray(cards);
  });
  const first = useRef<CardProps | null>(null);
  const second = useRef<CardProps | null>(null);
  const unflip = useRef(false);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);

  const handleReset = () => {
    seteStateCards(duplicateRegenerateSortArray(cards));
    first.current = null;
    second.current = null;
    unflip.current = false;
    setMatches(0);
    setMoves(0);
  }

  const handleClick = (id: string) => {
    const newStateCards = stateCards.map((card) => {
      // se o id do cartão não for o id clicado, não faz nada
      if (card.id != id) return card;
      // se o cartão já tiver virado, não faz nada
      if (card.flipped) return card;

      // Desviro possíveis cards errados.
      if (unflip.current && first.current && second.current) {
        first.current.flipped = false;
        second.current.flipped = false;
        first.current = null;
        second.current = null;
        unflip.current = false;
      }

      // virar o card
      card.flipped = true;

      // configura primeiro e segundo cartão clicados

      if (first.current === null) {
        first.current = card;
      } else if (second.current === null) {
        second.current = card;
      }

      // Se eu tenho os dois cartões virados
      // checar se estão corretos.
      if (first.current && second.current) {
        if (first.current.back === second.current.back) {
          // O jogador acertou
          first.current = null;
          second.current = null;
          setMatches((moves) => moves + 1);
        } else {
            // O jogador errou
            unflip.current = true;
        }
        setMoves((moves) => moves + 1);
      }

      return card;
    });

    seteStateCards(newStateCards);
  };

  return (
    <>
    <div className="text">
      <h1>
        Memory Game 
        </h1>
        <p>Moves: {moves} | Matches: {matches} | <button onClick={handleReset}>Reset</button></p>
    </div>

    <div className="grid">
      {stateCards.map((card) => {
        return <Card {...card} key={card.id} handleClick={handleClick} />;
      })}
    </div>
    </>
  );
}
