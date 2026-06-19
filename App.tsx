import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { CardData, SavedCardState, DeckType, ReadingTopic } from './types';
import { MAJOR_ARCANA, PRISMA_ORACLE_DEFAULT } from './constants';
import { generateDailyMessage } from './services/geminiService';
import TarotCard from './components/TarotCard';
import LoadingSpinner from './components/LoadingSpinner';
import SettingsPanel from './components/SettingsPanel';

const App: React.FC = () => {
  const [deckType, setDeckType] = useState<DeckType>('tarot');
  const [topic, setTopic] = useState<ReadingTopic>('general');
  const [drawnCard, setDrawnCard] = useState<CardData | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInverted, setIsInverted] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cargar datos al iniciar la aplicación
  useEffect(() => {
    setIsLoading(true);
    
    const decks = {
      tarot: MAJOR_ARCANA,
      prisma: PRISMA_ORACLE_DEFAULT,
    };

    try {
      const savedDeckType = localStorage.getItem('deckType') as DeckType || 'tarot';
      setDeckType(savedDeckType);

      const savedDataString = localStorage.getItem('dailyCard');
      if (savedDataString) {
        const savedData: SavedCardState = JSON.parse(savedDataString);
        if (savedData.date === new Date().toDateString()) {
          const deckForSavedCard = decks[savedData.deck];
          if (deckForSavedCard && deckForSavedCard[savedData.cardIndex]) {
            setDeckType(savedData.deck);
            setTopic(savedData.topic || 'general');
            setDrawnCard(deckForSavedCard[savedData.cardIndex]);
            setMessage(savedData.message);
            setIsInverted(savedData.isInverted);
          } else {
            localStorage.removeItem('dailyCard');
          }
        } else {
          localStorage.removeItem('dailyCard');
        }
      }
    } catch (e) {
      console.error("Error al cargar datos guardados:", e);
      localStorage.removeItem('dailyCard');
      localStorage.removeItem('deckType');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleDrawCard = useCallback(async () => {
    if (drawnCard || isLoading || isGenerating) return;

    const currentDeck = deckType === 'tarot' ? MAJOR_ARCANA : PRISMA_ORACLE_DEFAULT;
    
    setIsGenerating(true);
    setError(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const cardIndex = Math.floor(Math.random() * currentDeck.length);
    const card = currentDeck[cardIndex];
    const inverted = Math.random() < 0.5;
    
    setDrawnCard(card);
    setIsInverted(inverted);
    
    setTimeout(async () => {
        // Defensive check in case of cancellation during the 1s timeout
        if (controller.signal.aborted) {
            return;
        }
        try {
            const keywords = inverted ? card.invertedKeywords : card.keywords;
            const generatedMessage = await generateDailyMessage(card.name, keywords, inverted, deckType, topic, controller.signal);
            setMessage(generatedMessage);

            const today = new Date().toDateString();
            const dataToSave: SavedCardState = { cardIndex, message: generatedMessage, date: today, isInverted: inverted, deck: deckType, topic };
            localStorage.setItem('dailyCard', JSON.stringify(dataToSave));
        } catch (e: any) {
            console.error("Error generating message:", e);
            if (e.name !== 'AbortError') {
              setError("No se pudo contactar a los espíritus. Inténtalo de nuevo más tarde.");
            }
        } finally {
            setIsGenerating(false);
            if (abortControllerRef.current === controller) {
              abortControllerRef.current = null;
            }
        }
    }, 1000);
  }, [drawnCard, isLoading, isGenerating, deckType, topic]);
  
  const handleReset = () => {
    if (isGenerating) {
        abortControllerRef.current?.abort();
    }
    localStorage.removeItem('dailyCard');
    setDrawnCard(null);
    setMessage(null);
    setError(null);
    setIsInverted(false);
    setIsGenerating(false);
  };

  const handleDeckChange = (newDeck: DeckType) => {
    if (drawnCard) return;
    setDeckType(newDeck);
    localStorage.setItem('deckType', newDeck);
  }

  const handleTopicChange = (newTopic: ReadingTopic) => {
    if (drawnCard) return;
    setTopic(newTopic);
  }
  
  const renderMessage = () => {
    if (isGenerating && !message) {
        return (
            <div className="flex flex-col items-center gap-4 text-pink-800/80">
                <LoadingSpinner />
                <p>Consultando los astros...</p>
            </div>
        );
    }
    if (error) {
        return <p className="text-red-500 font-semibold text-center">{error}</p>
    }
    if (message) {
        return (
            <div className="space-y-4 text-center text-slate-800/90 leading-relaxed max-w-2xl animate-fade-in">
                {message.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
        )
    }
    return null;
  }

  const topicTitles: Record<ReadingTopic, string> = {
    general: 'Tu Guía para Hoy',
    amor: 'Tu Guía para el Amor',
    dinero: 'Tu Guía para el Dinero',
    trabajo: 'Tu Guía para el Trabajo',
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-start pt-8 sm:pt-12 p-4 sm:p-6 overflow-y-auto">
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-start">
          
          <div className="text-center mb-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-indigo-900/90 tracking-wider">{topicTitles[topic]}</h1>
            {!drawnCard && <p className="text-indigo-800/70 mt-2">Personaliza tu lectura a continuación</p>}
          </div>

          <SettingsPanel 
            deckType={deckType}
            topic={topic}
            onDeckChange={handleDeckChange}
            onTopicChange={handleTopicChange}
            disabled={!!drawnCard}
          />
          
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
                <LoadingSpinner/>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 sm:gap-8 w-full">
                <div className={`transition-transform duration-700 ease-in-out ${message || isGenerating ? 'scale-[0.8] sm:scale-[0.7]' : 'scale-100'}`}>\n                    <TarotCard cardData={drawnCard} isFlipped={!!drawnCard} isInverted={isInverted} />
                </div>
                
                {drawnCard && !isGenerating && !error && message && (
                  <div className="text-center max-w-md animate-fade-in -mt-4 sm:-mt-6 mb-4 px-2">
                    <h4 className="font-['Cinzel'] text-base sm:text-lg text-slate-800/90 font-semibold">Palabras Clave:</h4>
                    <p className="text-sm sm:text-base text-slate-700/80 italic">
                      {isInverted ? drawnCard.invertedKeywords : drawnCard.keywords}
                    </p>
                  </div>
                )}
                
                <div className="min-h-[12rem] flex flex-col items-center justify-center px-4 w-full">
                    {!drawnCard ? (
                        <div className="flex flex-col items-center gap-4">
                            <button
                                onClick={handleDrawCard}
                                disabled={isLoading || isGenerating}
                                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold rounded-full shadow-lg shadow-pink-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                            >
                                Revelar mi Carta
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-4 w-full">
                            {renderMessage()}
                            <button
                                onClick={handleReset}
                                className="mt-4 px-6 py-2 bg-white/70 text-slate-800 font-semibold rounded-full hover:bg-white backdrop-blur-sm transition-colors duration-300"
                            >
                                {isGenerating ? 'Cancelar' : 'Nueva Lectura'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
          )}
          <footer className="w-full text-center mt-auto py-4 text-xs text-slate-600/70">
            Creado con la ayuda de la inteligencia artificial.
          </footer>
      </div>
    </main>
  );
};

export default App;
