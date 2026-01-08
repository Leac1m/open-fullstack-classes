import { useEffect, useState } from "react";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Filter from "./components/Filter";

import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [personSearch, setPersonSearch] = useState("");

  useEffect(() => {
    personService.getAll().then((initialNotes) => setPersons(initialNotes));
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const person = persons.find((p) => p.name === newName);

    if (!person) {
      const personObject = { name: newName, number: newNumber };
      setPersons(persons.concat(personObject));
      personService.create(personObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
      });
    } else {
      if (confirm(`${newName} is already added to phonebook, update?`)) {
        updatePerson(person.id);
      }
    }
    setNewName("");
    setNewNumber("");
  };

  const updatePerson = (id) => {
    const person = persons.find((person) => person.id === id);
    const changedPerson = { ...person, number: newNumber };

    personService
      .update(id, changedPerson)
      .then((returnedPerson) => {
        setPersons(
          persons.map((person) => (person.id === id ? returnedPerson : person))
        );
      })
      .catch(() => {
        alert(`'${person.name}' was already deleted from server`);
        setPersons(persons.filter((person) => person.id !== id));
      });
  };

  const deletePerson = (id) => {
    const person = persons.find((person) => person.id === id);

    if (!person) return

    if (!confirm(`Delete ${person.name} ?`)) return

    personService
      .remove(id)
      .then((returnedPerson) => {
        console.log("person deleted:", returnedPerson);
      })
      .catch(() => {
        alert(`'${person.name}' was already deleted from server`);
      })
      .finally(() => setPersons(persons.filter((person) => person.id !== id)));
  };

  const filtedPersons = personSearch
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(personSearch)
      )
    : persons;

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        value={personSearch}
        onChange={(event) => setPersonSearch(event.target.value)}
      />
      <PersonForm
        onSubmit={addPerson}
        name={newName}
        number={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      <Persons persons={filtedPersons} onDelete={deletePerson}/>
    </div>
  );
};

export default App;
