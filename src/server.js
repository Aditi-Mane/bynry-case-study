import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

import seedRoutes from "./part-3-api-implementation/routes/seedRoutes.js"
import alertRoutes from "./part-3-api-implementation/routes/alertRoutes.js"

const app = express()

app.use(express.json())

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error("MongoDB connection failed:", error.message)
    process.exit(1)
  }
}

await connectDB()

app.use("/seed", seedRoutes);
app.use("/api/companies", alertRoutes);

app.get("/", (req, res) => {
  res.send("API is running")
})

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})