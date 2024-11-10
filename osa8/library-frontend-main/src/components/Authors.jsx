import { useState } from 'react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'
import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/client'
import Select from 'react-select';

const Authors = ({ show }) => {
  const result = useQuery(ALL_AUTHORS)
  const [born, setBorn] = useState('');
  const [selectName, setSelectName] = useState(null);

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  });

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>Loading...</div>
  }
  const authors = result.data.allAuthors;
  const options = authors.map((author) => ({
    value: author.name,
    label: author.name
  }))
  const submit = async (event) => {
    event.preventDefault();
    editAuthor({ variables: { name: selectName.value, setBornTo: parseInt(born) } });
  }
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={submit}>
        <div>
          <Select options={options} defaultValue={selectName} onChange={setSelectName}></Select>
        </div>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
