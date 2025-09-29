import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), "cities.json");

  if (req.method === "GET") {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    res.status(200).json(data.cities);
  } else if (req.method === "POST") {
    try {
      console.log("Received POST request with body:", req.body);
      const newCity = req.body;
      const fileContent = fs.readFileSync(filePath, "utf8");
      const data = JSON.parse(fileContent);
      data.cities.push(newCity);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      res.status(201).json(newCity);
    } catch (error) {
      console.error("Error handling POST request:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
