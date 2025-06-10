"use client";
import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';

// Define a TypeScript interface for the data we expect from the API.
// This helps with type safety and auto-completion.
interface CatImage {
  id: string;
  url: string;
  width: number;
  height: number;
}

interface CatQuote {
  quote: string;
  author: string;
}

// Curated list of cat quotes
const CAT_QUOTES: CatQuote[] = [
  {
    quote: "Time spent with cats is never wasted.",
    author: "Sigmund Freud"
  },
  {
    quote: "Cats are connoisseurs of comfort.",
    author: "James Herriot"
  },
  {
    quote: "A cat has absolute emotional honesty: human beings, for one reason or another, may hide their feelings, but a cat does not.",
    author: "Ernest Hemingway"
  },
  {
    quote: "Cats are intended to teach us that not everything in nature has a purpose.",
    author: "Garrison Keillor"
  },
  {
    quote: "In ancient times cats were worshipped as gods; they have not forgotten this.",
    author: "Terry Pratchett"
  },
  {
    quote: "Cats are like music. It&apos;s foolish to try to explain their worth to those who don&apos;t appreciate them.",
    author: "Unknown"
  },
  {
    quote: "A cat&apos;s eyes are windows enabling us to see into another world.",
    author: "Irish Proverb"
  },
  {
    quote: "Cats are the ultimate narcissists. You can tell this by all the time they spend on personal grooming. Dogs aren&apos;t like this. A dog&apos;s idea of personal grooming is to roll in a dead fish.",
    author: "James Gorman"
  },
  {
    quote: "Cats are smarter than dogs. You can&apos;t get eight cats to pull a sled through snow.",
    author: "Jeff Valdez"
  },
  {
    quote: "Cats are the ultimate Zen masters. They live in the moment, they don&apos;t hold grudges, and they don&apos;t worry about the future.",
    author: "Unknown"
  }
];

const CatMemePage: NextPage = () => {
  // State to store the current cat image data.
  const [catImage, setCatImage] = useState<CatImage | null>(null);
  // State to handle loading status.
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // State to handle any potential errors during the API fetch.
  const [error, setError] = useState<string | null>(null);
  const [catQuote, setCatQuote] = useState<CatQuote | null>(null);

  // Function to get a random cat quote
  const getRandomCatQuote = () => {
    const randomIndex = Math.floor(Math.random() * CAT_QUOTES.length);
    return CAT_QUOTES[randomIndex];
  };

  // This is the function that will fetch the cat image from the API.
  const fetchNewCat = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.thecatapi.com/v1/images/search');
      if (!response.ok) {
        throw new Error('Failed to fetch cat image. Please try again.');
      }
      const data: CatImage[] = await response.json();
      if (data && data.length > 0) {
        setCatImage(data[0]);
        // Get a random quote from our curated list
        setCatQuote(getRandomCatQuote());
      } else {
        throw new Error('No cat images found.');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect with an empty dependency array [] means this code will run once
  // when the component is first mounted.
  useEffect(() => {
    fetchNewCat();
  }, []); // The empty array ensures this effect runs only once on mount.

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 w-full max-w-lg text-center">
        {/* Playful title for the app */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-8">
          Your Daily Dose of Cat
        </h1>

        {/* Display a loading message while fetching data */}
        {isLoading && (
          <div className="mb-8">
            <p className="text-gray-500 text-lg">Finding a cute cat...</p>
          </div>
        )}

        {/* Display an error message if the fetch fails */}
        {error && (
          <div className="mb-8">
            <p className="text-red-500 text-lg">{error}</p>
            <button
              onClick={fetchNewCat}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Display the cat image once it's loaded */}
        {!isLoading && catImage && (
          <>
            <div className="mb-8 h-96 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden">
              <img
                src={catImage.url}
                alt="A randomly fetched cat"
                className="object-contain h-full w-full"
              />
            </div>

            {catQuote && (
              <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                <p className="text-xl text-gray-700 italic mb-2">&ldquo;{catQuote.quote}&rdquo;</p>
                <p className="text-gray-600">- {catQuote.author}</p>
              </div>
            )}
          </>
        )}

        {/* Button to fetch a new cat image */}
        <button
          onClick={fetchNewCat}
          disabled={isLoading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl transition duration-300 ease-in-out disabled:bg-blue-300 disabled:cursor-not-allowed text-lg"
        >
          {isLoading ? 'Loading...' : 'Get Another Cat!'}
        </button>
      </div>
    </main>
  );
};

export default CatMemePage;
