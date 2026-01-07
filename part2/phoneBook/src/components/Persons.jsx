const Persons = ({ persons }) =>
  persons.map((person, idx) => (
    <p key={idx}>
      {person.name} {person.number}
    </p>
  ));

export default Persons