import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import HomeScreen from "../screens/home/homeScreen";
import AIScreen from "../screens/ai/aiScreen";
import HistoryScreen from "../screens/history/historyScreen";
import AccountTabScreen from "../screens/settings/accountTabScreen";
import useLocale from "../hooks/useLocale";

import { COLORS } from "../design";
import { ROUTES } from "../constants/routes";

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  [ROUTES.HOME]: "home",
  [ROUTES.AI]: "creation",
  [ROUTES.HISTORY]: "clock-outline",
  [ROUTES.ACCOUNT_TAB]: "account-circle-outline",
};

// Same tabs as the zip app: Home / ResQKit AI / History / Account.
export default function MainTabNavigator() {
  const { pick } = useLocale();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          height: 70,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          backgroundColor: COLORS.white,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name={TAB_ICONS[route.name] || "circle"} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name={ROUTES.HOME} component={HomeScreen} options={{ title: pick("Acasă", "Home") }} />
      <Tab.Screen name={ROUTES.AI} component={AIScreen} options={{ title: "ResQKit AI" }} />
      <Tab.Screen name={ROUTES.HISTORY} component={HistoryScreen} options={{ title: pick("Istoric", "History") }} />
      <Tab.Screen name={ROUTES.ACCOUNT_TAB} component={AccountTabScreen} options={{ title: pick("Cont", "Account") }} />
    </Tab.Navigator>
  );
}
