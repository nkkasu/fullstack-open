import { useEffect, useState } from 'react'
import axios from 'axios'
import personService from './services/persons'
import './index.css'

const Notification = ({message}) => {
  if (message === null) {
    return null
  }
  console.log(message.type)
  return (
    <div className={message.type}>
      {message.text}
    </div>
  )
  
}

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
const PersonElement = ({person, persons, setPersons, setMessage}) => {
  const handleRemove = (event) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.remove(person.id)
                   .then(setPersons(persons.filter(p => p.id !== person.id)))
                   .catch(error => {
                    setMessage({text: `Error: ${person.name} already deleted`, type: 'failure'})
                    setTimeout(() => { setMessage(null)}, 5000)
                    return
                   })
      setMessage({text: `Successfully removed ${person.name}`, type: 'success'})
      setTimeout(() => {setMessage(null)}, 5000)
    }
  }
  return (
    <li key={person.name} >
      {person.name} {person.number} {<button type="button" onClick={handleRemove}>delete</button>}</li>
  )
  
}

const Persons = ({persons, filterText, setPersons, setMessage}) => {
  return (
    <div>
      {persons.filter(person => person.name.toLowerCase()
              .includes(filterText.toLowerCase()))
              .map(person => <PersonElement key={person.id} persons={persons} 
                person={person} setPersons={setPersons} setMessage={setMessage}/>
      )}
    </div>
  )
}

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filterText, setFilterText] = useState('')
  const [message, setMessage] = useState(null)

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
                    setMessage({text: `Successfully edited ${person.name}`, type: 'success'})
                    setTimeout(() => { setMessage(null)}, 5000)
                   })
                   .catch(error => {
                    setMessage({text: `Error: ${person.name} already deleted`, type: 'failure'})
                    setTimeout(() => { setMessage(null)}, 5000)
                    return
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
                  setMessage({text: `Successfully added ${nameObject.name}`, type: 'success'})
                  setTimeout(() => {setMessage(null)}, 5000)
                  setNewName('')
                  setNewPhone('')
                 })
                 .catch(error => {
                  setMessage({text: `Error occurred on adding ${person.name}`, type: 'failure'})
                  setTimeout(() => {setMessage(null)}, 5000)
                  return
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

      <Notification message={message}/>
      
      <Filter onChange={filterNames} />

      <h1>add a new</h1>

      <PersonForm handleNameChange={handleNameChange} newName={newName}
                  newPhone={newPhone} handlePhoneChange={handlePhoneChange}
                  addName={addName}/>

      <h2>Numbers</h2>
      <Persons persons={persons} person={persons} filterText={filterText} setPersons={setPersons} 
               setMessage={setMessage}/>
    </div>
  )

}

export default App