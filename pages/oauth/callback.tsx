import { useEffect } from "react";
import { useRouter } from "next/router";
import userStore from "@/stores/userStore";
import { useMagic } from "@/contexts/MagicProvider";

const Callback = () => {
  const router = useRouter();
  const magic = useMagic();

  return (
    <div>
      <p style={{ color: "white" }}>Processing OAuth callback...</p>
    </div>
  );
};

export default Callback;
