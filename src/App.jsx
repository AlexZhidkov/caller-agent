import { useState } from "react";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import InfoPage from "./components/InfoPage";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ResponsiveAppBar />
      <div style={{ paddingTop: 32 }}>
        <InfoPage />
      </div>
    </>
  );
}

export default App;
