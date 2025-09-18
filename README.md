# Quantum Gate: The Card Game

Welcome to Quantum Gate, a strategic digital card game based on the principles of quantum computing. Players use quantum gate cards to manipulate the quantum states of qubits, aiming to outmaneuver their opponent and collapse their system into a ground state.

**Note:** The full rules are available within the application in both English and Japanese.

## Objective

The goal of the game is to win by **decoherence**. You win if, at the end of any turn, you have forced your opponent's entire quantum system into the ground state, represented as **|00...0⟩**. This means every one of their qubits is in the definite **|0⟩** state with near-certainty (>99.9% probability).

## Game Setup

1.  **Qubits:** Both players start with a set number of qubits (default is 3), all initialized to the ground state **|0⟩**. The collection of all qubits for a player forms their quantum register, and its "true" state is represented by a state vector.
2.  **Deck:** Each player starts with an identical deck of 21 cards, composed of various quantum gates.
3.  **Hand:** Players draw an initial hand of cards. The maximum hand size is determined by the number of qubits.
4.  **Mana:** Mana is used to play cards during the Battle Phase. Both players start with 0 mana.

---

## Gameplay Flow

The game is divided into two distinct phases.

### Turn 1: The Preparation Phase

This is a special setup turn for both players to establish their initial quantum strategy.

-   **Player 1's Prep:**
    -   Starts with unlimited actions.
    -   Cards cost **0 mana**.
    -   Can **only target their own qubits**.
    -   The goal is to apply gates like Hadamard to create superposition and set up their board.
    -   Once finished, they press "End Prep".
-   **CPU's Prep:**
    -   The CPU takes its preparation turn under the same rules.
    -   After the CPU finishes, the Preparation Phase is over, and the Battle Phase begins.

### Turn 2 onwards: The Battle Phase

Now the real conflict begins.

-   **Turn Start:**
    -   The current player's mana is refilled to their `maxMana`. `maxMana` starts at 2 and increases by 1 at the start of each of Player 1's turns (e.g., Turn 2 = 2 mana, Turn 3 = 3 mana, etc., up to a maximum of 10).
-   **Actions:**
    -   Players can take up to **TWO actions** per turn.
    -   An **action** consists of playing one card from your hand.
    -   You must have enough mana to pay the card's cost.
-   **Targeting:**
    -   Players can now target their own qubits or the opponent's qubits.
    -   Be mindful of how multi-qubit gates work across different systems (see Card Reference).
-   **Turn End:**
    -   When a player has taken their actions (or chooses to act no further), they click "End Turn".
    -   At the end of their turn, they draw cards until their hand is full.
    -   The game checks the win condition for the player who just ended their turn.

---

## Quantum Concepts

-   **|0⟩ (Zero State):** The ground state. Represented by **blue**.
-   **|1⟩ (One State):** The excited state. Represented by **red**.
-   **|Ψ⟩ (Superposition):** The qubit exists as a combination of |0⟩ and |1⟩ simultaneously. It has a *probability* of being either one upon measurement. Represented by **purple**.
-   **Measurement:** The act of observing a qubit. This forces a qubit in superposition to "choose" a definite state, collapsing to either |0⟩ or |1⟩ based on its probabilities. This can have ripple effects on other qubits that are entangled with it.

---

## Card Reference

### Single-Qubit Gates

-   **Hadamard (H)**
    -   **Cost:** 1
    -   **Targets:** 1
    -   **Effect:** Puts a target qubit into a superposition state. If the qubit is already in superposition, it can return it to a classical state. A fundamental card for setting up your quantum system.

-   **Pauli-X (X)**
    -   **Cost:** 1
    -   **Targets:** 1
    -   **Effect:** The "quantum NOT gate". It flips a qubit's state between |0⟩ and |1⟩. Applying it to a superposition modifies its probabilities.

-   **Pauli-Z (Z)**
    -   **Cost:** 1
    -   **Targets:** 1
    -   **Effect:** A phase-flip gate. It leaves |0⟩ unchanged but flips the phase of |1⟩. Its effect is most noticeable on qubits in superposition.

-   **Measurement (M)**
    -   **Cost:** 2
    -   **Targets:** 1
    -   **Effect:** Measures a target qubit, collapsing its state to either |0⟩ or |1⟩. This is a powerful tool for disrupting an opponent's superposition-based strategy and forcing their system towards a known state.

### Multi-Qubit Gates

These gates create entanglement between qubits.

-   **CNOT (Controlled-NOT)**
    -   **Cost:** 2
    -   **Targets:** 2 (1 Control, 1 Target)
    -   **Effect:** Applies a Pauli-X gate to the *Target* qubit **if and only if** the *Control* qubit is in the |1⟩ state.
    -   **Cross-Player Targeting:** If the Control and Target qubits belong to different players, the Control qubit is measured first. If the outcome is |1⟩, the Pauli-X gate is applied to the Target.

-   **SWAP**
    -   **Cost:** 3
    -   **Targets:** 2 (Qubit A, Qubit B)
    -   **Effect:** Swaps the quantum states of two target qubits.
    -   **Cross-Player Targeting:** Swapping states between players is complex. If both qubits are in classical states (|0⟩ or |1⟩), their states are simply flipped. If either is in superposition, the effect is less direct due to the lack of a shared quantum system.

-   **Toffoli (CCNOT)**
    -   **Cost:** 3
    -   **Targets:** 3 (2 Controls, 1 Target)
    -   **Effect:** The "Controlled-Controlled-NOT" gate. It applies a Pauli-X gate to the *Target* qubit **if and only if** *both* Control qubits are in the |1⟩ state.
    -   **Cross-Player Targeting:** If the controls and target are on different systems, both control qubits are measured. If both outcomes are |1⟩, the Pauli-X is applied to the Target.

---
*These rules and card effects are subject to change in future updates.*
