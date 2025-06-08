import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { config } from "dotenv";

config();


const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: [ 
        "CATEGORY:SEARCH_ENGINE" ,
        "CATEGORY:PREVIEW"
      ],
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 10, // Refill 10 tokens per interval
      interval: 5, // Refill every 5 seconds
      capacity: 50, // Bucket capacity of 50 tokens
    }),
  ],
});

export default aj;