import { useRef, useState } from "react";
import { Alert, Linking, Text, View } from "react-native";
import { Button, Chip } from "react-native-paper";
import { CameraView, useCameraPermissions } from "expo-camera";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

import useLocale from "../../hooks/useLocale";
import { recognizeKit } from "../../services/recognitionService";
import styles from "./kitScanner.styles";

export default function KitScanner({
  context = "other",
  selected = [],
  onChange,
}) {
  const { pick } = useLocale();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState([]);
  const [sceneNote, setSceneNote] = useState("");
  const [scanned, setScanned] = useState(false);
  const [addedCodes, setAddedCodes] = useState([]);

  function retake() {
    if (addedCodes.length) {
      const next = (selected || []).filter((code) => !addedCodes.includes(code));
      onChange?.(next, next.length ? "manual" : "none");
    }
    setResults([]);
    setSceneNote("");
    setAddedCodes([]);
    setScanned(false);
  }

  async function openCamera() {
    if (!permission?.granted) {
      const result = await requestPermission();

      if (!result.granted) {
        Alert.alert(
          pick("Camera nu este disponibilă", "Camera is not available"),
          pick(
            "Poți activa permisiunea din setările telefonului sau poți continua fără scanare.",
            "You can enable permission in your phone settings or continue without scanning."
          ),
          [
            { text: pick("Închide", "Close"), style: "cancel" },
            { text: pick("Setări", "Settings"), onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }
    }

    setCameraOpen(true);
  }

  async function scan() {
    if (!cameraRef.current) return;
    setScanning(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (!photo?.uri) {
        throw new Error(
          pick(
            "Nu s-a putut captura fotografia.",
            "The photo could not be captured."
          )
        );
      }

      const ctx = ImageManipulator.manipulate(photo.uri);
      ctx.resize({ width: 1024 });
      const rendered = await ctx.renderAsync();
      const saved = await rendered.saveAsync({
        compress: 0.75,
        format: SaveFormat.JPEG,
        base64: true,
      });

      if (!saved.base64) {
        throw new Error(
          pick(
            "Fotografia nu a putut fi codificată.",
            "The photo could not be encoded."
          )
        );
      }

      const payload = await recognizeKit({
        imageDataUri: `data:image/jpeg;base64,${saved.base64}`,
        context,
      });

      // No vision model installed (or it failed): say so instead of
      // implying the camera saw an empty kit.
      if (payload?.degraded) {
        Alert.alert(
          pick("Recunoaștere indisponibilă", "Recognition unavailable"),
          pick("Recunoașterea cu camera nu este disponibilă acum. Selectează manual materialele.", "Camera recognition isn't available right now. Select your kit items manually.")
        );
        return;
      }

      const items = payload?.items || [];
      setResults(items);
      setSceneNote(payload?.scene_note || "");

      const confident = items
        .filter((item) => Number(item.confidence || 0) >= 0.5)
        .map((item) => item.code);

      const merged = Array.from(new Set([...(selected || []), ...confident]));
      setAddedCodes(confident.filter((code) => !(selected || []).includes(code)));
      setScanned(true);
      onChange?.(merged, confident.length ? "camera" : "none");
    } catch (error) {
      Alert.alert(
        pick("Recunoaștere indisponibilă", "Recognition unavailable"),
        error?.message ||
          pick(
            "Poți selecta manual materialele.",
            "You can select the materials manually."
          )
      );
    } finally {
      setScanning(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {pick("Recunoaștere conținut ResQKit", "ResQKit content recognition")}
      </Text>
      <Text style={styles.description}>
        {pick(
          "Fotografia este trimisă pentru o singură analiză și nu este păstrată de aplicație.",
          "The photo is sent for a single analysis and is not retained by the app."
        )}
      </Text>

      {!cameraOpen ? (
        <Button mode="outlined" icon="camera-outline" onPress={openCamera}>
          {pick("Deschide camera", "Open camera")}
        </Button>
      ) : null}

      {cameraOpen ? (
        <>
          <CameraView ref={cameraRef} style={styles.camera} facing="back" />
          <View style={styles.actions}>
            <Button
              mode="contained"
              loading={scanning}
              disabled={scanning}
              onPress={scan}
            >
              {pick("Identifică materialele", "Identify materials")}
            </Button>
            {scanned && !scanning ? (
              <Button mode="outlined" icon="camera-retake-outline" onPress={retake}>
                {pick("Refă fotografia", "Retake photo")}
              </Button>
            ) : null}
            <Button mode="text" onPress={() => setCameraOpen(false)}>
              {pick("Închide camera", "Close camera")}
            </Button>
          </View>
        </>
      ) : null}

      {results.length ? (
        <View style={styles.results}>
          {results.map((item) => (
            <Chip key={`${item.code}-${item.name}`} style={styles.chip}>
              {item.name || item.code} · {Math.round(Number(item.confidence || 0) * 100)}%
            </Chip>
          ))}
        </View>
      ) : null}

      {sceneNote ? <Text style={styles.sceneNote}>{sceneNote}</Text> : null}
    </View>
  );
}
