import React from "react";
import ReactDOM from "react-dom/client";
import {
  StarknetConfig,
  publicProvider,
  argent,
  braavos,
} from "@starknet-react/core";
import { sepolia } from "@starknet-react/chains";
import App from "./App.jsx";
import "./index.css";

const connectors = [argent(), braavos()];
ReactDOM.createRoot(document.getElementById("root")).render(
  <StarknetConfig
    connectors={connectors}
    provider={publicProvider()}
    chains={[sepolia]}
  >
    <App />
  </StarknetConfig>,
);
