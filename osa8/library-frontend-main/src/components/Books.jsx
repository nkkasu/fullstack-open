import { ALL_BOOKS } from '../queries'
import { useQuery } from '@apollo/client'

const Books = ({ show }) => {
  const result = useQuery(ALL_BOOKS)

  if (!show) {
    return null
  }
  if (result.loading) {
    return <div>Loading...</div>
  }
  const books = result.data.allBooks
  console.log(result.data)
  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
