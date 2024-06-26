const Filter = ({ filterString, handleFilterChange }) => (
    <div>
        filter shown with <input value={filterString} onChange={handleFilterChange}/>
    </div>
)

export default Filter;