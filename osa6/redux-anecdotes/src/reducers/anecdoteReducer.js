import { createSlice } from '@reduxjs/toolkit'

import anecdoteService from '../services/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)
/*
const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}
*/
const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }

})

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}
export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const addVote = id => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    const votedAnecdote = anecdotes.find(a => a.id === id)
    const updatedAnecdote = {
      ...votedAnecdote, votes: votedAnecdote.votes + 1
    }
    const finalAnecdote = await anecdoteService.updateVote(id, updatedAnecdote)
    dispatch(setAnecdotes(anecdotes.map(a => a.id !== id ? a : finalAnecdote)))
  }
}

export const { appendAnecdote, setAnecdotes} = anecdoteSlice.actions

export default anecdoteSlice.reducer