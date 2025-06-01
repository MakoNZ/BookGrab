"use client";

import { ThemeProvider, createTheme } from "@aws-amplify/ui-react";
import { useState, useEffect, ReactNode } from "react";
import "@aws-amplify/ui-react/styles.css";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [colorMode, setColorMode] = useState<"light" | "dark">("light");

  // Check for system theme preference on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check for saved theme preference
      const savedTheme = localStorage.getItem("theme") as
        | "light"
        | "dark"
        | null;

      if (savedTheme) {
        setColorMode(savedTheme);
      } else if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        setColorMode("dark");
      }
    }
  }, []);

  // Apply theme class to document
  useEffect(() => {
    if (colorMode === "dark") {
      document.documentElement.setAttribute("data-amplify-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-amplify-theme");
    }

    // Save theme preference
    localStorage.setItem("theme", colorMode);
  }, [colorMode]);

  const theme = createTheme({
    name: "bookgrab-theme",
    tokens: {
      colors: {
        font: {
          primary: { value: "var(--amplify-colors-font-primary)" },
          secondary: { value: "var(--amplify-colors-font-secondary)" },
        },
        background: {
          primary: { value: "var(--amplify-colors-background-primary)" },
          secondary: { value: "var(--amplify-colors-background-secondary)" },
        },
        brand: {
          primary: {
            10: { value: "var(--amplify-colors-brand-primary-10)" },
            80: { value: "var(--amplify-colors-brand-primary-80)" },
            90: { value: "var(--amplify-colors-brand-primary-90)" },
            100: { value: "var(--amplify-colors-brand-primary-100)" },
          },
        },
      },
      components: {
        card: {
          backgroundColor: { value: "{colors.background.primary}" },
          borderRadius: { value: "0.75rem" },
        },
        button: {
          primary: {
            backgroundColor: { value: "{colors.brand.primary.90}" },
            _hover: {
              backgroundColor: { value: "{colors.brand.primary.80}" },
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme} colorMode={colorMode}>
      <div className="amplify-app">
        {children}
        <button
          onClick={() => setColorMode(colorMode === "light" ? "dark" : "light")}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: colorMode === "light" ? "#0f172a" : "#f8fafc",
            color: colorMode === "light" ? "#f8fafc" : "#0f172a",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            zIndex: 1000,
          }}
          aria-label={`Switch to ${colorMode === "light" ? "dark" : "light"} mode`}
        >
          {colorMode === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </ThemeProvider>
  );
}
