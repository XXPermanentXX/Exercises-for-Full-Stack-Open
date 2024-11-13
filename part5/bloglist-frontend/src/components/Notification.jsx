const Notification = ({ message, errorMessage }) => {
  const style = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  if (message) {
    return <div style={style}>{message}</div>
  }

  if (errorMessage) {
    return <div style={errorStyle}>{errorMessage}</div>
  }

  return null
}

export default Notification
