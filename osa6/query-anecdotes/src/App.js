import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import NotificationContext from './NotificationContext'

import { useQuery, useMutation, useQueryClient, QueryClient} from 'react-query'
import { getAnecdotes, updateAnecdote} from './services/requests'
import { useContext } from 'react'

const App = () => {
  const [, notificationDispatch] = useContext(NotificationContext)

  const queryClient = useQueryClient()
  const updateAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
    }
  })

  const result = useQuery(
    'anecdotes', getAnecdotes, 
    {
      retry : false
    }
    )

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1})
    notificationDispatch({ type: 'SHOW', payload: `Anecdote ${anecdote.content} voted`})
    setTimeout(() => {
      notificationDispatch({ type: 'HIDE'})
    }, 5000)
  }

  if (result.isLoading) {
    return <div>loading data...</div>
  }
  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
      <div>
        <h3>Anecdote app</h3>
      
        <Notification />
        <AnecdoteForm />
      
        {anecdotes.map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => handleVote(anecdote)}>vote</button>
            </div>
          </div>
        )}
      </div>
  )
}

export default App
