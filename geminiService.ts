import type { CardData, DeckType, ReadingTopic, PrismaticSpreadResult } from "../types";

// This function now calls our own backend, not Google's directly.
export const generateDailyMessage = async (
  cardName: string, 
  meaning: string, 
  isInverted: boolean, 
  deck: DeckType, 
  topic: ReadingTopic,
  signal: AbortSignal
): Promise<string> => {
  try {
    const response = await fetch('/api/carta-del-dia', {
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
      signal, // Pass signal to fetch to enable cancellation
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
    
  } catch (error: any) {
    if (error.name === 'AbortError') {
      // This is expected when the user cancels, so we re-throw to be handled by the component.
      throw error;
    }
    console.error("Error calling backend API:", error);
    // Re-throw a user-friendly error. The App.tsx component will catch this.
    throw new Error("No se pudo contactar a los espíritus. Inténtalo de nuevo más tarde.");
  }
};

export const generatePrismaticSpread = async (
  cards: { name: string; keywords: string }[],
  deck: DeckType,
  signal: AbortSignal
): Promise<Omit<PrismaticSpreadResult, 'now' | 'rainbow' | 'shadow'> & { messages: { now: string; rainbow: string; shadow: string } }> => {
  try {
    const response = await fetch('/api/tirada-prismatica', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cards, deck }),
      signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error || `Error from server: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
     if (!data.messages || !data.messages.now || !data.messages.rainbow || !data.messages.shadow) {
      throw new Error("Respuesta incompleta del servidor.");
    }

    return data;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw error;
    }
    console.error("Error calling prismatic spread API:", error);
    throw new Error("No se pudo canalizar la tirada prismática. Inténtalo de nuevo.");
  }
};
