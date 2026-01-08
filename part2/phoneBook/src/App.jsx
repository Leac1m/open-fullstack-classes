import { useEffect, useState } from "react";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Filter from "./components/Filter";

import personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState(null);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [personSearch, setPersonSearch] = useState("");
  const [messageInfo, setMessageInfo] = useState({
    message: "Added Juha Tauriainen",
    status: "info",
  });

  useEffect(() => {
    personService.getAll().then((initialNotes) => setPersons(initialNotes));
  }, []);

  if (!persons) return;

  const addPerson = (event) => {
    event.preventDefault();

    const person = persons.find((p) => p.name === newName);

    if (!person) {
      const personObject = { name: newName, number: newNumber };
      setPersons(persons.concat(personObject));
      personService.create(personObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setMessageInfo({
          message: `Added ${returnedPerson.name}`,
          status: "info",
        });
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
        setMessageInfo({
          message: `Information of ${person.name} has already been removed from server`,
          status: "error",
        });
        setPersons(persons.filter((person) => person.id !== id));
      });
  };

  const deletePerson = (id) => {
    const person = persons.find((person) => person.id === id);

    if (!person) return;

    if (!confirm(`Delete ${person.name} ?`)) return;

    personService
      .remove(id)
      .then((returnedPerson) => {
        console.log("person deleted:", returnedPerson);
      })
      .catch(() => {
        setMessageInfo({
          message: `Information of ${person.name} has already been removed from server`,
          status: "error",
        });
      })
      .finally(() => setPersons(persons.filter((person) => person.id !== id)));
  };

  const handleResetNotification = () => {
    setTimeout(() => setMessageInfo(null), 5000);
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
      <Notification
        messageInfo={messageInfo}
        handleResetNotification={handleResetNotification}
      />
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
      <Persons persons={filtedPersons} onDelete={deletePerson} />
    </div>
  );
};

export default App;
