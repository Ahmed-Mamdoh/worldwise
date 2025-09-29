import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), "cities.json");

  if (req.method === "GET") {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    res.status(200).json(data.cities);
  } else if (req.method === "POST") {
    const newCity = req.body;
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    data.cities.push(newCity);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.status(201).json(newCity);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
