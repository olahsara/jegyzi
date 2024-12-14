import { Injectable } from '@angular/core';
import { ChatSession, GoogleGenerativeAI } from '@google/generative-ai';
import { AI_API_KEY } from '../../../environment/environment';

export interface ExampleResult {
  resultText: string;
  session: ChatSession;
}
/** Szövegek generálásáért felelős szolgáltatás */
@Injectable()
export class TextGenerateService {
  private genAI = new GoogleGenerativeAI(AI_API_KEY);
  private model = this.genAI.getGenerativeModel({
    model: 'gemini-1.0-pro',
  });

  /** Generátor beállítása */
  private generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: 'text/plain',
  };

  /**
   * Példafeladat generálása
   * @param note a jegyzet szövege amihez a feladatokat generálni kell
   * @param session ha volt előző feladatgenerálás már, akkor a hozzá tartozó  ChatSession
   * @returns
   */
  async exampleGenerator(note: string, session?: ChatSession) {
    if (session) {
      const result = await session.sendMessage(
        'Készíts új példafeladatokat az előző szöveghez, de a válaszokat ne add meg! (formátuma legyen: számozása keződőjön újra egytől és legyen rövid címe is a feladatoknak. A cím és a számozás felkövér legyen.)',
      );
      return { resultText: result.response.text(), session: session } as ExampleResult;
    } else {
      const chatSession = this.model.startChat({
        generationConfig: this.generationConfig,
        history: [
          {
            role: 'user',
            parts: [
              {
                text: note,
              },
            ],
          },
        ],
      });

      const result = await chatSession.sendMessage(
        'Készíts példafeladatokat az előző szöveghez, de a válaszokat ne add meg! (formátuma legyen: számozása eggyel kezdődőjön és legyen rövid címe is a feladatoknak. A cím és a számozás felkövér legyen.)',
      );

      return { resultText: result.response.text(), session: chatSession } as ExampleResult;
    }
  }

  async answerGenerator(session: ChatSession) {
    const result = await session.sendMessage('Írd meg a megoldásokat a legutóbbi generálás során generált feladatokhoz');
    return { resultText: result.response.text(), session: session } as ExampleResult;
  }
}
