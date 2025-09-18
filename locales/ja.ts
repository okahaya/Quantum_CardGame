
export const ja = {
  lang: 'JP',
  toggleLang: 'EN',
  // Home Screen
  homeScreen: {
    title: '量子ゲート',
    startGame: 'CPU対戦',
    viewLog: '前回のゲームログを見る',
    rules: 'ルール',
    settings: '設定',
  },
  // Game Board
  gameBoard: {
    turn: 'ターン',
    actions: 'アクション',
    endPrep: '準備完了',
    endTurn: 'ターン終了',
    cpuThinking: 'CPU思考中...',
    playerTurn: '{playerName}のターン',
    playerPrep: '{playerName}の準備',
  },
  // Player Area
  playerArea: {
    deck: '山札',
    mana: 'マナ',
    player1Name: 'プレイヤー1',
    cpuName: 'CPU',
  },
  qubitDisplay: {
    your: '自分',
    opp: '相手',
  },
  // Card Display
  cardDisplay: {
    single: '単一量子ビットゲート',
    two: '2量子ビットゲート',
    three: '3量子ビットゲート',
  },
  // Cards
  cards: {
    h_name: 'アダマール (H)',
    h_desc: '対象の量子ビットを重ね合わせ状態にします。',
    x_name: 'パウリX (X)',
    x_desc: '対象の量子ビットの状態を反転させます (|0⟩ ↔ |1⟩)。',
    z_name: 'パウリZ (Z)',
    z_desc: '対象の量子ビットの位相を反転させます。',
    cnot_name: 'CNOT',
    cnot_desc: '制御量子ビットを使い、対象の量子ビットを反転させます。',
    swap_name: 'SWAP',
    swap_desc: '2つの対象量子ビットの状態を交換します。',
    measure_name: '測定',
    measure_desc: '量子ビットを測定し、状態を|0⟩か|1⟩に収束させます。',
    toffoli_name: 'トフォリ',
    toffoli_desc: '2つの制御量子ビットを使い、対象の量子ビットを反転させます。',
  },
  cardRoles: {
    control: '制御',
    target: '対象',
    control1: '制御1',
    control2: '制御2',
    qubitA: '量子ビットA',
    qubitB: '量子ビットB',
  },
  // Game Over
  gameOver: {
    title: 'ゲーム終了',
    victoryMessage: '{winnerName}の勝利です！',
    backToHome: 'ホームに戻る',
  },
  // Settings
  settings: {
    title: '設定',
    qubitCount: '量子ビット数: ',
    advCardView: '上級者向けカード表示',
    advCardViewDesc: '(記号のみ)',
    debugMode: 'デバッグモード',
    note: '注意: 設定を変更すると現在のゲームはリスタートします。',
    cancel: 'キャンセル',
    save: '保存して適用',
  },
  // Log Screen
  logScreen: {
    title: 'ゲームログ',
    backToHome: 'ホームに戻る',
    copy: 'ログをコピー',
    copied: 'コピーしました！',
  },
  // Rules Screen
  rulesScreen: {
    title: 'ゲームルール',
    subtitle: 'Quantum Gate: The Card Game',
    backToHome: 'ホームに戻る',
    objectiveTitle: '勝利条件',
    objectiveText:
      'このゲームの勝利条件は、相手の量子システムを<strong>「デコヒーレンス」</strong>させることです。ターンの終わりに、相手のすべての量子ビットが基底状態 |0⟩ に収束している（<strong>|00...0⟩</strong> の状態になっている）場合、あなたの勝利となります。',
    setupTitle: 'ゲームの準備',
    setupQubits:
      '<strong>量子ビット:</strong> 両プレイヤーは、定められた数の量子ビット（デフォルトは3）を持ってゲームを開始します。これらは全て基底状態<strong>|0⟩</strong>に初期化されています。プレイヤーの全量子ビットの集合が量子レジスタを形成し、その「真」の状態は状態ベクトルによって表現されます。',
    setupDeck:
      '<strong>デッキ:</strong> 各プレイヤーは、様々な量子ゲートから成る21枚の同一のデッキで開始します。',
    setupHand:
      '<strong>手札:</strong> プレイヤーは最初に手札を引きます。最大手札枚数は量子ビットの数によって決まります。',
    setupMana:
      '<strong>マナ:</strong> マナはバトルフェーズ中にカードを使用するために使います。両プレイヤーは0マナから開始します。',
    flowTitle: 'ゲームの流れ',
    flowPrepTitle: 'ターン1: 準備フェーズ',
    flowPrepText: '両プレイヤーが初期戦略を確立するための、特別な準備ターンです。',
    flowPrepP1: '<strong>プレイヤー1の準備:</strong>',
    flowPrepP1Rules:
      'アクション回数は無制限。||カードのコストは<strong>0マナ</strong>。||対象にできるのは<strong>自分の量子ビットのみ</strong>。||アダマールゲート等で重ね合わせ状態を作り、盤面を整えるのが目的です。||完了したら「準備完了」を押します。',
    flowPrepCPU: '<strong>CPUの準備:</strong>',
    flowPrepCPURules:
      'CPUも同じルールで準備ターンを行います。||CPUの準備完了後、バトルフェーズが始まります。',
    flowBattleTitle: 'ターン2以降: バトルフェーズ',
    flowBattleText: 'ここから本格的な戦いが始まります。',
    flowBattleTurnStart: '<strong>ターン開始時:</strong>',
    flowBattleTurnStartText:
      '現在のプレイヤーのマナが<code>maxMana</code>まで補充されます。<code>maxMana</code>は2から始まり、プレイヤー1のターンが来るごとに1ずつ増加します（例: ターン2は2マナ, ターン3は3マナ... 最大10まで）。',
    flowBattleActions: '<strong>アクション:</strong>',
    flowBattleActionsText:
      '1ターンに最大<strong>2回</strong>のアクションを行えます。<strong>アクション</strong>とは、手札のカードを1枚使用することです。カードのコスト分のマナが必要です。',
    flowBattleTargeting: '<strong>ターゲット選択:</strong>',
    flowBattleTargetingText:
      '自分または相手の量子ビットを対象に選択できます。複数量子ビットゲートが異なるシステム間でどう機能するかに注意してください（カードリファレンス参照）。',
    flowBattleTurnEnd: '<strong>ターン終了時:</strong>',
    flowBattleTurnEndText:
      'アクションを終えたら「ターン終了」を押します。ターン終了時に、手札が最大枚数になるまでカードを補充します。その後、ターンを終了したプレイヤーの勝利条件がチェックされます。',
    conceptsTitle: '量子の概念',
    conceptZero: '<strong>|0⟩ (ゼロ状態):</strong> 基底状態。<strong>青色</strong>で表現されます。',
    conceptOne: '<strong>|1⟩ (いち状態):</strong> 励起状態。<strong>赤色</strong>で表現されます。',
    conceptSuperposition:
      '<strong>|Ψ⟩ (重ね合わせ状態):</strong> 量子ビットが|0⟩と|1⟩を同時に併せ持つ状態。測定時にはどちらかの状態に「確率」で収束します。<strong>紫色</strong>で表現されます。',
    conceptMeasurement:
      '<strong>測定:</strong> 量子ビットを観測する行為。これにより、重ね合わせ状態の量子ビットは、確率に基づいて|0⟩か|1⟩のどちらかの確定状態に「収束」します。これは、その量子ビットとエンタングルしている他の量子ビットにも影響を与えることがあります。',
    cardsTitle: 'カードリファレンス',
    cardsSingleTitle: '単一量子ビットゲート',
    cardsMultiTitle: '複数量子ビットゲート',
    cardsMultiText: 'これらのゲートは、量子ビット間にエンタングルメント（量子もつれ）を生み出します。',
    cardsCrossPlayer:
      '<strong>プレイヤー間での使用:</strong> 制御ビットと対象ビットが異なるプレイヤーに属する場合、まず制御ビットが測定されます。結果が|1⟩であれば、対象ビットにパウリXゲートが適用されます。',
    cardsSwapCrossPlayer:
      '<strong>プレイヤー間での使用:</strong> プレイヤー間で状態を交換するのは複雑です。両方の量子ビットが古典的な状態（|0⟩または|1⟩）にある場合、それぞれの状態が反転します。どちらかが重ね合わせ状態にある場合、共有された量子システムがないため、効果は直接的ではありません。',
    cardsToffoliCrossPlayer:
      '<strong>プレイヤー間での使用:</strong> 制御ビットと対象ビットが異なるシステム上にある場合、両方の制御ビットが測定されます。両方の結果が|1⟩であれば、対象ビットにパウリXが適用されます。',
    footer: 'これらのルールやカードの効果は、将来のアップデートで変更される可能性があります。',
  },
  // Game Log Messages
  logs: {
    notEnoughMana: '{cardName}のためのマナが足りません。',
    gameStarted: 'ゲーム開始。ターン1: 準備フェーズ。',
    gameOver: 'ゲーム終了: {winnerName}の勝利！',
    playedCard: 'ターン{turn} ({playerName}): {cardName}を{targets}に使用。',
    measurementResult: '> {playerName}のQ{qubitId}を測定、|{outcome}⟩に収束。',
    cnotMeasurement: '> 制御ビットの測定結果は|{outcome}⟩。',
    toffoliMeasurement: '> トフォリの制御ビット測定結果は|{o1}⟩と|{o2}⟩。',
    p1PrepEnd: 'プレイヤー1の準備が完了。',
    cpuPrepEnd: 'CPUの準備が完了。',
    battlePhaseStart: 'ターン2: バトルフェーズ開始。',
    turnEnd: '{playerName}がターンを終了。',
    turnStart: 'ターン{turn}: {playerName}のターン。',
    cpuNoAction: 'ターン{turn} (CPU): アクションなし。',
    cpuNoSetup: 'CPUは準備フェーズでアクションしませんでした。',
    awaitingTarget: 'アクション {actionNumber}: {cardName}の{role}を選択してください。',
    awaitingNextTarget: '{role}を選択してください。',
  },
};
