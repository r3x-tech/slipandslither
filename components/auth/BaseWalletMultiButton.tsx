import React, {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import theme from "@/styles/theme";
import { useWalletMultiButton } from "@/hooks/useWalletMultiButton";

export type ButtonProps = PropsWithChildren<{
  className?: string;
  disabled?: boolean;
  endIcon?: ReactElement;
  onClick?: (e: ReactMouseEvent<HTMLButtonElement>) => void;
  startIcon?: ReactElement;
  style?: CSSProperties;
  tabIndex?: number;
}>;

type Props = ButtonProps & {
  labels: {
    "change-wallet": string;
    connecting: string;
    "copy-address": string;
    copied: string;
    disconnect: string;
    "has-wallet": string;
    "no-wallet": string;
  };
};

const baseButtonStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderColor: `${theme.colors.white}`,
  borderWidth: "2px",
  borderRadius: "0px",
  color: `${theme.colors.white}`,
  height: "2.5rem",
  padding: "0.5rem",
  fontSize: "0.75rem",
  fontWeight: 700,
  cursor: "pointer",
  letterSpacing: "0.5px",
  backgroundColor: "transparent",
  // width: "100%",
};

const hoverButtonStyle: CSSProperties = {
  ...baseButtonStyle,
  backgroundColor: `${theme.colors.white}`,
  borderColor: `${theme.colors.white}`,
  borderWidth: "2px",
  borderRadius: "2px",
  color: `${theme.colors.background}`,
};

export default function BaseWalletMultiButton({
  children,
  labels,
  startIcon,
  ...props
}: Props) {
  const [hover, setHover] = useState(false);
  const { setVisible: setModalVisible } = useWalletModal();
  const { buttonState, onConnect, onDisconnect, publicKey } =
    useWalletMultiButton({
      onSelectWallet() {
        setModalVisible(true);
      },
    });

  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLUListElement>(null);

  const getLabel = useCallback(
    (state: string) => {
      return labels[state as keyof typeof labels] || "";
    },
    [labels]
  );

  const content = useMemo(() => {
    if (children) {
      return children;
    } else if (publicKey) {
      const base58 = publicKey.toBase58();
      return base58.slice(0, 4) + ".." + base58.slice(-4);
    } else {
      return getLabel(buttonState);
    }
  }, [buttonState, children, getLabel, publicKey]);

  const mouseDownListener = (event: globalThis.MouseEvent) => {
    const node = ref.current;
    if (!node || node.contains(event.target as Node)) return;
    setMenuOpen(false);
  };

  const touchStartListener = (event: TouchEvent) => {
    const node = ref.current;
    if (!node || node.contains(event.target as Node)) return;
    setMenuOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", mouseDownListener);
    document.addEventListener("touchstart", touchStartListener);

    return () => {
      document.removeEventListener("mousedown", mouseDownListener);
      document.removeEventListener("touchstart", touchStartListener);
    };
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <div
        {...props}
        style={hover ? hoverButtonStyle : baseButtonStyle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => {
          switch (buttonState) {
            case "no-wallet":
              setModalVisible(true);
              console.log("RAN NO WALLET");
              break;
            case "has-wallet":
              if (onConnect) {
                onConnect();
                console.log("RAN ONCONNECT HAS WALLET");
              }
              break;
            case "connected":
              console.log("BWM connected!!!!");
              setMenuOpen(!menuOpen);
              break;
            case "connecting":
              console.log("BWM connecting!");
              // You can add additional logic here if needed
              break;
            // ... add any additional cases if required
          }
        }}
      >
        {startIcon}
        {content}
      </div>
      {menuOpen && (
        <ul
          aria-label="dropdown-list"
          className={`wallet-adapter-dropdown-list`}
          ref={ref}
          role="menu"
        >
          {publicKey && (
            <li
              className="wallet-adapter-dropdown-list-item"
              onClick={async () => {
                await navigator.clipboard.writeText(publicKey.toBase58());
                setCopied(true);
                setTimeout(() => setCopied(false), 400);
              }}
              role="menuitem"
            >
              {copied ? labels["copied"] : labels["copy-address"]}
            </li>
          )}
          <li
            className="wallet-adapter-dropdown-list-item"
            onClick={() => {
              setModalVisible(true);
              setMenuOpen(false);
            }}
            role="menuitem"
          >
            {labels["change-wallet"]}
          </li>
          {onDisconnect && (
            <li
              className="wallet-adapter-dropdown-list-item"
              onClick={() => {
                onDisconnect();
                setMenuOpen(false);
              }}
              role="menuitem"
            >
              {labels["disconnect"]}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
