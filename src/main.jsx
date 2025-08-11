import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import store from "./store/index.jsx";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import { SnackbarUtilsConfiguration, CloseButton } from "./components/common/Toast.jsx"; // ✅ adjust path

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={3000}
          action={(snackbarId) => <CloseButton id={snackbarId} />} // ✅ add close button
        >
          <SnackbarUtilsConfiguration /> {/* ✅ register toast system */}
          <App />
        </SnackbarProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>
);
