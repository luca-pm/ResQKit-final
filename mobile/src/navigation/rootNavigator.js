import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/splash/splashScreen";
import LoadingScreen from "../screens/loading/loadingScreen";
import LoginScreen from "../screens/auth/loginScreen";
import RegisterScreen from "../screens/auth/registerScreen";
import ForgotPasswordScreen from "../screens/auth/forgotPassword";
import AccountScreen from "../screens/settings/accountScreen";
import IncidentDetailScreen from "../screens/history/incidentDetailScreen";
import MainTabNavigator from "./mainTabNavigator";
import GuidesScreen from "../screens/tutorials/guidesScreen";
import SettingsScreen from "../screens/settings/settingsScreen";
import LanguageScreen from "../screens/settings/languageScreen";
import SafetyProfileScreen from "../screens/settings/safetyProfileScreen";
import ConsentScreen from "../screens/settings/consentScreen";
import RegisteredKitsScreen from "../screens/settings/registeredKitsScreen";
import AdvancedSettingsScreen from "../screens/settings/advancedSettingsScreen";
import RegulationsScreen from "../screens/settings/regulationsScreen";
import WoundCategoryScreen from "../screens/tutorials/woundCategoryScreen";
import GuideDetailScreen from "../screens/tutorials/guideDetailScreen";
import AppGuideDetailScreen from "../screens/tutorials/appGuideDetailScreen";
import FAQScreen from "../screens/settings/faqScreen";
import ContactScreen from "../screens/settings/contactScreen";
import NotificationsScreen from "../screens/settings/notificationsScreen";
import IncidentStartScreen from "../screens/emergency/incidentStartScreen";
import Call112GateScreen from "../screens/emergency/call112GateScreen";
import ContextSelectionScreen from "../screens/emergency/contextSelectionScreen";
import AgeSelectionScreen from "../screens/emergency/ageSelectionScreen";
import SituationSelectionScreen from "../screens/emergency/situationSelectionScreen";
import ProtocolScreen from "../screens/emergency/protocolScreen";
import KitPreparationScreen from "../screens/emergency/kitPreparationScreen";
import VictimsScreen from "../screens/emergency/victimsScreen";
import TriageScreen from "../screens/emergency/triageScreen";
import SafetyScreen from "../screens/emergency/safetyScreen";
import HandoffScreen from "../screens/emergency/handoffScreen";
import InterviewScreen from "../screens/emergency/interviewScreen";
import ReportScreen from "../screens/emergency/reportScreen";
import ReviewScreen from "../screens/emergency/reviewScreen";
import PracticeHomeScreen from "../screens/tutorials/practiceHomeScreen";
import PracticeProtocolScreen from "../screens/tutorials/practiceProtocolScreen";
import { ROUTES } from "../constants/routes";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName={ROUTES.SPLASH} screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
      <Stack.Screen name={ROUTES.LOADING} component={LoadingScreen} />
      <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
      <Stack.Screen name={ROUTES.REGISTER} component={RegisterScreen} />
      <Stack.Screen name={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
      <Stack.Screen name={ROUTES.HOME} component={MainTabNavigator} />
      <Stack.Screen name={ROUTES.ACCOUNT} component={AccountScreen} />
      <Stack.Screen name={ROUTES.SETTINGS} component={SettingsScreen} />
      <Stack.Screen name={ROUTES.GUIDES} component={GuidesScreen} />
      <Stack.Screen name={ROUTES.INCIDENT_DETAIL} component={IncidentDetailScreen} />
      <Stack.Screen name={ROUTES.LANGUAGE} component={LanguageScreen} />
      <Stack.Screen name={ROUTES.SAFETY_PROFILE} component={SafetyProfileScreen} />
      <Stack.Screen name={ROUTES.CONSENT} component={ConsentScreen} />
      <Stack.Screen name={ROUTES.REGISTERED_KITS} component={RegisteredKitsScreen} />
      <Stack.Screen name={ROUTES.ADVANCED_SETTINGS} component={AdvancedSettingsScreen} />
      <Stack.Screen name={ROUTES.REGULATIONS} component={RegulationsScreen} />
      <Stack.Screen name={ROUTES.GUIDE_CATEGORY} component={WoundCategoryScreen} />
      <Stack.Screen name={ROUTES.GUIDE_DETAIL} component={GuideDetailScreen} />
      <Stack.Screen name={ROUTES.APP_GUIDE_DETAIL} component={AppGuideDetailScreen} />
      <Stack.Screen name={ROUTES.FAQ} component={FAQScreen} />
      <Stack.Screen name={ROUTES.CONTACT} component={ContactScreen} />
      <Stack.Screen name={ROUTES.NOTIFICATIONS} component={NotificationsScreen} />
      <Stack.Screen name={ROUTES.INCIDENT_START} component={IncidentStartScreen} />
      <Stack.Screen name={ROUTES.CALL_112_GATE} component={Call112GateScreen} />
      <Stack.Screen name={ROUTES.CONTEXT_SELECTION} component={ContextSelectionScreen} />
      <Stack.Screen name={ROUTES.AGE_SELECTION} component={AgeSelectionScreen} />
      <Stack.Screen name={ROUTES.SITUATION_SELECTION} component={SituationSelectionScreen} />
      <Stack.Screen name={ROUTES.PROTOCOL} component={ProtocolScreen} />
      <Stack.Screen name={ROUTES.KIT_PREPARATION} component={KitPreparationScreen} />
      <Stack.Screen name={ROUTES.VICTIMS} component={VictimsScreen} />
      <Stack.Screen name={ROUTES.TRIAGE} component={TriageScreen} />
      <Stack.Screen name={ROUTES.SAFETY} component={SafetyScreen} />
      <Stack.Screen name={ROUTES.HANDOFF} component={HandoffScreen} />
      <Stack.Screen name={ROUTES.INTERVIEW} component={InterviewScreen} />
      <Stack.Screen name={ROUTES.REPORT} component={ReportScreen} />
      <Stack.Screen name={ROUTES.REVIEW} component={ReviewScreen} />
      <Stack.Screen name={ROUTES.PRACTICE_HOME} component={PracticeHomeScreen} />
      <Stack.Screen name={ROUTES.PRACTICE_PROTOCOL} component={PracticeProtocolScreen} />
    </Stack.Navigator>
  );
}
