const Persons = ({ persons, filter,handleDelete }) => (
  <div>
    {persons
      .filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase()),
      )
      .map((person) => (
        <div>
          <span key={person.name}>{`${person.name} ${person.number}`}</span>
            <button onClick={() => handleDelete(person.id)}>delete</button>
        </div>
      ))}
  </div>
);

export default Persons;
