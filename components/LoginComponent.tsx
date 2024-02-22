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
import { RPCError, RPCErrorCode } from "magic-sdk";
import { useMagic } from "@/contexts/MagicProvider";
import theme from "../styles/theme";
import userStore from "@/stores/userStore";
import toast from "react-hot-toast";
import { WalletMultiButton } from "@/components/auth/WalletMultiButton";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import {
  getPlayersByWalletAddress,
  insertPlayerEntry,
} from "../utils/supabase";
import { countryPhoneCodes } from "./constants";
import { FaCopy, FaDiscord, FaPhoneAlt, FaTwitter } from "react-icons/fa";
import { useLoginModalStore } from "@/stores/useLoginModalStore";
import { useLoadingStore } from "@/stores/useLoadingStore";
import { saveHighScore } from "@/utils/saveHighScore";
import { useScoreStore } from "@/stores/useScoreStore";
import { useScoreSavedModalStore } from "@/stores/useScoreSavedModalStore";
import { useGameOverModalStore } from "@/stores/useGameOverModalStore";
import React from "react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

// const LABELS = {
//   "change-wallet": "CHANGE WALLET",
//   connecting: "CONNECTING ...",
//   "copy-address": "COPY ADDRESS",
//   copied: "COPIED",
//   disconnect: "DISCONNECT",
//   "has-wallet": " LOGIN W/ SOLANA",
//   "no-wallet": " LOGIN W/ SOLANA",
// } as const;

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
  const { magic } = useMagic();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+1");
  const [loginInProgress, setLoginInProgress] = useState(false);
  const [loggedInStatus, setLoggedInStatus] = useState(false);
  const [logoutStatus, setLogoutStatus] = useState(false);
  const [googleLoggingIn, setGoogleLoggingIn] = useState(false);
  const [currentWord, setCurrentWord] = useState("INBOX");
  const { showLoginModal, setShowLoginModal } = useLoginModalStore();
  const { showGameOverModal, setShowGameOverModal } = useGameOverModalStore();
  const loadingStatus = useLoadingStore((state) => state.loadingStatus);
  const currentScoreToSave = useScoreStore((state) => state.score);
  const { showScoreSavedModal, setShowScoreSavedModal } =
    useScoreSavedModalStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const { connection } = useConnection();
  const {
    connecting,
    connected,
    disconnect,
    connect,
    publicKey,
    disconnecting,
    wallet,
  } = useWallet();
  let buttonState: ButtonState["buttonState"];
  if (connecting) {
    buttonState = "connecting";
    // console.log("1 - CONNECTING");
  } else if (connected) {
    buttonState = "connected";
    // console.log("1 - CONNECTED");
  } else if (disconnecting) {
    buttonState = "disconnecting";
    // console.log("1 - DISCONNECTING");
  } else if (wallet) {
    buttonState = "has-wallet";
    // console.log("1 - HAS WALLET");
  } else {
    buttonState = "no-wallet";
    // console.log("1 - NO WALLET FOUND");
  }

  const {
    username,
    loggedIn,
    loginType,
    solana_wallet_address,
    ip_address,
    userProfilePic,
  } = userStore();

  const { setVisible: setModalVisible } = useWalletModal();

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(solana_wallet_address);
      toast.success("Copied Username");
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

  const countryCodeToFlagEmoji = (iso: any) => {
    const offset = 127397;
    return [...iso]
      .map((char) => String.fromCodePoint(char.charCodeAt() + offset))
      .join("");
  };

  useEffect(() => {
    const fetchOAuthResult = async () => {
      try {
        console.log("trying");

        // const metadata = await magic?.user.getInfo();
        // console.log("google metadata: ", metadata);

        const account = await (magic as any)?.oauth.getRedirectResult();
        console.log("google account: ", account);
        if (account) {
          fetch("https://api.ipify.org?format=json")
            .then((response) => response.json())
            .then((data) => {
              userStore.setState({
                loggedIn: true,
                loginType: "GOOGLE",
                username: account.oauth.userInfo.email || "",
                solana_wallet_address:
                  account.magic?.userMetadata.publicAddress || "",
                ip_address: data.ip,
              });
            });
          setLoginInProgress(false);
          // router.push("/");
          // setLoggedInStatus(true);
          toast.success("Logged in");
        } else {
          console.log("no google account found ON CALLBACK");
        }
      } catch (e) {
        console.log("OAuth result fetch error: " + JSON.stringify(e));
        // handle the error
      } finally {
        console.log("callback ran");
      }
    };

    // Call fetchOAuthResult only when the URL includes 'oauth/callback'
    const queryParams = new URLSearchParams(window.location.search);
    const provider = queryParams.get("provider");
    if (provider === "google" && !loggedIn) {
      setLoginInProgress(true);
      console.log("oauth callback");
      fetchOAuthResult();
    }
  }, [loggedIn, magic, router]);

  const handleGoogleLogin = async () => {
    setLoginInProgress(true);
    if (!loggedIn) {
      try {
        console.log("google login");
        await (magic as any)?.oauth.loginWithRedirect({
          provider: "google",
          redirectURI: "https://bounceback.r3x.tech/",
        });
      } catch (e) {
        console.log("login error: " + JSON.stringify(e));
      }
    }
  };

  const handlePhoneLogin = async () => {
    setLoginInProgress(true);

    // Remove any dashes from the phone input
    const cleanPhone = phone.replace(/-/g, "");

    if (!loggedIn) {
      if (!(selectedCountryCode + cleanPhone).match(/^\+\d{1,14}$/)) {
        console.log("phone error");
        console.log("phone: ", cleanPhone);
        console.log("phone number: ", selectedCountryCode + cleanPhone);

        setPhoneError(true);
      } else {
        try {
          setPhoneError(false);
          console.log("phone: ", cleanPhone);

          const account = await magic?.auth.loginWithSMS({
            phoneNumber: `${selectedCountryCode}${cleanPhone}`,
          });

          if (account) {
            const metadata = await magic?.user.getInfo();
            fetch("https://api.ipify.org?format=json")
              .then((response) => response.json())
              .then((data) => {
                userStore.setState({
                  loggedIn: true,
                  loginType: "PHONE",
                  username: metadata?.phoneNumber || "",
                  solana_wallet_address: metadata?.publicAddress || "",
                  ip_address: data.ip,
                });
              });
            setPhone("");
          } else {
            console.log("no account");
          }
        } catch (e) {
          console.log("login error: " + JSON.stringify(e));
          if (e instanceof RPCError) {
            switch (e.code) {
              case RPCErrorCode.MagicLinkFailedVerification:
              case RPCErrorCode.MagicLinkExpired:
              case RPCErrorCode.MagicLinkRateLimited:
              case RPCErrorCode.UserAlreadyLoggedIn:
                toast.error(`${e.message}`);
                break;
              default:
                toast.error("Something went wrong. Please try again");
            }
          }
        } finally {
          setLoginInProgress(false);
        }
      }
    }
  };

  const handleSolanaLogin = async () => {
    setLoginInProgress(true);
    // Remove any dashes from the phone input
    const cleanPhone = phone.replace(/-/g, "");

    if (!loggedIn) {
      switch (buttonState) {
        case "no-wallet":
          setModalVisible(true);
          console.log("RAN NO WALLET");
          setLoginInProgress(false);
          break;
        case "has-wallet":
          await connect().catch((error) => {
            // Silently catch because any errors are caught by the context `onError` handler
            console.error("Connect error: ", error);
          });
          if (connect) {
            await connect().catch((error) => {
              // Silently catch because any errors are caught by the context `onError` handler
              console.error("Connect error: ", error);
            });
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
    }
  };

  useEffect(() => {
    if (loggedIn || userStore.getState().loggedIn) {
      setLoggedInStatus(true);
    } else {
      setLoggedInStatus(false);
    }
  }, [loggedIn]);

  useEffect(() => {
    if (publicKey && connected && !loggedIn && !logoutStatus) {
      // console.log("RUNNING SOLANA LOGIN USE EFFECT");
      fetch("https://api.ipify.org?format=json")
        .then((response) => response.json())
        .then((data) => {
          console.log(data.ip);
          userStore.setState({
            loggedIn: true,
            loginType: "SOLANA",
            username: publicKey.toString(),
            solana_wallet_address: publicKey.toString(),
            ip_address: data.ip,
          });
        });
      setLoginInProgress(false);
      if (loadingStatus == true && showGameOverModal == false) {
        setShowLoginModal(false);
        setShowGameOverModal(true);
      }
    }
  }, [
    connected,
    connection,
    loadingStatus,
    loggedIn,
    logoutStatus,
    publicKey,
    setShowGameOverModal,
    setShowLoginModal,
    showGameOverModal,
  ]);

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
  }, [
    connected,
    ip_address,
    loggedIn,
    loginType,
    solana_wallet_address,
    username,
  ]);

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

  // useEffect(() => {
  //   console.log(
  //     "login modal showing status: ",
  //     useLoginModalStore.getState().showLoginModal
  //   );
  //   if (useLoginModalStore.getState().showLoginModal) {
  //     console.log(
  //       "login modal is open on save: ",
  //       useLoginModalStore.getState().showLoginModal
  //     );
  //     setIsLoginModalOpen(true);
  //   }
  // }, [loggedIn, magic, router]);

  // useEffect(() => {
  //   if (showLoginModal) {
  //     console.log("login modal is open on save: ", showLoginModal);
  //     setIsLoginModalOpen(true);
  //   }
  // }, [showLoginModal]);

  const handleLogout = async () => {
    try {
      setLogoutStatus(true);
      if (loggedInStatus && userStore.getState().loginType == "SOLANA") {
        console.log("disconnectin SOLANANANAANANA");
        await disconnect()
          .catch((error) => {
            // Silently catch because any errors are caught by the context `onError` handler
            console.error("Disconnect error: ", error);
            throw Error("Disconnect error");
          })
          .then(() => {
            console.log("COMPLETED disconnectin SOLANANANAANANA");
            userStore.setState({
              loggedIn: false,
              loginType: "",
              username: "",
              solana_wallet_address: "",
            });
            console.log("ERASED USER STATE disconnectin SOLANANANAANANA");
            toast.success("Logged out");
            console.log("SUCCESS disconnectin SOLANANANAANANA");
          });
        setLogoutStatus(false);
        // setIsOpen(false);
        console.log("2 - running router");
        router.push("/");
      } else if (magic && (await magic.user.isLoggedIn())) {
        await magic.user.logout();
        userStore.setState({
          loggedIn: false,
          loginType: "",
          username: "",
          solana_wallet_address: "",
        });
        toast.success("Logged out");
        setLogoutStatus(false);
        // setIsOpen(false);
        // router.push("/");
      } else {
        toast.error("Failed to logout! 0x1");
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
            ? `${username.slice(0, 10)}...`
            : loginInProgress || (connecting && !loggedInStatus)
            ? "LOGGING IN..."
            : "LOGIN"}
        </MenuButton>
        <MenuList
          bg={theme.colors.black}
          color={theme.colors.white}
          borderColor={theme.colors.white}
          borderRadius="0px"
          borderWidth="2px"
          w="360px"
          outline="none"
          zIndex={200}
          boxShadow="1px 1px 20px black"
        >
          {loginInProgress || (connecting && !loggedInStatus) ? (
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
          ) : loggedInStatus ? (
            <VStack spacing={4} padding="1rem" align="flex-start">
              <Flex direction="column" align="flex-start">
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
                    label="Address"
                    aria-label="Address"
                    bg="black"
                    border="1px solid white"
                  >
                    <Text color="white">{formatUsername(username)}</Text>
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

                {/* <Button
                  variant="ghost"
                  onClick={() => {
                    router.push("/mymachines");
                  }}
                  _hover={{ color: "rgba(255, 255, 255, 0.8)" }}
                >
                  My Racks
                </Button> */}
                {/* <Button
                              variant="ghost"
                              onClick={() => {
                                router.push("/settings");
                              }}
                              _hover={{ color: "rgba(255, 255, 255, 0.8)" }}
                            >
                              Settings
                            </Button> */}
                <Button
                  as="a"
                  href="https://www.r3x.tech/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="ghost"
                  _hover={{ color: "rgba(255, 255, 255, 0.8)" }}
                >
                  Need Help?
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  _hover={{ color: "rgba(255, 255, 255, 0.8)" }}
                >
                  Logout
                </Button>
              </Flex>
            </VStack>
          ) : logoutStatus ? (
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
                LOGGING OUT
              </Text>
            </Flex>
          ) : (
            <Stack
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
              <Flex w="100%" justifyContent="center" my="0" py="0">
                <Text
                  fontWeight="500"
                  fontSize="0.75rem"
                  color={theme.colors.white}
                  py="0"
                  my="0"
                >
                  OR{" "}
                </Text>
              </Flex>
              <Flex
                flexDirection={["column", "column"]}
                justifyContent="center"
                w="100%"
                mt="0rem"
                gap={3}
              >
                <Button
                  leftIcon={
                    <Image
                      src="/googleLogo.webp"
                      alt="Google Logo"
                      boxSize="1rem"
                      mr="0.25rem"
                    />
                  }
                  variant="outline"
                  borderColor={theme.colors.white}
                  border="2px solid white"
                  borderRadius="0px"
                  color={theme.colors.white}
                  width="100%"
                  fontSize="0.75rem"
                  fontWeight="700"
                  _hover={{
                    color: theme.colors.black,
                    backgroundColor: theme.colors.white,
                    borderColor: theme.colors.white,
                  }}
                  isDisabled={loginInProgress}
                  onClick={() => handleGoogleLogin()}
                  isLoading={loginInProgress}
                  spinner={
                    <Flex flexDirection="row" align="center">
                      <Spinner color={theme.colors.background} size="sm" />
                    </Flex>
                  }
                  _disabled={{
                    bg: "#fffff",
                    cursor: "default",
                    borderColor: "#666666",
                  }}
                >
                  LOGIN W/ GOOGLE
                </Button>

                <Button
                  leftIcon={
                    <Image
                      src="/solLogo.svg" // Path to Solana logo
                      alt="Solana Logo"
                      boxSize="1rem"
                      mr="0.25rem"
                    />
                  }
                  variant="outline"
                  borderColor="white"
                  borderWidth="2px"
                  borderRadius="0px"
                  color="white"
                  width="100%"
                  fontSize="0.75rem"
                  fontWeight="700"
                  _hover={{
                    color: "black",
                    backgroundColor: "white",
                    borderColor: "white",
                  }}
                  isDisabled={loginInProgress}
                  onClick={() => handleSolanaLogin()}
                  isLoading={loginInProgress}
                  spinner={
                    <Flex flexDirection="row" align="center">
                      <Spinner color="background" size="sm" />
                    </Flex>
                  }
                  _disabled={{
                    bg: "white",
                    cursor: "default",
                    borderColor: "#666666",
                  }}
                >
                  LOGIN W/ SOLANA
                </Button>

                {/* <BaseWalletMultiButton
                  startIcon={
                    <Image
                      src="/solLogo.svg"
                      alt="Solana Logo"
                      style={{
                        width: "1rem",
                        height: "1rem",
                        marginRight: "0.75rem",
                      }}
                    />
                  }
                  labels={LABELS}
                /> */}
              </Flex>
            </Stack>
          )}
        </MenuList>
      </Menu>
    </>
  );
};
