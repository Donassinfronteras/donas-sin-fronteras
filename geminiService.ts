import type { DeckType, ReadingTopic } from "../types";

// This function now calls our own backend, not Google's directly.
export const generateDailyMessage = async (cardName: string, meaning: string, isInverted: boolean, deck: DeckType, topic: ReadingTopic): Promise<string> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cardName,
        meaning,
        isInverted,
        deck,
        topic,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error || `Error from server: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    if (!data.message) {
      throw new Error("No message received from the server.");
    }
    
    return data.message;
    
  } catch (error) {
    console.error("Error calling backend API:", error);
    // Re-throw a user-friendly error. The App.tsx component will catch this.
    throw new Error("No se pudo contactar a los espíritus. Inténtalo de nuevo más tarde.");
  }
};
