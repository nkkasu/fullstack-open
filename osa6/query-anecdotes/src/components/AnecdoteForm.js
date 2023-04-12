import { useMutation, useQueryClient } from 'react-query'
import { getAnecdotes, createAnecdote } from '../services/requests'
import { useContext } from 'react'
import NotificationContext from '../NotificationContext'

const AnecdoteForm = () => {
  const [, notificationDispatch] = useContext(NotificationContext)

  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
    },
    onError: () => {
      notificationDispatch({ type: 'SHOW', payload: 'too short anecdote, must have length 5 or more'})
      setTimeout(() => {notificationDispatch({ type: 'HIDE' })}, 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({content, votes: 0})
    notificationDispatch({ type: 'SHOW', payload: `Created ${content}`})
    setTimeout(() => {
      notificationDispatch({ type: 'HIDE'})
    }, 5000)
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
