export type TranslateInput = {
  text: string;
  targetLanguage: string;
};

export async function translateText({ text, targetLanguage }: TranslateInput): Promise<string> {
  if (!text) {
    return '';
  }
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(
      text
    )}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // The response is a nested array, the translated text is in the first element.
    const translatedText = data[0].map((item: any) => item[0]).join('');
    return translatedText;
  } catch (error) {
    console.error('Translation failed:', error);
    // Fallback to original text if translation fails
    return text;
  }
}
