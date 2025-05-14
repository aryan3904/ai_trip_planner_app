//  import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env["VITE_GOOGLE_GEMINI_AI_API_KEY"];
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Generate Travel Plan for Location: Las Vegas, for 3 Days for Couple with a Cheap budget, Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, rating, Time travel each of the location for 3 days with each day plan with best time to visit in JSON format.\n",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "(your previous response goes here)"
        }
      ]
    }
  ]
});

export const AI_PROMPT = `
Generate a travel plan for:
- Location: {location}
- Duration: {totalDays} days
- Traveler type: {traveler}
- Budget: {budget}

Strictly respond ONLY in this JSON format (no extra explanation or notes):

{
  "trip": {
    "destination": "{location}",
    "duration": "{totalDays} Days",
    "travelers": "{traveler}",
    "budget": "{budget}"
  },
  "hotels": [
    {
      "hotelName": "Hotel A",
      "hotelAddress": "123 Example Street, City",
      "price": "$80 per night",
      "hotelImageUrl": "https://example.com/hotelA.jpg",
      "geoCoordinates": { "latitude": 0.0, "longitude": 0.0 },
      "rating": "4.1",
      "description": "Affordable and centrally located."
    },
    {
      "hotelName": "Hotel B",
      "hotelAddress": "456 Avenue, City",
      "price": "$95 per night",
      "hotelImageUrl": "https://example.com/hotelB.jpg",
      "geoCoordinates": { "latitude": 0.0, "longitude": 0.0 },
      "rating": "4.3",
      "description": "Modern amenities with great reviews."
    },
    {
      "hotelName": "Hotel C",
      "hotelAddress": "789 Road, City",
      "price": "$110 per night",
      "hotelImageUrl": "https://example.com/hotelC.jpg",
      "geoCoordinates": { "latitude": 0.0, "longitude": 0.0 },
      "rating": "4.5",
      "description": "Stylish and comfortable option."
    }
  ],
  "itinerary": {
    "day1": [
      {
        "placeName": "Place Name",
        "placeDetails": "Details about the place",
        "placeImageUrl": "https://example.com/place1.jpg",
        "geoCoordinates": { "latitude": 0.0, "longitude": 0.0 },
        "ticketPricing": "$20",
        "rating": "4.5",
        "time": "Morning"
      }
    ],
    "day2": [],
    "day3": []
  }
}
`;
