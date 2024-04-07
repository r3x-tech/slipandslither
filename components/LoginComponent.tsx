import {
  Button,
  Flex,
  Stack,
  Text,
  Spinner,
  Input,
  Heading,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Select,
  useBreakpointValue,
  PopoverContent,
  Popover,
  PopoverTrigger,
  Box,
  MenuList,
  Menu,
  MenuButton,
  VStack,
  Tooltip,
} from "@chakra-ui/react";
import ipify from "ipify";
import { useEffect, useState } from "react";
import theme from "../styles/theme";
import userStore from "@/stores/userStore";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import {
  getPlayersByWalletAddress,
  insertPlayerEntry,
} from "../utils/supabase";
import { countryPhoneCodes } from "./constants";
import { FaCopy, FaDiscord, FaPhoneAlt, FaTwitter } from "react-icons/fa";
import { useLoginModalStore } from "@/stores/useLoginModalStore";
import { useLoadingStore } from "@/stores/useLoadingStore";
import { saveHighScore } from "@/utils/supabase";
import { useScoreStore } from "@/stores/useScoreStore";
import { useScoreSavedModalStore } from "@/stores/useScoreSavedModalStore";
import { useGameOverModalStore } from "@/stores/useGameOverModalStore";
import React from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { useConnect, useSolana } from "@particle-network/auth-core-modal";
import { UserInfo } from "@particle-network/auth-core";
import { getUSDCBalance } from "@/utils/shyft";

const LABELS = {
  "change-wallet": "CHANGE WALLET",
  connecting: "CONNECTING ...",
  "copy-address": "COPY ADDRESS",
  copied: "COPIED",
  disconnect: "DISCONNECT",
  "has-wallet": " LOGIN W/ SOLANA",
  "no-wallet": " LOGIN W/ SOLANA",
} as const;

type ButtonState = {
  buttonState:
    | "connecting"
    | "connected"
    | "disconnecting"
    | "has-wallet"
    | "no-wallet";
};
export const LoginComponent = () => {
  const router = useRouter();
  const heightValue = useBreakpointValue({ base: "100%", md: "100vh" });
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+1");
  const [loginInProgress, setLoginInProgress] = useState(false);
  const [loggedInStatus, setLoggedInStatus] = useState(false);
  const [logoutStatus, setLogoutStatus] = useState(false);
  const [googleLoggingIn, setGoogleLoggingIn] = useState(false);
  const { showLoginModal, setShowLoginModal } = useLoginModalStore();
  const { showGameOverModal, setShowGameOverModal } = useGameOverModalStore();
  const loadingStatus = useLoadingStore((state) => state.loadingStatus);
  const currentScoreToSave = useScoreStore((state) => state.score);
  const { showScoreSavedModal, setShowScoreSavedModal } =
    useScoreSavedModalStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUsdcBalance, setCurrentUsdcBalance] = useState<string | null>(
    null
  );

  const {
    address,
    chainId,
    chainInfo,
    switchChain,
    signMessage,
    signTransaction,
    signAllTransactions,
    signAndSendTransaction,
    enable,
  } = useSolana();
  const {
    connect: particleConnect,
    connected: particleConnected,
    disconnect: particleDisconnect,
    connectionStatus,
    requestConnectCaptcha,
    setSocialConnectCallback,
  } = useConnect();

  const {
    username,
    loggedIn,
    loginType,
    solana_wallet_address,
    currentConnection,
    currentUserInfo,
    currentWallet,
    ip_address,
    userProfilePic,
  } = userStore();

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(solana_wallet_address);
      toast.success("Copied Wallet Address");
    } catch (err) {
      console.error("Failed to copy address: ", err);
      toast.error("Failed to copy address");
    }
  };

  const formatUsername = (name: string) => {
    if (name.length <= 16) {
      return name;
    }
    if (name == "") {
      return "NA";
    }
    return `${name.substring(0, 7)}...${name.substring(name.length - 4)}`;
  };

  const formatWalletAddress = (name: string) => {
    if (name.length <= 16) {
      return name;
    }
    if (name == "") {
      return "NA";
    }
    return `${name.substring(0, 5)}...${name.substring(name.length - 5)}`;
  };

  const countryCodeToFlagEmoji = (iso: any) => {
    const offset = 127397;
    return [...iso]
      .map((char) => String.fromCodePoint(char.charCodeAt() + offset))
      .join("");
  };

  useEffect(() => {
    if (loggedIn || userStore.getState().loggedIn) {
      setLoggedInStatus(true);
    } else {
      setLoggedInStatus(false);
    }
  }, [loggedIn]);

  useEffect(() => {
    const checkAndInsertToDatabase = async () => {
      const entry = await getPlayersByWalletAddress(solana_wallet_address);
      if (!entry) {
        console.log("RUNNING INSERT TO DB");

        await insertPlayerEntry(
          username,
          loginType,
          solana_wallet_address,
          ip_address
        );
      }
      toast.success("Logged in");
      setLoginInProgress(false);
    };
    if (loggedIn && solana_wallet_address.trim() !== "") {
      console.log("RUNNING DB CHECK");
      checkAndInsertToDatabase();
    }
  }, [ip_address, loggedIn, loginType, solana_wallet_address, username]);

  useEffect(() => {
    if (
      solana_wallet_address.trim() !== "" &&
      loadingStatus &&
      loggedIn &&
      !showScoreSavedModal &&
      showGameOverModal
    ) {
      if (loadingStatus == true) {
        saveHighScore(currentScoreToSave)
          .then(() => {
            useLoadingStore.getState().setLoadingStatus(false);
            setShowScoreSavedModal(true);
          })
          .catch((error) => {
            useLoadingStore.getState().setLoadingStatus(false);
          });
      }
    }
  }, [
    currentScoreToSave,
    loadingStatus,
    loggedIn,
    setShowScoreSavedModal,
    showGameOverModal,
    showScoreSavedModal,
    solana_wallet_address,
  ]);

  useEffect(() => {
    const fetchUSDCBalance = async () => {
      if (solana_wallet_address) {
        const balanceData = await getUSDCBalance(solana_wallet_address);
        if (balanceData && balanceData.success) {
          setCurrentUsdcBalance(balanceData.result.balance.toFixed(2));
        } else {
          setCurrentUsdcBalance("N/A");
        }
      }
    };

    fetchUSDCBalance();
  }, [solana_wallet_address]);

  // const context = useParticle();

  // if (!context) {
  //   // Handle the case where context is not available
  //   return (
  //     <Flex
  //       justifyContent="center"
  //       alignItems="center"
  //       h="100vh"
  //       w="100vw"
  //       bg={theme.colors.background}
  //     >
  //       <Flex
  //         w="100%"
  //         flexDirection="column"
  //         align="center"
  //         justifyContent="center"
  //         color={theme.colors.red}
  //         my="4.58rem"
  //       >
  //         <Spinner size="sm" />
  //         <Text mt={3} fontSize="0.75rem" fontWeight="500">
  //           Loading...
  //         </Text>
  //       </Flex>
  //     </Flex>
  //   );
  // }
  // const { particle, particleProvider, solanaWallet } = context;

  const handlePhoneLogin = async () => {
    setLoginInProgress(true);
    // const cleanPhone = phone.replace(/-/g, "");

    if (!loggedIn) {
      // if (!(selectedCountryCode + cleanPhone).match(/^\+\d{1,14}$/)) {
      //   console.log("phone error");
      //   console.log("phone: ", cleanPhone);
      //   console.log("phone number: ", selectedCountryCode + cleanPhone);

      //   setPhoneError(true);
      // } else {

      // }
      try {
        setPhoneError(false);
        // console.log("phone: ", cleanPhone);
        // let userInfo: UserInfo | undefined;

        // userInfo = await particleConnect({
        //   phone: selectedCountryCode + cleanPhone,
        // });

        console.log("here:");

        let userInfo = await particleConnect();

        console.log("there");

        if (!userInfo && userInfo != undefined) {
          throw Error("User unavailable");
        }

        if (!address) {
          throw Error("Address unavailable");
        }

        if (!signTransaction) {
          throw Error("Signing unavailable 0x1");
        }

        if (!signAllTransactions) {
          throw Error("Signing unavailable 0x2");
        }

        fetch("https://api.ipify.org?format=json")
          .then((response) => response.json())
          .then((data) => {
            userStore.setState({
              loggedIn: true,
              loginType: "PHONE",
              username: userInfo!.phone || "",
              solana_wallet_address: address,
              currentWallet: {
                publicKey: new PublicKey(address),
                signTransaction: signTransaction,
                signAllTransactions: signAllTransactions,
              },
              currentUserInfo: userInfo,
              ip_address: data.ip,
            });
          });
        setPhone("");
        toast.success("log in completed!");
      } catch (e) {
        console.log("login error: " + JSON.stringify(e));
        toast.error("log in failed!");
      } finally {
        setLoginInProgress(false);
      }
    }
  };

  // const handlePhoneLogin = async () => {
  //   setLoginInProgress(true);

  //   // Remove any dashes from the phone input
  //   const cleanPhone = phone.replace(/-/g, "");

  //   if (!loggedIn) {
  //     if (!(selectedCountryCode + cleanPhone).match(/^\+\d{1,14}$/)) {
  //       console.log("phone error");
  //       console.log("phone: ", cleanPhone);
  //       console.log("phone number: ", selectedCountryCode + cleanPhone);

  //       setPhoneError(true);
  //     } else {
  //       try {
  //         setPhoneError(false);
  //         console.log("phone: ", cleanPhone);
  //         if (particle && solanaWallet) {
  //           // const rpcUrl = process.env.NEXT_PUBLIC_ENDPOINT;
  //           let userInfo: UserInfo | null;

  //           if (!particle) {
  //             throw Error("Particle unavailable");
  //           }

  //           if (!particle.auth.isLogin()) {
  //             // Request user login if needed, returns current user info
  //             userInfo = await particle.auth.login({
  //               preferredAuthType: "phone",
  //               account: selectedCountryCode + cleanPhone, //phone number must use E.164
  //             });
  //           } else {
  //             userInfo = particle.auth.getUserInfo();
  //           }

  //           const currentUserInfo = userInfo;
  //           if (!currentUserInfo) {
  //             throw Error("User unavailable");
  //           }

  //           if (!solanaWallet) {
  //             throw Error("Wallet unavailable");
  //           }

  //           if (!solanaWallet.signTransaction) {
  //             throw Error("Signing unavailable 0x1");
  //           }

  //           if (!solanaWallet.signAllTransactions) {
  //             throw Error("Signing unavailable 0x2");
  //           }

  //           console.log("phone: ", currentUserInfo.phone);

  //           fetch("https://api.ipify.org?format=json")
  //             .then((response) => response.json())
  //             .then((data) => {
  //               userStore.setState({
  //                 loggedIn: true,
  //                 loginType: "PHONE",
  //                 username: currentUserInfo.phone || "",
  //                 solana_wallet_address:
  //                   solanaWallet.publicKey?.toBase58() || "",
  //                 currentConnection: particle.solana.getRpcUrl()
  //                   ? new Connection(particle.solana.getRpcUrl())
  //                   : null,
  //                 currentWallet: {
  //                   publicKey: new PublicKey(
  //                     solanaWallet!.publicKey!.toBase58()
  //                   ),
  //                   signTransaction: solanaWallet.signTransaction,
  //                   signAllTransactions: solanaWallet.signAllTransactions,
  //                 },
  //                 ip_address: data.ip,
  //               });
  //             });
  //           setPhone("");
  //         } else {
  //           console.log("no account");
  //         }
  //       } catch (e) {
  //         console.log("login error: " + JSON.stringify(e));
  //       } finally {
  //         setLoginInProgress(false);
  //       }
  //     }
  //   }
  // };

  const handleLogout = async () => {
    try {
      setLogoutStatus(true);

      if (particleConnected && loggedIn) {
        await particleDisconnect().then(() => {
          console.log("logout");
        });
        userStore.setState({
          loggedIn: false,
          loginType: "",
          username: "",
          solana_wallet_address: "",
          currentConnection: null,
          signTransaction: null,
          signAllTransactions: null,
          currentProvider: null,
          currentWallet: null,
        });
        toast.success("Logged out");
        setLogoutStatus(false);
        setShowLoginModal(false);
        router.push("/");
      } else {
        toast.error("Failed to logout! 0x1");
        setLogoutStatus(false);
        return;
      }
    } catch (e) {
      toast.error("Failed to logout! 0x2");
    }
  };

  return (
    <>
      <Menu
        isOpen={showLoginModal}
        onOpen={() => setShowLoginModal(true)}
        onClose={() => setShowLoginModal(false)}
      >
        {!loggedInStatus ? (
          <Button
            fontFamily="Montserrat"
            letterSpacing="1px"
            fontSize="0.75rem"
            fontWeight="700"
            borderColor="white"
            borderWidth="2px"
            borderRadius="0px"
            h="2rem"
            color="white"
            _hover={{
              backgroundColor: "white",
              color: "black",
            }}
            cursor="pointer"
            isDisabled={!loginInProgress ? false : phone.length === 0}
            onClick={() => handlePhoneLogin()}
            isLoading={loginInProgress}
            spinner={
              <Flex flexDirection="row" align="center">
                <Spinner color={theme.colors.background} size="sm" />
              </Flex>
            }
            _disabled={{
              bg: "gray",
              cursor: "default",
              borderColor: "grey",
            }}
          >
            LOGIN
          </Button>
        ) : (
          <MenuButton
            as={Button}
            fontFamily="Montserrat"
            letterSpacing="1px"
            fontSize="0.75rem"
            fontWeight="700"
            borderColor="white"
            borderWidth="2px"
            borderRadius="0px"
            h="2rem"
            color="white"
            _hover={{
              backgroundColor: "white",
              color: "black",
            }}
            cursor="pointer"
          >
            {loggedInStatus
              ? `${username.slice(0, 5)}...${username.substring(
                  username.length - 4
                )}`
              : loginInProgress ||
                ((connectionStatus == "connecting" ||
                  connectionStatus == "loading") &&
                  !loggedInStatus)
              ? "LOGGING IN..."
              : "LOGIN"}
          </MenuButton>
        )}

        <MenuList
          bg={theme.colors.black}
          color={theme.colors.white}
          borderColor={theme.colors.white}
          borderRadius="0px"
          borderWidth="2px"
          w="365px"
          outline="none"
          zIndex={200}
          boxShadow="1px 1px 20px black"
        >
          {loginInProgress ||
          ((connectionStatus == "connecting" ||
            connectionStatus == "loading") &&
            !loggedInStatus) ? (
            <Flex
              w="100%"
              flexDirection="column"
              align="center"
              justifyContent="center"
              color={theme.colors.white}
              mt="5.15rem"
              mb="5rem"
            >
              <Spinner size="sm" />
              <Text mt={3} fontSize="0.75rem" fontWeight="500">
                LOGGING IN
              </Text>
            </Flex>
          ) : loggedInStatus && connectionStatus == "connected" ? (
            <VStack spacing={4} padding="1rem" align="flex-start">
              <Flex direction="column" align="flex-start" w="100%">
                <Flex m="0.75rem" align="center">
                  <Box>
                    <Image
                      src={userProfilePic}
                      alt="User Profile Pic"
                      boxSize="3rem"
                      mr="1rem"
                      cursor="pointer"
                      onClick={() => {
                        // router.push("/account");
                      }}
                    />
                  </Box>
                  <Tooltip
                    label="Wallet Address"
                    aria-label="Wallet Address"
                    bg="black"
                    border="1px solid white"
                  >
                    <Text color="white">
                      {formatWalletAddress(solana_wallet_address)}
                    </Text>
                    {/* <Text
                    textAlign="center"
                    fontSize="0.75rem"
                    fontWeight="900"
                  >
                    {username.slice(0, 5)}...{username.slice(-10)}
                  </Text> */}
                  </Tooltip>

                  <Tooltip
                    label="Copy"
                    aria-label="Copy"
                    bg="black"
                    border="1px solid white"
                  >
                    <Flex
                      color="white"
                      _hover={{ color: "rgba(255, 255, 255, 0.8)" }}
                    >
                      <FaCopy
                        style={{ marginLeft: "10px", cursor: "pointer" }}
                        onClick={handleCopyClick}
                      />
                    </Flex>
                  </Tooltip>
                </Flex>

                <Flex w="100%" h="100%" justifyContent="start" align="center">
                  <Flex
                    w="12.5rem"
                    h="2.25rem"
                    justifyContent="center"
                    align="center"
                  >
                    <Text
                      fontSize="0.9rem"
                      fontWeight="700"
                      color={theme.colors.primary}
                    >
                      Balance:
                    </Text>
                    <Text
                      ml="0.5rem"
                      fontSize="0.9rem"
                      fontWeight="700"
                      color={theme.colors.green}
                    >
                      ${currentUsdcBalance ? currentUsdcBalance : "N/A"} USDC
                    </Text>
                  </Flex>

                  {/* <Button
                    fontSize="0.75rem"
                    fontWeight="700"
                    as="a"
                    href="https://www.r3x.tech/contact"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="ghost"
                    border="2px solid white"
                    h="1.5rem"
                    px="0.5rem"
                    borderRadius="2px"
                    _hover={{
                      color: "rgba(255, 255, 255, 0.8)",
                      borderColor: "rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    BUY MORE +
                  </Button> */}
                </Flex>
                <Flex w="100%">
                  <Button
                    fontSize="0.9rem"
                    fontWeight="700"
                    as="a"
                    href="https://www.r3x.tech/contact"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="ghost"
                    _hover={{ color: "rgba(255, 255, 255, 0.8)" }}
                  >
                    Need Help?
                  </Button>
                </Flex>

                <Button
                  fontSize="0.9rem"
                  fontWeight="700"
                  variant="ghost"
                  onClick={handleLogout}
                  color={theme.colors.red}
                  _hover={{ color: "rgba(255, 0, 0, 0.8)" }}
                >
                  Logout
                </Button>
              </Flex>
            </VStack>
          ) : (
            // logoutStatus ? (
            //   <Flex
            //     w="100%"
            //     flexDirection="column"
            //     align="center"
            //     justifyContent="center"
            //     color={theme.colors.white}
            //     mt="5.15rem"
            //     mb="5rem"
            //   >
            //     <Spinner size="sm" />
            //     <Text mt={3} fontSize="0.75rem" fontWeight="500">
            //       LOGGING OUT
            //     </Text>
            //   </Flex>
            // ) :
            <>
              {/* <Stack
              spacing={3}
              width="100%"
              p="1rem"
              // bg={theme.colors.black}
              // borderRadius="0px"
              // border={`2px solid ${theme.colors.white}`}
              // p="1.25rem"
            >
              <Flex flexDirection="column" w="100%">
                <Flex flexDirection="column" mb="1rem" w="100%" h="100%">
                  <Flex flexDirection="row" w="100%">
                    <Select
                      w="30%"
                      value={selectedCountryCode}
                      onChange={(e) => setSelectedCountryCode(e.target.value)}
                      bg={theme.colors.input}
                      color={theme.colors.white}
                      fontSize="0.75rem"
                      iconSize="0px"
                      border={theme.colors.input}
                      background={`url("data:image/svg+xml,%3Csvg width='8' height='4' viewBox='0 0 8 4' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0.646447 0.646447C0.841709 0.451184 1.15829 0.451184 1.35355 0.646447L4 3.29289L6.64645 0.646446C6.84171 0.451184 7.15829 0.451184 7.35355 0.646446C7.54882 0.841709 7.54882 1.15829 7.35355 1.35355L4.35355 4.35355C4.15829 4.54882 3.84171 4.54882 3.64645 4.35355L0.646446 1.35355C0.451184 1.15829 0.451184 0.841709 0.646447 0.646447Z' fill='white'/%3E%3C/svg%3E%0A") no-repeat right 1rem center/8px 4px ${theme.colors.input}`}
                      borderRadius="2px 0 0 2px"
                      outline="none"
                      _focus={{
                        boxShadow: "none",
                        background: `url("data:image/svg+xml,%3Csvg width='8' height='4' viewBox='0 0 8 4' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0.646447 0.646447C0.841709 0.451184 1.15829 0.451184 1.35355 0.646447L4 3.29289L6.64645 0.646446C6.84171 0.451184 7.15829 0.451184 7.35355 0.646446C7.54882 0.841709 7.54882 1.15829 7.35355 1.35355L4.35355 4.35355C4.15829 4.54882 3.84171 4.54882 3.64645 4.35355L0.646446 1.35355C0.451184 1.15829 0.451184 0.841709 0.646447 0.646447Z' fill='white'/%3E%3C/svg%3E%0A") no-repeat right 1rem center/8px 4px ${theme.colors.input}`,
                      }}
                    >
                      {Object.entries(countryPhoneCodes).map(([iso, code]) => (
                        <option key={iso} value={code}>
                          {code} {countryCodeToFlagEmoji(iso)} {iso}
                        </option>
                      ))}
                    </Select>

                    <Input
                      bg={theme.colors.input}
                      w="70%"
                      borderRadius="0px 2px 2px 0px"
                      border={theme.colors.input}
                      borderLeft={`4px solid ${theme.colors.black}`}
                      fontWeight="500"
                      fontSize="0.7rem"
                      letterSpacing="0.5px"
                      color={theme.colors.white}
                      focusBorderColor={theme.colors.white}
                      _placeholder={{ color: theme.colors.darkerGray }}
                      isDisabled={loginInProgress || username.length > 0}
                      onChange={(e) => {
                        if (phoneError) setPhoneError(false);
                        setPhone(e.target.value);
                      }}
                      placeholder={"ENTER A PHONE NUMBER"}
                      value={phone}
                      isInvalid={phoneError}
                      errorBorderColor={theme.red[700]}
                      _focus={{
                        boxShadow: "none",
                        borderLeft: `4px solid ${theme.colors.black}`,
                      }}
                    />
                  </Flex>

                  {phoneError && (
                    <Text
                      className="error"
                      color={theme.red[700]}
                      fontSize="0.75rem"
                    >
                      Please enter a valid phone number
                    </Text>
                  )}
                </Flex>

                <Button
                  leftIcon={<FaPhoneAlt size="1rem" />}
                  bg={theme.colors.white}
                  color={theme.colors.black}
                  borderRadius="0px"
                  letterSpacing="1px"
                  fontSize="0.75rem"
                  fontWeight="700"
                  w="100%"
                  isDisabled={
                    loginInProgress ||
                    (username.length > 0 ? false : phone.length === 0)
                  }
                  onClick={() => handlePhoneLogin()}
                  isLoading={loginInProgress}
                  spinner={
                    <Flex flexDirection="row" align="center">
                      <Spinner color={theme.colors.background} size="sm" />
                    </Flex>
                  }
                  _disabled={{
                    bg: "#666666",
                    cursor: "default",
                  }}
                >
                  LOGIN W/ PHONE
                </Button>
              </Flex>
            </Stack> */}
            </>
          )}
        </MenuList>
      </Menu>
    </>
  );
};
