import { Environment } from "@react-three/drei";

export function EnvironmentSetup() {
  return <Environment files="/env/lebombo_1k.hdr" environmentIntensity={0.9} />;
}
