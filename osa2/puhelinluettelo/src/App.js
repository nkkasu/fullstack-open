import { useEffect, useState } from 'react'
import axios from 'axios'
import personService from './services/persons'

const Filter = ({onChange}) => {
  return (
  <div>
    filter shown with <input onChange={onChange} />
  </div>
  )
}
const PersonForm = ({handleNameChange, newName, newPhone, handlePhoneChange, addName}) => {
  return (
    <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
          <div>
            number: <input value={newPhone} onChange={handlePhoneChange} />
          </div>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}
const PersonElement = ({person, persons, setPersons}) => {
  const handleRemove = (event) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.remove(person.id)
                   .then(setPersons(persons.filter(p => p.id !== person.id)))
    }
  }
  return (
    <li key={person.name} >
      {person.name} {person.number} {<button type="button" onClick={handleRemove}>delete</button>}</li>
  )

}

const Persons = ({person, persons, filterText, setPersons}) => {
  return (
    <div>
      {persons.filter(person => person.name.toLowerCase()
              .includes(filterText.toLowerCase()))
              .map(person => <PersonElement key={person.id} persons={persons} 
                person={person} setPersons={setPersons}/>
      )}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filterText, setFilterText] = useState('')

  useEffect(() => {
    personService
        .getAll()
        .then(data => {
          setPersons(data)
        })
  }, [])


  const addName = (event) => {
    event.preventDefault()
    let person = persons.find(p => p.name === newName)
    if (person) {
      if (!window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        return
      }
      const updatedPerson = {...person, number: newPhone}
      personService.update(updatedPerson.id, updatedPerson)
                   .then(response => {
                    setPersons(persons.map(person => person.id !== updatedPerson.id ? person : response))
                   })
      return
    }
    const nameObject = {
      name: newName,
      number: newPhone
    }
    personService.create(nameObject)
                 .then(response => {
                  setPersons(persons.concat(response))
                  setNewName('')
                  setNewPhone('')
                 })
  }

  
  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value)
  }
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const filterNames = (event) => {
    setFilterText(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter onChange={filterNames} />

      <h1>add a new</h1>

      <PersonForm handleNameChange={handleNameChange} newName={newName}
                  newPhone={newPhone} handlePhoneChange={handlePhoneChange}
                  addName={addName}/>

      <h2>Numbers</h2>
      <Persons persons={persons} person={persons} filterText={filterText} setPersons={setPersons}/>
    </div>
  )

}

export default App