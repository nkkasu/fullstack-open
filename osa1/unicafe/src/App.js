import { useState } from 'react'

const Button = ({ value, text }) => {
  return (
    <button onClick={value}>
      {text}
    </button>
  )
}
const StatisticsLine = ( {text, value} ) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ( {good, neutral, bad}) => {

  const all = good + neutral + bad
  const avg = (good * 1 + bad * (-1)) / all
  const pos = good / all * 100
  if (all === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }

  return (
    <div>
      <table>
        <tbody>
        <StatisticsLine text="Good" value={good} />
        <StatisticsLine text="Neutral" value={neutral} />
        <StatisticsLine text="Bad" value={bad} />
        <StatisticsLine text="All" value={all} />
        <StatisticsLine text="Average" value={avg} />
        <StatisticsLine text="Positive" value={pos + " %"} />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => {
    setGood(good + 1)
  }
  const handleNeutral = () => {
    setNeutral(neutral + 1)
  }
  const handleBad = () => {
    setBad(bad + 1)
  }
  
  return (
    <div>
      <h1>Give feedback</h1>
      <Button text="good" value={handleGood} />
      <Button text="neutral" value={handleNeutral} />
      <Button text="bad" value={handleBad} />
      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App