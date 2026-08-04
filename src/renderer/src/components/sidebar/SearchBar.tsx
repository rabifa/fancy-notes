import React from 'react'
import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="searchbar-container">
      <Search className="searchbar-icon" size={16} />
      <input
        type="text"
        placeholder="BUSCAR NOTAS..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="searchbar-input"
      />
    </div>
  )
}

export default SearchBar
