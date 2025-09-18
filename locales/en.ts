
export const en = {
  lang: 'EN',
  toggleLang: 'JP',
  // Home Screen
  homeScreen: {
    title: 'Quantum Gate',
    startGame: 'CPU vs AI',
    viewLog: 'View Last Game Log',
    rules: 'Rules',
    settings: 'Settings',
  },
  // Game Board
  gameBoard: {
    turn: 'Turn',
    actions: 'Actions',
    endPrep: 'End Prep',
    endTurn: 'End Turn',
    cpuThinking: 'CPU is thinking...',
    playerTurn: "{playerName}'s Turn",
    playerPrep: "{playerName}'s Preparation",
  },
  // Player Area
  playerArea: {
    deck: 'Deck',
    mana: 'Mana',
    player1Name: 'Player 1',
    cpuName: 'CPU Opponent',
  },
  qubitDisplay: {
    your: 'Your',
    opp: 'Opp',
  },
  // Card Display
  cardDisplay: {
    single: 'Single-Qubit Gate',
    two: 'Two-Qubit Gate',
    three: 'Three-Qubit Gate',
  },
  // Cards
  cards: {
    h_name: 'Hadamard (H)',
    h_desc: 'Puts a target qubit into a superposition state.',
    x_name: 'Pauli-X (X)',
    x_desc: "Flips a target qubit's state (|0⟩ ↔ |1⟩).",
    z_name: 'Pauli-Z (Z)',
    z_desc: 'Flips the phase of a target qubit.',
    cnot_name: 'CNOT',
    cnot_desc: 'Uses a control qubit to flip a target qubit.',
    swap_name: 'SWAP',
    swap_desc: 'Swaps the state of two target qubits.',
    measure_name: 'Measurement',
    measure_desc: 'Measures a qubit, collapsing its state to |0⟩ or |1⟩.',
    toffoli_name: 'Toffoli',
    toffoli_desc: 'Uses two control qubits to flip a target qubit.',
  },
  cardRoles: {
    control: 'Control',
    target: 'Target',
    control1: 'Control 1',
    control2: 'Control 2',
    qubitA: 'Qubit A',
    qubitB: 'Qubit B',
  },
  // Game Over
  gameOver: {
    title: 'Game Over',
    victoryMessage: '{winnerName} has achieved victory!',
    backToHome: 'Back to Home',
  },
  // Settings
  settings: {
    title: 'Settings',
    qubitCount: 'Qubit Count: ',
    advCardView: 'Advanced Card View',
    advCardViewDesc: '(Symbols only)',
    debugMode: 'Debug Mode',
    note: 'Note: Changing settings will restart the current game.',
    cancel: 'Cancel',
    save: 'Save & Apply',
  },
  // Log Screen
  logScreen: {
    title: 'Game Log',
    backToHome: 'Back to Home',
    copy: 'Copy Log',
    copied: 'Copied!',
  },
  // Rules Screen
  rulesScreen: {
    title: 'Game Rules',
    subtitle: 'Quantum Gate: The Card Game',
    backToHome: 'Back to Home',
    objectiveTitle: 'Objective',
    objectiveText:
      "The goal of the game is to win by <strong>decoherence</strong>. You win if, at the end of any turn, you have forced your opponent's entire quantum system into the ground state, represented as |00...0⟩. This means every one of their qubits is in the definite |0⟩ state with near-certainty (>99.9% probability).",
    setupTitle: 'Game Setup',
    setupQubits:
      '<strong>Qubits:</strong> Both players start with a set number of qubits (default is 3), all initialized to the ground state |0⟩. The collection of all qubits for a player forms their quantum register, and its "true" state is represented by a state vector.',
    setupDeck:
      '<strong>Deck:</strong> Each player starts with an identical deck of 21 cards, composed of various quantum gates.',
    setupHand:
      '<strong>Hand:</strong> Players draw an initial hand of cards. The maximum hand size is determined by the number of qubits.',
    setupMana:
      '<strong>Mana:</strong> Mana is used to play cards during the Battle Phase. Both players start with 0 mana.',
    flowTitle: 'Gameplay Flow',
    flowPrepTitle: 'Turn 1: The Preparation Phase',
    flowPrepText:
      'This is a special setup turn for both players to establish their initial quantum strategy.',
    flowPrepP1: "<strong>Player 1's Prep:</strong>",
    flowPrepP1Rules:
      'Starts with unlimited actions.||Cards cost <strong>0 mana</strong>.||Can <strong>only target their own qubits</strong>.||The goal is to apply gates like Hadamard to create superposition and set up their board.||Once finished, they press "End Prep".',
    flowPrepCPU: "<strong>CPU's Prep:</strong>",
    flowPrepCPURules:
      'The CPU takes its preparation turn under the same rules.||After the CPU finishes, the Preparation Phase is over, and the Battle Phase begins.',
    flowBattleTitle: 'Turn 2 onwards: The Battle Phase',
    flowBattleText: 'Now the real conflict begins.',
    flowBattleTurnStart: '<strong>Turn Start:</strong>',
    flowBattleTurnStartText:
      "The current player's mana is refilled to their <code>maxMana</code>. <code>maxMana</code> starts at 2 and increases by 1 at the start of each of Player 1's turns (e.g., Turn 2 = 2 mana, Turn 3 = 3 mana, etc., up to a maximum of 10).",
    flowBattleActions: '<strong>Actions:</strong>',
    flowBattleActionsText:
      'Players can take up to <strong>TWO actions</strong> per turn. An <strong>action</strong> consists of playing one card from your hand. You must have enough mana to pay the card\'s cost.',
    flowBattleTargeting: '<strong>Targeting:</strong>',
    flowBattleTargetingText:
      "Players can now target their own qubits or the opponent's qubits. Be mindful of how multi-qubit gates work across different systems (see Card Reference).",
    flowBattleTurnEnd: '<strong>Turn End:</strong>',
    flowBattleTurnEndText:
      'When a player has taken their actions (or chooses to act no further), they click "End Turn". At the end of their turn, they draw cards until their hand is full. The game checks the win condition for the player who just ended their turn.',
    conceptsTitle: 'Quantum Concepts',
    conceptZero:
      '|0⟩ (Zero State): The ground state. Represented by <strong>blue</strong>.',
    conceptOne:
      '|1⟩ (One State): The excited state. Represented by <strong>red</strong>.',
    conceptSuperposition:
      '|Ψ⟩ (Superposition): The qubit exists as a combination of |0⟩ and |1⟩ simultaneously. It has a <em>probability</em> of being either one upon measurement. Represented by <strong>purple</strong>.',
    conceptMeasurement:
      '<strong>Measurement:</strong> The act of observing a qubit. This forces a qubit in superposition to "choose" a definite state, collapsing to either |0⟩ or |1⟩ based on its probabilities. This can have ripple effects on other qubits that are entangled with it.',
    cardsTitle: 'Card Reference',
    cardsSingleTitle: 'Single-Qubit Gates',
    cardsMultiTitle: 'Multi-Qubit Gates',
    cardsMultiText: 'These gates create entanglement between qubits.',
    cardsCrossPlayer:
      '<strong>Cross-Player Targeting:</strong> If the Control and Target qubits belong to different players, the Control qubit is measured first. If the outcome is |1⟩, the Pauli-X gate is applied to the Target.',
    cardsSwapCrossPlayer:
      '<strong>Cross-Player Targeting:</strong> Swapping states between players is complex. If both qubits are in classical states (|0⟩ or |1⟩), their states are simply flipped. If either is in superposition, the effect is less direct due to the lack of a shared quantum system.',
    cardsToffoliCrossPlayer:
      '<strong>Cross-Player Targeting:</strong> If the controls and target are on different systems, both control qubits are measured. If both outcomes are |1⟩, the Pauli-X is applied to the Target.',
    footer: 'These rules and card effects are subject to change in future updates.',
  },
  // Game Log Messages
  logs: {
    notEnoughMana: 'Not enough mana for {cardName}',
    gameStarted: 'Game Started. Turn 1: Preparation Phase.',
    gameOver: 'GAME OVER: {winnerName} wins!',
    playedCard: 'Turn {turn} ({playerName}): Played {cardName} on {targets}.',
    measurementResult: '> Measurement on {playerName}\'s Q{qubitId} collapsed to |{outcome}⟩.',
    cnotMeasurement: '> Control qubit measured as |{outcome}⟩.',
    toffoliMeasurement: '> Toffoli controls measured as |{o1}⟩ and |{o2}⟩.',
    p1PrepEnd: "End of Player 1's Preparation.",
    cpuPrepEnd: "End of CPU's Preparation.",
    battlePhaseStart: 'Turn 2: Battle phase begins.',
    turnEnd: '{playerName} ends turn.',
    turnStart: "Turn {turn}: {playerName}'s turn.",
    cpuNoAction: 'Turn {turn} (CPU Opponent): Takes no action.',
    cpuNoSetup: 'CPU makes no setup moves.',
    awaitingTarget: 'Action {actionNumber}: Select {role} for {cardName}.',
    awaitingNextTarget: 'Select {role}.',
  },
};
