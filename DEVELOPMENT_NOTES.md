# Development Notes: StockPulse Architecture & Decisions

## Key Architectural Decisions

1.  **State Management (Zustand over Redux)**
    *   *Decision:* I chose Zustand for watchlist persistence.
    *   *Trade-off/Rationale:* For an app of this size where the only true global state is the user's watchlist, Redux would introduce unnecessary boilerplate. Zustand gives me hooks out-of-the-box, easy async middleware for AsyncStorage, and keeps the bundle size small.
2.  **API Strategy (Yahoo Finance & NewsAPI instead of AlphaVantage)**
    *   *Decision:* Sourced live market data from `yahoo-finance2` and news from `NewsAPI`.
    *   *Trade-off/Rationale:* AlphaVantage's free tier is notoriously restrictive (few calls per minute), which leads to immediate rate-limiting during active UI development or demo recording. Yahoo Finance provides a much higher bandwidth for quotes and charts. Since we needed reliable news to feed to the LLM, NewsAPI was selected as the bridge.
3.  **LLM Selection (Groq + Llama 3.3)**
    *   *Decision:* Used Groq to run Llama 3.3 for sentiment analysis.
    *   *Trade-off/Rationale:* The core feature of the app is "real-time pulse". Using standard OpenAI or Anthropic endpoints introduces a ~2-5 second visual delay. Groq's LPU architecture returns the structured JSON output almost instantly, making the "AI Analysis" feel like a native, synchronous calculation rather than a loading web request.
4.  **Styling (NativeWind over React Native Paper)**
    *   *Decision:* Chose NativeWind.
    *   *Trade-off/Rationale:* RN Paper is great but comes with Material Design baggage. Groww's UI is highly custom and deeply connected to its padding/margin grid and specific border radiuses. NativeWind allows for exact utility-class replication of these intricate design details much faster than writing `StyleSheet.create`.

## What I'd Do With More Time

1.  **WebSockets for Live Prices:** Currently, the prices are fetched once on mount. With more time, I would integrate a WebSocket connection (or heavy polling with React Query) so the prices flash green/red as they tick in real-time, just like a real brokerage app.
2.  **Comprehensive Error Boundaries:** While API calls have `try/catch` and fallback UI, implementing a global `react-error-boundary` and a logging service (like Sentry) would make it truly production-ready.
3.  **End-to-End Testing:** Add Detox to write E2E tests for the core flows: searching a stock, adding to watchlist, and verifying the sentiment gauge renders correctly.
4.  **Backend Proxy:** Right now, API keys are built into the app (even if loaded from `.env`). In a real scenario, the RN app should never talk to Groq or NewsAPI directly. I would build a lightweight Node/Express or Cloudflare Worker backend that securely holds the keys and serves a compiled `/api/pulse?ticker=RELIANCE` endpoint.

## Demo Script (30 Seconds)

*(For recording the README video)*

**[0:00 - 0:05] The Hook:**
"Hi, I'm Aditya. This is StockPulse, an AI-powered stock tracker built with React Native. Let's look at the home screen."
*(Action: Open app, show empty watchlist, scroll trending stocks)*

**[0:05 - 0:15] The Search & Add Flow:**
"I want to track Tata Motors. I'll search for it here. Watch how fast the API responds."
*(Action: Tap search, type "TATAMOTORS", tap result to go to detail screen. Tap the Star icon to add to watchlist)*

**[0:15 - 0:25] The Hero Feature (AI Sentiment):**
"Here is the detail page. We see the price and chart, but down here is the Sentiment Pulse. StockPulse just fetched the latest news for Tata Motors and ran it through Llama 3.3 on Groq to instantly gauge market sentiment."
*(Action: Scroll down to the gauge, let the animation finish. Scroll slightly more to show the news articles with the color-coded dots)*

**[0:25 - 0:30] Navigation & Settings:**
"It also persists my choices."
*(Action: Hit back arrow to return to Home screen, showing the stock is now in the watchlist. Tap the settings tab to show the about page, then stop recording)*
