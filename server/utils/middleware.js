const errorHandler = (err, req, res, next) => {
  console.log(err.message)

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  } else if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: err.message })
  }

  next(err)
}

const unknownEndpoint  = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint'})
}


export default { errorHandler, unknownEndpoint }