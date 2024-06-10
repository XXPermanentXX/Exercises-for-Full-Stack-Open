import { useState } from "react";

// Button component
const Button = ({ handleClick, text }) => (
    <button onClick={handleClick}>{text}</button>
);

// StatisticLine component
const StatisticLine = ({ text, value }) => (
    <tr>
        <td>{text}</td>
        <td>{value}</td>
    </tr>
);

// Statistics component
const Statistics = ({ goodCount, neutralCount, badCount }) => {
    const allCount = goodCount + neutralCount + badCount;
    const average = allCount > 0 ? (goodCount - badCount) / allCount : 0;
    const positive = allCount > 0 ? (goodCount / allCount) * 100 : 0;

    return (
        <>
            <h1>statistics</h1>
            {allCount === 0 ? (
                <div>No feedback given</div>
            ) : (
                <table>
                    <tbody>
                    <StatisticLine text="good" value={goodCount} />
                    <StatisticLine text="neutral" value={neutralCount} />
                    <StatisticLine text="bad" value={badCount} />
                    <StatisticLine text="all" value={allCount} />
                    <StatisticLine text="average" value={average} />
                    <StatisticLine text="positive" value={`${positive} %`} />
                    </tbody>
                </table>
            )}
        </>
    );
};

// App component
const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);

    const handleGoodClick = () => setGood(good + 1);
    const handleNeutralClick = () => setNeutral(neutral + 1);
    const handleBadClick = () => setBad(bad + 1);

    return (
        <div>
            <h1>give feedback</h1>
            <Button handleClick={handleGoodClick} text="good" />
            <Button handleClick={handleNeutralClick} text="neutral" />
            <Button handleClick={handleBadClick} text="bad" />
            <Statistics goodCount={good} neutralCount={neutral} badCount={bad} />
        </div>
    );
};

export default App;
