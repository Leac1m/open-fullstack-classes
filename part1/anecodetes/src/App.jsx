import { useState } from "react";

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState({});
  const [highestVote, setHigestVote] = useState(0);

  const handleNextAnecdote = () => {
    const selectedIndex = Math.floor(Math.random() * anecdotes.length);
    setSelected(selectedIndex);
  };

  const handleVote = () => {
    const newVotes = { ...votes };

    if (!newVotes[selected]) newVotes[selected] = 0;
    newVotes[selected] += 1;
    setVotes(newVotes);
    checkHighest();
  };

  const checkHighest = () => {
    if (!votes[highestVote]) setHigestVote(selected);
    else if (highestVote == selected) return;
    else if (votes[selected] >= votes[highestVote]) setHigestVote(selected);
  };

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Anecdote
        anecdotes={anecdotes}
        selected={selected}
        votes={votes}
        handleNextAnecdote={handleNextAnecdote}
        handleVote={handleVote}
      />

      <h1>Anecdote with most votes</h1>
      <MostVotedAnecdote
        anecdotes={anecdotes}
        votes={votes}
        highestVote={highestVote}
      />
    </div>
  );
};

const Anecdote = ({
  anecdotes,
  selected,
  votes,
  handleNextAnecdote,
  handleVote,
}) => (
  <div>
    <p>{anecdotes[selected]}</p>
    <p>has {votes[selected] || 0} votes</p>
    <button onClick={handleVote}>vote</button>
    <button onClick={handleNextAnecdote}>next anecdotes</button>
  </div>
);

const MostVotedAnecdote = ({ anecdotes, votes, highestVote }) => (
  <div>
    <p>{anecdotes[highestVote]}</p>
    <p>has {votes[highestVote] || 0} votes</p>
  </div>
);

export default App;
