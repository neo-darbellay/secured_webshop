import path from "path";

export function index(req, res) {
  res.sendFile(path.join(__dirname, "..", "views", "home.html"));
}
