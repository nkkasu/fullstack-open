import { useDispatch, useSelector} from "react-redux"
import { addVote } from "../reducers/anecdoteReducer"
import { clearNotification, setNotification } from "../reducers/notificationReducer"
const AnecdoteList = () => {

    const dispatch = useDispatch()

    const anecdotes = useSelector(state => {
       if (state.filter === '') {
        return state.anecdotes
       }
       return state.anecdotes.filter(
        anecdote => anecdote.content
                            .toLowerCase()
                            .includes(state.filter.toLowerCase()))
    })

    const vote = ({id, content}) => {
        console.log('vote', id)
        dispatch(addVote(id))
        dispatch(setNotification(`1 Vote added for ${content}`, 5))
      }
    return (
        <div>
            {[...anecdotes].sort((a, b) => b.votes - a.votes).map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    )
    
}

export default AnecdoteList
