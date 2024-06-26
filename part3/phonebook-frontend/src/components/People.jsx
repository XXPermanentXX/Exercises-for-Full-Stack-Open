const People = ({ people, filterString, handleDelete }) => (
  <div>
    {people
      .filter((person) =>
        person.name.toLowerCase().includes(filterString.toLowerCase()),
      )
      .map((person) => (
        <div key={person.name}>
          <span>{`${person.name} ${person.number} `}</span>
          <button onClick={() => handleDelete(person.id)}>delete</button>
        </div>
      ))}
  </div>
);

export default People;
