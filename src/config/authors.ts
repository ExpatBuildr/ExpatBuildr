export interface Author {
  id: string;
  name: string;
  handle: string;
  bio: string;
  avatar: string;
  links: {
    twitter?: string;
    youtube?: string;
    newsletter?: string;
    instagram?: string;
  };
}

export const authors: Record<string, Author> = {
  ExpatBuildr: {
    id: 'ExpatBuildr',
    name: 'Tony Long II',
    handle: '@expatbuilder',
    bio: 'Solopreneur, systems architect, and founder of Galaxy Arbitrage. I left the traditional income trap and built a location-independent business from Southeast Asia. Now I document exactly how through weekly intel on geo-arbitrage, remote income, and automation. If you earn in dollars and spend in pesos, this is for you.',
    avatar: '/authors/galaxy.jpg',
    links: {
      twitter: 'https://x.com/expatbuilder',
      youtube: 'https://www.youtube.com/@expatbuildr',
      newsletter: '/newsletter',
      instagram: 'https://www.instagram.com/expatbuildr',
    },
  },
};

export const getAuthor = (id: string): Author | undefined => authors[id];
