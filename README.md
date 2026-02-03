# Academic Integrity Guardian

AI-powered academic integrity platform with plagiarism detection, reference matching, and originality certification.

## Features

- **AI-Powered Draft Analysis** - Semantic similarity detection using OpenAI GPT-4
- **Reference Matching** - Identifies matching academic papers from arXiv and Google Scholar
- **Originality Certification** - Generate verifiable certificates of academic integrity
- **Zero-Knowledge Security** - Cryptographic hashing with on-premise data sovereignty
- **Immutable Audit Ledger** - Blockchain-inspired transaction logging
- **Privacy Control Panel** - Student data management and access logs

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `OPENAI_API_KEY` in `.env.local`:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Styling:** Vanilla CSS with dark theme
- **AI:** OpenAI GPT-4 API
- **Security:** SHA-256 cryptographic hashing
