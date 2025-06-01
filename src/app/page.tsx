"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import BookList from "@/components/BookList";
import { Book } from "@/types";
import {
  Flex,
  Heading,
  Text,
  View,
  useTheme,
  Card,
} from "@aws-amplify/ui-react";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [hasSearched, setHasSearched] = useState(false);
  const { tokens } = useTheme();

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(undefined);
    setHasSearched(true);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to search books");
      }

      setBooks(data.books || []);
      if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex direction="column" minHeight="100vh">
      {/* Header */}
      <View
        backgroundColor={tokens.colors.background.primary}
        boxShadow="small"
        position="sticky"
        top="0"
        zIndex="10"
      >
        <Flex
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          padding="medium"
          maxWidth="1200px"
          marginLeft="auto"
          marginRight="auto"
          width="100%"
        >
          <Flex alignItems="center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{
                marginRight: "8px",
                color: tokens.colors.brand.primary[90].value,
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <Heading level={1} fontSize="xl">
              BookGrab
            </Heading>
          </Flex>
        </Flex>
      </View>

      {/* Hero Section */}
      <View
        backgroundColor={tokens.colors.brand.primary[80].value}
        padding={{ base: "xs", medium: "xs" }}
      >
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      </View>

      {/* Main Content */}
      <Flex
        direction="column"
        flex="1"
        padding="large"
        maxWidth="1200px"
        marginLeft="auto"
        marginRight="auto"
        width="100%"
      >
        {hasSearched && (
          <BookList books={books} isLoading={isLoading} error={error} />
        )}

        {!hasSearched && !isLoading && (
          <Card
            variation="elevated"
            padding="xl"
            textAlign="center"
            maxWidth="500px"
            marginLeft="auto"
            marginRight="auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              fill="none"
              viewBox="0 0 24 24"
              stroke={tokens.colors.font.secondary.value}
              style={{ margin: "0 auto 16px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Heading level={3} marginBottom="small">
              Ready to find books?
            </Heading>
            <Text color={tokens.colors.font.secondary}>
              Enter a search term above to find books from MyAnonyMouse
            </Text>
          </Card>
        )}
      </Flex>

      {/* Footer */}
      <View
        backgroundColor={tokens.colors.background.primary}
        borderTop={`1px solid ${tokens.colors.border.primary}`}
        padding="medium"
      >
        <Flex
          direction="column"
          alignItems="center"
          maxWidth="1200px"
          marginLeft="auto"
          marginRight="auto"
        >
          <Text fontSize="small" color={tokens.colors.font.secondary}>
            BookGrab &copy; {new Date().getFullYear()}
          </Text>
        </Flex>
      </View>
    </Flex>
  );
}
