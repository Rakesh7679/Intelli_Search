import app from "./src/app.js";
import { testAi } from "./src/services/ai.service.js";

const PORT = process.env.PORT || 3000;

testAi();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});