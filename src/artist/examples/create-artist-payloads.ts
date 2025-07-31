/**
 * Example payloads for CreateArtistDto
 * 
 * POST /artists
 * Content-Type: application/json
 */

// Minimal payload (only required fields)
export const minimalArtistPayload = {
  "name": "Taylor Swift"
};

// Complete payload (all fields)
export const completeArtistPayload = {
  "name": "The Weeknd",
  "bio": "Canadian singer, songwriter, and record producer known for his distinctive voice and dark, atmospheric music.",
  "profilePicture": "https://example.com/images/theweeknd.jpg",
  "genre": "R&B, Pop, Alternative R&B",
  "debutDate": "2011-03-21",
  "country": "Canada",
  "recordLabel": "XO, Republic Records"
};

// Indie artist payload
export const indieArtistPayload = {
  "name": "Arctic Monkeys",
  "bio": "English rock band formed in Sheffield in 2002.",
  "genre": "Indie Rock, Alternative Rock",
  "debutDate": "2005-06-13",
  "country": "United Kingdom",
  "recordLabel": "Domino Recording Company"
};

// New artist payload (minimal info)
export const newArtistPayload = {
  "name": "Rising Star",
  "genre": "Pop",
  "country": "United States"
};
