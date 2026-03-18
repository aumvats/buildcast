'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, Search } from 'lucide-react';
import { geocodeAddress, GeocodeSuggestion } from '@/lib/api/geocode';
import { Spinner } from '@/components/ui/Spinner';

interface LocationInputProps {
  defaultValue?: string;
  onSelect: (lat: number, lng: number, displayName: string) => void;
}

export function LocationInput({ defaultValue = '', onSelect }: LocationInputProps) {
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const search = useCallback(
    async (q: string) => {
      if (q.length < 3) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const results = await geocodeAddress(q);
        setSuggestions(results);
        setShowDropdown(results.length > 0);
        if (results.length === 0) {
          setError('Address not found. Try a city name or nearby landmark.');
        }
      } catch {
        setError('Address lookup temporarily unavailable. Try again in a moment.');
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleChange = (value: string) => {
    setQuery(value);
    setError('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
  };

  const handleSelect = (suggestion: GeocodeSuggestion) => {
    setQuery(suggestion.displayName);
    setShowDropdown(false);
    setSuggestions([]);
    onSelect(suggestion.lat, suggestion.lng, suggestion.displayName);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Enter job site address or city..."
          className="w-full pl-10 pr-10 py-3 min-h-[44px] border border-border rounded-md text-[15px] bg-surface text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-fast"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Spinner size={18} />
          </div>
        )}
      </div>

      {error && <p className="mt-1.5 text-sm text-error">{error}</p>}

      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-surface border border-border rounded-md shadow-lg max-h-60 overflow-auto animate-slide-down">
          {suggestions.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => handleSelect(s)}
                className="w-full text-left px-3 py-2.5 min-h-[44px] text-sm text-text-primary hover:bg-bg flex items-start gap-2 cursor-pointer transition-colors duration-fast"
              >
                <MapPin size={16} className="text-text-secondary mt-0.5 shrink-0" />
                <span className="line-clamp-2">{s.displayName}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
