import { seedFirebaseData } from "./firebase-seed";

// Run the seeding function
seedFirebaseData()
  .then(() => {
    console.log("Seeding completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });