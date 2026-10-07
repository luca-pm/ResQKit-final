import { Card } from "react-native-paper";

import styles from "./primaryCard.styles";

export default function PrimaryCard({
  children,
  style,
}) {
  return (
    <Card
      mode="elevated"
      style={[
        styles.card,
        style,
      ]}
    >
      <Card.Content>

        {children}

      </Card.Content>
    </Card>
  );
}