
import React from 'react';
import { ALL_CARDS } from '../constants';

interface RulesScreenProps {
    onBack: () => void;
    t: (key: string, params?: any) => string;
}

const RuleSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-2xl font-bold text-cyan-300 mb-3 border-b-2 border-cyan-700 pb-1">{title}</h3>
        <div className="space-y-2 text-gray-300">{children}</div>
    </div>
);

const QubitState: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <code className="bg-gray-700 text-yellow-300 font-mono rounded px-1 py-0.5 text-sm">{children}</code>
);

const createMarkup = (htmlString: string) => {
    return { __html: htmlString };
};

export const RulesScreen: React.FC<RulesScreenProps> = ({ onBack, t }) => {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-mono flex flex-col items-center p-4">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <div className="relative z-10 w-full max-w-4xl">
                <header className="text-center mb-6">
                    <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 tracking-widest" style={{ textShadow: '0 0 15px #06b6d4' }}>
                        {t('rulesScreen.title')}
                    </h1>
                    <h2 className="text-lg text-gray-400 mt-2">{t('rulesScreen.subtitle')}</h2>
                </header>

                <div className="bg-gray-800 bg-opacity-70 border-2 border-cyan-700 rounded-lg p-4 md:p-6 h-[70vh] overflow-y-auto text-left mb-6 text-base leading-relaxed">
                    <RuleSection title={t('rulesScreen.objectiveTitle')}>
                        <p dangerouslySetInnerHTML={createMarkup(t('rulesScreen.objectiveText'))} />
                    </RuleSection>

                    <RuleSection title={t('rulesScreen.setupTitle')}>
                        <ul className="list-disc list-inside space-y-2">
                            <li dangerouslySetInnerHTML={createMarkup(t('rulesScreen.setupQubits'))} />
                            <li dangerouslySetInnerHTML={createMarkup(t('rulesScreen.setupDeck'))} />
                            <li dangerouslySetInnerHTML={createMarkup(t('rulesScreen.setupHand'))} />
                            <li dangerouslySetInnerHTML={createMarkup(t('rulesScreen.setupMana'))} />
                        </ul>
                    </RuleSection>

                    <hr className="border-cyan-800 my-6" />

                    <RuleSection title={t('rulesScreen.flowTitle')}>
                        <h4 className="text-xl font-semibold text-cyan-200 mb-2">{t('rulesScreen.flowPrepTitle')}</h4>
                        <p className="mb-4">{t('rulesScreen.flowPrepText')}</p>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li>
                                <span dangerouslySetInnerHTML={createMarkup(t('rulesScreen.flowPrepP1'))} />
                                <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                                    {t('rulesScreen.flowPrepP1Rules').split('||').map((rule: string, i: number) => <li key={i} dangerouslySetInnerHTML={createMarkup(rule)} />)}
                                </ul>
                            </li>
                            <li className="mt-2">
                                <span dangerouslySetInnerHTML={createMarkup(t('rulesScreen.flowPrepCPU'))} />
                                <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                                   {t('rulesScreen.flowPrepCPURules').split('||').map((rule: string, i: number) => <li key={i} dangerouslySetInnerHTML={createMarkup(rule)} />)}
                                </ul>
                            </li>
                        </ul>

                        <h4 className="text-xl font-semibold text-cyan-200 mt-6 mb-2">{t('rulesScreen.flowBattleTitle')}</h4>
                        <p className="mb-4">{t('rulesScreen.flowBattleText')}</p>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li>
                                <strong dangerouslySetInnerHTML={createMarkup(t('rulesScreen.flowBattleTurnStart'))} />
                                <p dangerouslySetInnerHTML={createMarkup(t('rulesScreen.flowBattleTurnStartText'))} />
                            </li>
                            <li>
                                <strong dangerouslySetInnerHTML={createMarkup(t('rulesScreen.flowBattleActions'))} />
                                <p dangerouslySetInnerHTML={createMarkup(t('rulesScreen.flowBattleActionsText'))} />
                            </li>
                            <li>
                                <strong dangerouslySetInnerHTML={createMarkup(t('rulesScreen.flowBattleTargeting'))} />
                                <p dangerouslySetInnerHTML={createMarkup(t('rulesScreen.flowBattleTargetingText'))} />
                            </li>
                             <li>
                                <strong dangerouslySetInnerHTML={createMarkup(t('rulesScreen.flowBattleTurnEnd'))} />
                                <p dangerouslySetInnerHTML={createMarkup(t('rulesScreen.flowBattleTurnEndText'))} />
                            </li>
                        </ul>
                    </RuleSection>
                    
                    <hr className="border-cyan-800 my-6" />

                    <RuleSection title={t('rulesScreen.conceptsTitle')}>
                        <ul className="list-disc list-inside space-y-2">
                             <li dangerouslySetInnerHTML={createMarkup(t('rulesScreen.conceptZero'))} />
                             <li dangerouslySetInnerHTML={createMarkup(t('rulesScreen.conceptOne'))} />
                             <li dangerouslySetInnerHTML={createMarkup(t('rulesScreen.conceptSuperposition'))} />
                             <li dangerouslySetInnerHTML={createMarkup(t('rulesScreen.conceptMeasurement'))} />
                        </ul>
                    </RuleSection>
                    
                     <hr className="border-cyan-800 my-6" />

                    <RuleSection title={t('rulesScreen.cardsTitle')}>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-xl font-semibold text-cyan-200 mb-2">{t('rulesScreen.cardsSingleTitle')}</h4>
                                <ul className="list-disc list-inside space-y-3 pl-4">
                                    {ALL_CARDS.filter(c => c.type === 'single').map(card => (
                                        <li key={card.id}>
                                            <strong>{t(card.name)}</strong> (Cost: {card.cost}, Targets: {card.targets}): {t(card.description)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold text-cyan-200 mb-2">{t('rulesScreen.cardsMultiTitle')}</h4>
                                 <p className="mb-2 pl-4">{t('rulesScreen.cardsMultiText')}</p>
                                <ul className="list-disc list-inside space-y-3 pl-4">
                                     {ALL_CARDS.filter(c => c.type !== 'single').map(card => (
                                         <li key={card.id}>
                                            <strong>{t(card.name)}</strong> (Cost: {card.cost}, Targets: {card.targets} - {card.roles?.map(r => t(r)).join(', ')}): {t(card.description)}
                                            <br/>
                                            {card.id === 'cnot' && <span dangerouslySetInnerHTML={createMarkup(t('rulesScreen.cardsCrossPlayer'))} />}
                                            {card.id === 'swap' && <span dangerouslySetInnerHTML={createMarkup(t('rulesScreen.cardsSwapCrossPlayer'))} />}
                                            {card.id === 'toffoli' && <span dangerouslySetInnerHTML={createMarkup(t('rulesScreen.cardsToffoliCrossPlayer'))} />}
                                         </li>
                                     ))}
                                </ul>
                            </div>
                        </div>
                    </RuleSection>
                    
                    <p className="text-center text-sm text-gray-500 mt-8 italic">{t('rulesScreen.footer')}</p>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={onBack}
                        className="w-48 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white text-lg font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
                    >
                        {t('rulesScreen.backToHome')}
                    </button>
                </div>
            </div>
        </div>
    );
};
