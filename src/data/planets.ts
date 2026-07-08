const planetImageModules = {
  ...import.meta.glob<string>("../assets/planets/*.{png,jpg,jpeg,webp,svg}", {
    eager: true,
    import: "default",
  }),
  ...import.meta.glob<string>("../assets/*.{png,jpg,jpeg,webp,svg}", {
    eager: true,
    import: "default",
  }),
};

export type Planet = {
  id: string;
  name: string;
  displayName: string;
  keywords: string[];
  icon: string;
};

function findPlanetIcon(keywords: string[]) {
  const matchedEntry = Object.entries(planetImageModules).find(([path]) => {
    const normalizedPath = path.toLowerCase().replace(/[-_\s]/g, "");

    return keywords.some((keyword) =>
      normalizedPath.includes(keyword.toLowerCase().replace(/[-_\s]/g, ""))
    );
  });

  return matchedEntry?.[1] ?? "";
}

const planetDefinitions = [
  {
    id: "surya",
    name: "Surya",
    displayName: "Sun",
    keywords: ["surya", "sun", "ravi", "aditya", "solar"],
  },
  {
    id: "chandra",
    name: "Chandra",
    displayName: "Moon",
    keywords: ["chandra", "moon", "soma", "luna"],
  },
  {
    id: "mangala",
    name: "Mangala",
    displayName: "Mars",
    keywords: ["mangala", "mangal", "kuja", "mars"],
  },
  {
    id: "budha",
    name: "Budha",
    displayName: "Mercury",
    keywords: ["budha", "budh", "mercury"],
  },
  {
    id: "guru",
    name: "Guru",
    displayName: "Jupiter",
    keywords: ["guru", "brihaspati", "jupiter"],
  },
  {
    id: "shukra",
    name: "Shukra",
    displayName: "Venus",
    keywords: ["shukra", "sukra", "venus"],
  },
  {
    id: "shani",
    name: "Shani",
    displayName: "Saturn",
    keywords: ["shani", "sani", "saturn"],
  },
  {
    id: "rahu",
    name: "Rahu",
    displayName: "Rahu",
    keywords: ["rahu"],
  },
  {
    id: "ketu",
    name: "Ketu",
    displayName: "Ketu",
    keywords: ["ketu"],
  },
];

export const planets: Planet[] = planetDefinitions.map((planet) => ({
  ...planet,
  icon: findPlanetIcon(planet.keywords),
}));

export function getPlanetIcon(planetId: string) {
  return planets.find((planet) => planet.id === planetId)?.icon ?? "";
}
