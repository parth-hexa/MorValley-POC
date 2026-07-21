import { Environment } from "@react-three/drei";
import { observer } from "mobx-react-lite";
import { useStores } from "../../hooks/useStores";

export const EnvironmentSetup = observer(function EnvironmentSetup() {
  const { design3DManager } = useStores();
  return <Environment preset={design3DManager.environmentPreset} environmentIntensity={0.9} />;
});
