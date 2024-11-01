export const idlFactory = ({ IDL }) => {
  const Translation = IDL.Record({
    'sourceText' : IDL.Text,
    'targetLanguage' : IDL.Text,
    'translatedText' : IDL.Text,
  });
  return IDL.Service({
    'addTranslation' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [], []),
    'getTranslationHistory' : IDL.Func([], [IDL.Vec(Translation)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
