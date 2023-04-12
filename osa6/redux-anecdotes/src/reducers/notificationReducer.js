import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const notificationSlice = createSlice({
    name: 'notification',
    initialState: initialState,
    reducers: {
      addNotification(state, action) {
        return action.payload
      },
      clearNotification(state, action) {
        return null
      }
    }
  })

  export const setNotification = (message, seconds) => {
    return async dispatch => {
        dispatch(addNotification(message))
        setTimeout(() => dispatch(clearNotification()), seconds*1000)
    }
  }

export const { addNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer