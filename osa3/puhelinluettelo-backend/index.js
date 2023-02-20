const express = require('express')
var morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())

// https://www.digitalocean.com/community/tutorials/nodejs-getting-started-morgan
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :param'))

morgan.token('param', function(req, res, param) {
  return JSON.stringify(req.body)
})

let persons = [
    {
      name: "Arto Hellas",
      number: "040-123456",
      id: 1
    },
    {
      name: "Ada Lovelace",
      number: "39-44-5323523",
      id: 2
    },
    {
      name: "Dan Abramov",
      number: "12-43-234345",
      id: 3
    },
    {
      name: "Mary Poppendieck",
      number: "39-23-6423122",
      id: 4
    }
  ]

app.get('/info', (req, res) => {
    res.end(`Phonebook has info for ${persons.length} people \n${Date()}`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(note => note.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body.name || !body.number) {
        return res.status(400).json({error: 'Missing name or number'})
    }

    const personFound = persons.find(person => person.name === body.name)
    if (personFound) {
        return res.status(400).json({error: 'Name must be unique'})
    }
    body.id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
    persons = persons.concat(body)
    res.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})