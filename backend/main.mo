import Text "mo:base/Text";

import Array "mo:base/Array";
import Buffer "mo:base/Buffer";

actor {
    // Define the Translation type
    public type Translation = {
        sourceText: Text;
        translatedText: Text;
        targetLanguage: Text;
    };

    // Store translations in a stable variable
    private stable var translations : [Translation] = [];
    private let translationsBuffer = Buffer.Buffer<Translation>(0);

    // Initialize buffer with stable data
    private func initBuffer() {
        for (translation in translations.vals()) {
            translationsBuffer.add(translation);
        };
    };

    // Initialize the buffer when actor is created
    if (translationsBuffer.size() == 0) { initBuffer() };

    // Add a new translation
    public shared func addTranslation(sourceText: Text, translatedText: Text, targetLanguage: Text) : async () {
        let translation: Translation = {
            sourceText = sourceText;
            translatedText = translatedText;
            targetLanguage = targetLanguage;
        };
        translationsBuffer.add(translation);
        
        // Keep only the last 10 translations
        while (translationsBuffer.size() > 10) {
            ignore translationsBuffer.removeLast();
        };
    };

    // Get translation history
    public query func getTranslationHistory() : async [Translation] {
        Buffer.toArray(translationsBuffer)
    };

    // System functions for upgrades
    system func preupgrade() {
        translations := Buffer.toArray(translationsBuffer);
    };

    system func postupgrade() {
        initBuffer();
    };
}
