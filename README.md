# StockPulse 📈🤖

> AI-powered stock sentiment tracker for the Indian retail investor.

A mobile application allowing users to search NSE/BSE-listed stocks, view live price data, read recent news, and get a real-time AI-generated sentiment pulse computed from the latest headlines using Groq's Llama 3.3.

![StockPulse App](placeholder-banner.png)

## ✨ Features
*   **Live Market Data:** Real-time prices & charts via Yahoo Finance.
*   **AI Sentiment Pulse:** Proprietary "Bullish/Neutral/Bearish" scoring using Groq (Llama 3).
*   **Curated News:** Recent headlines relevant to search queries via NewsAPI.
*   **Watchlist:** Locally persisted watchlist for quick access.
*   **Beautiful UI:** Dark-mode native interface heavily inspired by Groww's design language, with smooth Micro-animations.

## 📱 Screenshots
*(Placeholders - replace with actual screenshots post-build)*
<div style="display: flex; gap: 10px;">
  <img src="placeholder-home.png" width="200" alt="Home/Watchlist">
  <img src="placeholder-detail.png" width="200" alt="Stock Detail">
  <img src="placeholder-search.png" width="200" alt="Search">
</div>

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | React Native (Expo SDK 51+) |
| **Language** | TypeScript (Strict) |
| **Styling** | NativeWind (Tailwind CSS) |
| **State Mgt** | Zustand |
| **Storage** | AsyncStorage |
| **Navigation** | React Navigation v6 |
| **Animations** | Reanimated v3 |
| **APIs** | Yahoo Finance (unofficial npm), NewsAPI, Groq AI |
| **Charting** | react-native-chart-kit |

## 🚀 Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/stockpulse.git
    cd stockpulse
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables:**
    Copy `.env.example` to `.env` and add your API keys.
    ```bash
    cp .env.example .env
    ```
    *   `NEWSAPI_KEY`: Get from [NewsAPI.org](https://newsapi.org/)
    *   `GROQ_API_KEY`: Get from [Groq Cloud](https://console.groq.com/keys)

4.  **Start the Expo Development Server:**
    ```bash
    npm start
    # or
    npx expo start
    ```

5.  Open the app in **Expo Go** on your physical device via the QR code.

## 🏗 Architecture

```mermaid
flowchart TD
    User([User]) --> RN[React Native App]
    RN --> Z[Zustand Store]
    RN -- "Search/Quotes/Charts" --> YH[Yahoo Finance API]
    RN -- "Fetch News" --> NA[NewsAPI]
    RN -- "Analyze News" --> G[Groq API (Llama 3.3)]
    G -. "Sentiment Score" .-> RN
    Z <--> AS[(AsyncStorage)]
```

## 💭 Why I Built This
This application was built as a portfolio project demonstrating an end-to-end FinTech mobile experience. The design aesthetics, specifically the clean dark mode and typography, are heavily inspired by **Groww**, as I aim to showcase my ability to build user interfaces that are not just functional, but inherently trust-inspiring and premium. It blends modern financial data fetching with the latest in fast-inference LLMs to create a novel feature (the Sentiment Pulse).

## 🗺 Future Roadmap
*   **Authentication:** Firebase Auth to sync watchlists across devices.
*   **Push Notifications:** Alerts when a heavy sentiment shift occurs.
*   **Portfolio Tracking:** Allow users to add holdings and track profit/loss.
*   **Expanded Markets:** Support for US markets (NASDAQ/NYSE).

## 📄 License
MIT

## 👨‍💻 Author
**Aditya Nair**
*   [LinkedIn](https://linkedin.com/in/adityanair) *(Update link)*
*   [GitHub](https://github.com/adityanair)
