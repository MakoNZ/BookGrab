"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import {
  SearchField,
  Button,
  Flex,
  Card,
  Text,
  Divider,
  useTheme,
} from "@aws-amplify/ui-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecent, setShowRecent] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { tokens } = useTheme();

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches));
      } catch (e) {
        console.error("Failed to parse recent searches:", e);
      }
    }
  }, []);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowRecent(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (query.trim()) {
        performSearch(query.trim());
      }
    }
  };

  const performSearch = (searchQuery: string) => {
    onSearch(searchQuery);

    // Save to recent searches
    const updatedSearches = [
      searchQuery,
      ...recentSearches.filter((s) => s !== searchQuery),
    ].slice(0, 5); // Keep only the 5 most recent

    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    setShowRecent(false);
  };

  const handleRecentSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    performSearch(searchQuery);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
    setShowRecent(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <SearchField
          ref={searchInputRef}
          label="Search"
          placeholder="Search for books"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => recentSearches.length > 0 && setShowRecent(true)}
          isDisabled={isLoading}
          size="large"
          width="100%"
          labelHidden
        />
        {/* Hidden submit button to enable Enter key submission */}
        <button type="submit" style={{ display: 'none' }} aria-hidden="true" />
      </form>

      {/* Recent searches dropdown */}
      {showRecent && recentSearches.length > 0 && (
        <Card
          ref={dropdownRef}
          width="100%"
          marginTop="8px"
          padding="0"
          borderRadius="medium"
          boxShadow="medium"
          position="absolute"
          top="100%"
        >
          {/* <Flex direction="row" justifyContent="space-between" alignItems="center" padding="medium"> */}
          <Text fontWeight="bold" fontSize="small">
            Recent Searches
          </Text>
          <Button
            onClick={clearRecentSearches}
            size="small"
            variation="link"
            color={tokens.colors.font.error}
          >
            Clear All
          </Button>
          {/* </Flex> */}
          <Divider />
          {recentSearches.map((search, index) => (
            <Flex
              key={index}
              as="button"
              onClick={() => handleRecentSearch(search)}
              width="100%"
              // padding="medium"
              alignItems="center"
              style={{
                cursor: "pointer",
                background: "transparent",
                border: "none",
                textAlign: "left",
              }}
              _hover={{
                backgroundColor: tokens.colors.background.secondary,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ marginRight: "8px" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <Text>{search}</Text>
            </Flex>
          ))}
        </Card>
      )}
    </>
  );
}
