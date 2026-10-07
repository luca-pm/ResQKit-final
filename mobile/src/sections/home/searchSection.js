import SearchBar from "../../components/input/searchBar";

export default function SearchSection({ search, setSearch, onSubmit }) {
  return <SearchBar value={search} onChangeText={setSearch} onSubmit={onSubmit} />;
}
