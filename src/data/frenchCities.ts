// Top French cities for autocomplete
export const FRENCH_CITIES = [
  "Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier",
  "Bordeaux", "Lille", "Rennes", "Reims", "Le Havre", "Saint-Étienne", "Toulon",
  "Grenoble", "Dijon", "Angers", "Nîmes", "Villeurbanne", "Le Mans", "Aix-en-Provence",
  "Clermont-Ferrand", "Brest", "Tours", "Limoges", "Amiens", "Perpignan", "Metz",
  "Besançon", "Orléans", "Rouen", "Mulhouse", "Caen", "Nancy", "Argenteuil",
  "Saint-Denis", "Montreuil", "Roubaix", "Tourcoing", "Avignon", "Dunkerque",
  "Nanterre", "Poitiers", "Créteil", "Versailles", "Pau", "Colombes",
  "Asnières-sur-Seine", "Rueil-Malmaison", "Vitry-sur-Seine", "Calais", "Antibes",
  "La Rochelle", "Cannes", "Béziers", "Saint-Nazaire", "Valence", "Quimper",
  "Troyes", "Chambéry", "Lorient", "Niort", "Sarcelles", "Pessac", "Ivry-sur-Seine",
  "Cergy", "Ajaccio", "Bastia", "La Seyne-sur-Mer", "Blois", "Cholet", "Vannes",
  "Arles", "Aubagne", "Boulogne-Billancourt", "Saint-Malo", "Beauvais", "Cherbourg",
  "Épinal", "Chalon-sur-Saône", "Charleville-Mézières", "Belfort", "Albi", "Montauban",
  "Bourg-en-Bresse", "Châteauroux", "Colmar", "Tarbes", "Laval", "Compiègne",
  "Évreux", "Dax", "Bayonne", "Biarritz", "Agen", "Angoulême", "Gap", "Mâcon",
  "Aurillac", "Vichy", "Fréjus", "Hyères", "Draguignan", "Thonon-les-Bains",
  "Annecy", "Brive-la-Gaillarde", "Périgueux", "Rodez", "Alès", "Sète",
  "Carcassonne", "Salon-de-Provence", "Istres", "Martigues", "Grasse",
  "Saint-Raphaël", "Menton", "Monaco", "Fontainebleau", "Meaux", "Melun",
  "Évry", "Corbeil-Essonnes", "Massy", "Palaiseau", "Saint-Germain-en-Laye",
  "Poissy", "Sartrouville", "Maisons-Alfort", "Chelles", "Clamart", "Sevran",
  "Bondy", "Villepinte", "Aulnay-sous-Bois", "Épinay-sur-Seine", "Pantin",
  "Le Blanc-Mesnil", "Drancy", "Gagny", "Rosny-sous-Bois", "Noisy-le-Grand",
  "Vincennes", "Fontenay-sous-Bois", "Champigny-sur-Marne", "Saint-Maur-des-Fossés"
];

export function searchCities(query: string, limit = 8): string[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return FRENCH_CITIES
    .filter(city => {
      const normalized = city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return normalized.startsWith(q) || normalized.includes(q);
    })
    .slice(0, limit);
}
