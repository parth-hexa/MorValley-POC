import { Environment } from "@react-three/drei";

export function EnvironmentSetup() {
  return <Environment files="/env/Wine_Bottle_Environment.exr" environmentIntensity={0.2} />;
}
