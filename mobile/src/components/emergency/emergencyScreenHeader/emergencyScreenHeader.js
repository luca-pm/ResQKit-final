import AppScreenHeader from "../../common/appScreenHeader/appScreenHeader";
import EmergencyAIButton from "../emergencyAIButton/emergencyAIButton";
import { ROUTES } from "../../../constants/routes";

export default function EmergencyScreenHeader({
  title,
  navigation,
}) {
  return (
    <>
      <AppScreenHeader
        title={title}
        navigation={navigation}
        showMenu={false}
        showNotifications={false}
        showProfile={false}
        onClosePress={() => navigation.navigate(ROUTES.HOME)}
      />

      <EmergencyAIButton navigation={navigation} />
    </>
  );
}
