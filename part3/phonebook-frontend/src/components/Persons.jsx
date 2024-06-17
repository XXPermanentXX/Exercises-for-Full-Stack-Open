const Persons = ({ persons, filter, handleDelete }) => (
  <div>
    {persons
      .filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase()),
      )
      .map((person) => (
        <div key={person.name}>
          <span>{`${person.name} ${person.number} `}</span>
          <button onClick={() => handleDelete(person.id)}>delete</button>
        </div>
      ))}
  </div>
);

export default Persons;
