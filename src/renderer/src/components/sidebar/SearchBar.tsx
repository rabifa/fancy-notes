import React from 'react'
import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="searchbar-container">
      <input
        type="text"
        placeholder="Buscar notas..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="searchbar-input"
      />
      <Search className="searchbar-icon" size={18} />
    </div>
  )
}

export default SearchBar
