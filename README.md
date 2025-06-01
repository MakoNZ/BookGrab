# BookGrab

> **Disclaimer:** BookGrab is a personal project I built for myself. Support is limited to MyAnonyMouse (MAM) and Transmission. Use at your own risk.

BookGrab is a simple, streamlined web application that allows you to search for books on MyAnonyMouse using their RSS API and send downloads directly to your Transmission client. It provides a clean, straightforward interface for finding and downloading both ebooks and audiobooks.

## Why BookGrab?

Most people looking for book automation probably want [Readarr](https://readarr.com/). However, I built BookGrab because:

1. Readarr requires separate instances for audiobooks and ebooks, which is cumbersome
2. Readarr's author-based interface is too complicated to share with friends and family
3. I wanted a simpler, more direct search-and-download experience without the complexity of a full media management system

BookGrab focuses on doing one thing well: making it easy to search MAM and download books with a single click.

## Features

- Simple search interface for MyAnonyMouse's extensive book collection
- Display search results with book details (title, author, format, length for audiobooks)
- Download books directly to your Transmission client with a single click
- Separate download paths for audiobooks and ebooks (I send my audiobooks to the directory scanned by AudioBookshelf and the ebooks I send to the directory scanned by Calibre-Web)
- Light and dark mode support
- Minimal setup and configuration

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A MyAnonyMouse account and session token
- A running Transmission client

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
MAM_TOKEN=your_mam_token_here
TRANSMISSION_URL=http://your-transmission-server:9091/transmission/rpc
AUDIOBOOK_DESTINATION_PATH=/path/to/audiobooks
EBOOK_DESTINATION_PATH=/path/to/ebooks
```

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Building for Production

```bash
npm run build
npm start
```

## Technologies Used

- Next.js
- TypeScript
- AWS Amplify UI
- MyAnonyMouse RSS API
- Transmission RPC API

## Limitations

- Only works with MyAnonyMouse as the content source
- Requires a Transmission client for downloads
- No library management features - just search and download
- No automatic organization of downloaded content beyond basic path separation
