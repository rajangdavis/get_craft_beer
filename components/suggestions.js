import React from 'react'

// Inspired by:
// https://dev.to/sage911/how-to-write-a-search-component-with-suggestions-in-react-d20

const Suggestions = (props) => {
  const options = props.results.map(r => (
    <li key={r.id}>
      {r.name}
    </li>
  ))
  return <ul>{options}</ul>
}

export default Suggestions