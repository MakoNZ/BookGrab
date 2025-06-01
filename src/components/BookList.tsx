"use client";

import { useState } from "react";
import { Book } from "@/types";
import BookCard from "./BookCard";
import {
  Flex,
  SelectField,
  ToggleButtonGroup,
  ToggleButton,
  Text,
  Loader,
  Alert,
  useTheme,
  View,
} from "@aws-amplify/ui-react";

interface BookListProps {
  books: Book[];
  isLoading: boolean;
  error?: string;
}

export default function BookList({ books, isLoading, error }: BookListProps) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"title" | "seeders" | "date" | "size">(
    "seeders",
  );
  const [filterCategory, setFilterCategory] = useState<
    "all" | "audiobook" | "ebook"
  >("all");
  const { tokens } = useTheme();

  if (isLoading) {
    return (
      <Flex
        width="100%"
        justifyContent="center"
        alignItems="center"
        padding="xxl"
      >
        <Loader size="large" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert variation="error" width="100%">
        Error: {error}
      </Alert>
    );
  }

  if (books.length === 0) {
    return (
      <Flex
        width="100%"
        justifyContent="center"
        alignItems="center"
        padding="xxl"
      >
        <Text color={tokens.colors.font.secondary}>
          No books found. Try a different search term.
        </Text>
      </Flex>
    );
  }

  // Filter books by category
  const filteredBooks =
    filterCategory === "all"
      ? books
      : books.filter((book) => book.category === filterCategory);

  // Sort books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "seeders":
        return (b.seeders || 0) - (a.seeders || 0);
      case "date":
        return a.added && b.added
          ? new Date(b.added).getTime() - new Date(a.added).getTime()
          : 0;
      case "size":
        // Simple size comparison (not perfect but works for basic sorting)
        const sizeA = a.size ? parseFloat(a.size.replace(/[^0-9.]/g, "")) : 0;
        const sizeB = b.size ? parseFloat(b.size.replace(/[^0-9.]/g, "")) : 0;
        return sizeB - sizeA;
      default:
        return 0;
    }
  });

  return (
    <Flex direction="column" width="100%" gap="medium">
      {/* Controls */}
      <Flex
        direction={{ base: "column", medium: "row" }}
        justifyContent="space-between"
        alignItems={{ base: "stretch", medium: "center" }}
        gap="small"
        padding="medium"
        backgroundColor={tokens.colors.background.primary}
        borderRadius="medium"
        boxShadow="small"
      >
        <Flex gap="small" direction={{ base: "column", small: "row" }} flex="1">
          <SelectField
            label="Filter by type"
            labelHidden
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            size="small"
          >
            <option value="all">All Types</option>
            <option value="audiobook">Audiobooks</option>
            <option value="ebook">Ebooks</option>
          </SelectField>

          <SelectField
            label="Sort by"
            labelHidden
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            size="small"
          >
            <option value="seeders">Most Seeders</option>
            <option value="title">Title</option>
            <option value="date">Newest</option>
            <option value="size">Size</option>
          </SelectField>
        </Flex>

        <ToggleButtonGroup
          value={view}
          onChange={(value) => setView(value as "grid" | "list")}
          isExclusive
          size="small"
        >
          <ToggleButton value="grid" aria-label="Grid view">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </ToggleButton>
          <ToggleButton value="list" aria-label="List view">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </ToggleButton>
        </ToggleButtonGroup>
      </Flex>

      {/* Results count */}
      <Text fontSize="small" color={tokens.colors.font.secondary}>
        Showing {filteredBooks.length} of {books.length} results
      </Text>

      {/* Book grid/list */}
      <View
        style={{
          display: "grid",
          gridTemplateColumns:
            view === "grid" ? "repeat(auto-fill, minmax(300px, 1fr))" : "1fr",
          gap: "16px",
          width: "100%",
        }}
      >
        {sortedBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </View>
    </Flex>
  );
}
