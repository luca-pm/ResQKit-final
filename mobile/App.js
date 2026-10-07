import React from "react";

import "./src/localization/i18n";

import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { CopilotKitProvider } from "@copilotkit/react-native/headless";
import { useFonts, SplineSans_600SemiBold, SplineSans_700Bold } from "@expo-google-fonts/spline-sans";

import AppProvider from "./src/store/appProvider";
import RootNavigator from "./src/navigation/rootNavigator";
import { navigationRef } from "./src/navigation/navigationRef";

import ResQAITools from "./src/ai/ResQaiTools";
import EmergencyAIContext from "./src/ai/EmergencyAIContext";
import KnowledgeAIContext from "./src/ai/KnowledgeAIContext";

import { theme } from "./src/design";
import { COPILOT_RUNTIME_URL } from "./src/services/copilotConfig";

const RUNTIME_URL = COPILOT_RUNTIME_URL;

export default function App() {
  // Bundled with the app, so this resolves almost instantly; on failure the
  // system font is used rather than blocking the app.
  const [fontsLoaded, fontError] = useFonts({ SplineSans_600SemiBold, SplineSans_700Bold });
  if (!fontsLoaded && !fontError) return null;

  return (
    <CopilotKitProvider
      runtimeUrl={RUNTIME_URL}
      onError={(error) => {
        console.log(
          "CopilotKit error:",
          error
        );
      }}
    >
      <PaperProvider theme={theme}>
        <AppProvider>
          <NavigationContainer
            ref={navigationRef}
          >
            <RootNavigator />
          </NavigationContainer>

          <ResQAITools />

          <EmergencyAIContext />

          <KnowledgeAIContext />
        </AppProvider>
      </PaperProvider>
    </CopilotKitProvider>
  );
}