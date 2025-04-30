import { RouterProvider } from "react-router";
import { ThemeProvider } from "@mui/material";

import router from "./router";
import theme from "./theme";


export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}