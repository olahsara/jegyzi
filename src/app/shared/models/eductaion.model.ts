/** Oktatás interfész */
export interface Education {
  type: string;
  year: number;
  specialization: string;
  institution: string;
}

/** Oktatás lehetséges típusai */
export const EducationType = {
  primary: 'Általános iskola',
  secondary: 'Középiskola',
  upper: 'Főiskola',
  university: 'Egyetem',
};
