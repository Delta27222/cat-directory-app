import { httpClient } from '../httpClient';

export interface FunFact {
  fact: string;
}

/** Un dato curioso al azar (`GET /fact`). */
export const getFunFact = async (): Promise<FunFact> => {
  const response = await httpClient.get<{ fact: string }>('/fact', {
    revalidate: 60,
  });
  return { fact: response.fact };
};
