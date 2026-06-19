# Agent tools
- sol: Converts lamports to SOL by dividing by 1e9; returns 0 for negative and non-numeric values.
- ton: Computes the TON equivalent: multiplies the token amount by the token/TON rate and rounds to the given precision (9 decimals by default).
- tool: Takes an integer number of seconds (>=0) and returns a string in hh:mm:ss format with leading zeros; hours are not capped at 24.
- getcryptorate: Computes the BASE/QUOTE pair rate as the ratio of their prices from the provided prices table. No network: all data comes from input.
- adjusttone: Rephrases text in a given tone: "kind" adds polite framing, "funny" adds a playful accent. A pure deterministic function.
- parsesolbalance: Parses a Solana balance from lamports (number or numeric string) into lamports and SOL amount.
- address_scanner: Scans an address string and extracts postal code, house numbers, comma-separated parts, and word tokens.
- tonunitconverter: Converts between TON and nanoTON units (1 TON = 1e9 nanoTON), with direction control and validation of numeric input.
