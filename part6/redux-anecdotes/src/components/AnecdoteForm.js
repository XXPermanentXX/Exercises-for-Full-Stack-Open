import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const handleSubmit = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(addAnecdote(content))
  }

  return (
    <div>
      <h2>Create New Anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input name="anecdote" placeholder="Write your anecdote here" />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
