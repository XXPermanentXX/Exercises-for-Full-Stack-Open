import { useEffect, useState } from "react";
import Filter from "./components/Filter.jsx";
import PersonForm from "./components/PersonForm.jsx";
import People from "./components/People.jsx";
import personService from "./services/people.js";
import Notification from "./components/Notification.jsx";

const App = () => {
  const [people, setPeople] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((data) => {
      setPeople(data);
    });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };
    const person = people.find((person) => person.name === newName);
    if (person) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`,
        )
      ) {
        personService
          .update(person.id, { ...person, number: newNumber })
          .then((data) => {
            setPeople(people.map((p) => (p.id !== data.id ? p : data)));
            showNotification(`Successful Updated ${newName}`,false);
          }).catch(error=>{
          showNotification(`${error.response.data.error}`,true)
          console.log(error.response.data.error)});
      }
    } else {
      personService.create(personObject).then((data) => {
        setPeople(people.concat(data));
        showNotification(`Successful Added ${newName}`,false);
      }).catch(error=>{
        showNotification(`${error.response.data.error}`,true)
        console.log(error.response.data.error)});
    }
  };

  const handleDelete = (id) => {
    const person = people.find((person) => person.id === id);
    console.log(id)
    if (window.confirm(`Delete ${person.name}`)) {
      personService.remove(id).then(() => {
        setPeople(people.filter((person) => person.id !== id));
        showNotification(`Successful Deleted ${person.name}`,false);
      }).catch(error=>{
        console.log(error.message)
        showNotification(`Can't find ${person.name}`,true)
      })
    }
  };

  const showNotification = (message, isError) => {
    setNewName("");
    setNewNumber("");
    isError ? setErrorMessage(message) : setMessage(message);
    setTimeout(() => {
      isError ? setErrorMessage(null) : setMessage(null);
    }, 3000);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterString={filter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <Notification message={message} errorMessage={errorMessage} />
      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        handleSubmit={handleSubmit}
      />
      <h2>Numbers</h2>
      <People people={people} filterString={filter} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
