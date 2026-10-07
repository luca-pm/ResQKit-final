import { Text } from "react-native-paper";

import styles from "./sectionTitle.styles";

export default function SectionTitle({
  children,
}) {
  return (
    <Text style={styles.title}>
      {children}
    </Text>
  );
}