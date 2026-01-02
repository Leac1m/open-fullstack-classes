import { useState } from "react";

const Button = ({ onclick, text }) => <button onClick={onclick}>{text}</button>;

const StatisticsLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

const Statistics = (props) => {
  const stats = props.stats;
  return (
    <table>
      <tbody>
        {stats.map((stat, id) => (
          <StatisticsLine key={id} text={stat.text} value={stat.value} />
        ))}
      </tbody>
    </table>
  );
};
function App() {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const stats = [
    { text: "good", value: good },
    { text: "neutral", value: neutral },
    { text: "bad", value: bad },
    { text: "all", value: good + neutral + bad },
    { text: "avarage", value: ((good + neutral + bad) / 3).toFixed(1) },
    { text: "positive", value: `${((good * 100) / (good + neutral + bad) || 0).toFixed(1)} %`},
  ];

  return (
    <div>
      <h1>give feedback</h1>

      <Button onclick={() => setGood(good + 1)} text="good" />
      <Button onclick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button onclick={() => setBad(bad + 1)} text="bad" />

      <h1>statistics</h1>
      <Statistics stats={stats} />
    </div>
  );
}

export default App;
