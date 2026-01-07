import { useState } from "react";
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'



const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [personSearch, setPersonSearch] = useState("");

  const addPerson = (event) => {
    event.preventDefault();

    const doesNotExists = !persons.find((p) => p.name === newName);

    if (doesNotExists) {
      const personObject = { name: newName, number: newNumber };
      setPersons(persons.concat(personObject));
    } else {
      alert(`${newName} is already added to phonebook`);
    }
    setNewName("");
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
      <Persons persons={filtedPersons} />
    </div>
  );
};







export default App;
