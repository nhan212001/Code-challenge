## Problem 2: Currency Swap - Run Instructions

1. Open a terminal and navigate to `src/problem2/currency-swap`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and go to [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

## Problem 3: Messy React

Here are the computational inefficiencies and anti-patterns found in the code block:

- Change the type of blockchain in getPriority from any to string.
- Add the missing blockchain property to the WalletBalance interface.
- Remove the undeclared variable lhsPriority.
- Fix the filter condition: keep valid balances where balance.amount > 0.
- Avoid calling getPriority multiple times in filter and sort by computing it once and storing in priority.
- The sort comparison logic could break if leftPriority equal rightPriority, simplify the sorting logic by using numeric subtraction instead of verbose if/else.
- useMemo dependencies included prices but it was not used → remove it.
- Remove the extra formattedBalances mapping step; format balances directly when rendering.
- Remove the FormattedWalletBalance interface since formatted is no longer needed.
- In WalletRow, use a unique id as the key if available; otherwise use ${balance.blockchain}-${balance.currency} to avoid unnecessary re-renders when the list changes or reorders.

## Problem 4: A Cruded Server - Run Instructions

1. Download Firebase service account key JSON file from https://drive.google.com/file/d/1J5b52U1ARI2b8vvFNFr-0xuiLI2dFGdY/view?usp=drive_link and save it as `firebaseKey.json` in `src/problem4/`.
2. Open a terminal and navigate to `src/problem4`.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. The API will be available at [http://localhost:3000](http://localhost:3000)
6. Open `public/index.html` in your browser to test the API endpoints with the provided UI.
