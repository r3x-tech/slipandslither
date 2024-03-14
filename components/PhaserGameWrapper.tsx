import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useGameOverModalStore } from "../stores/useGameOverModalStore";
import {
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  Button,
  VStack,
  Spinner,
  Text,
  Box,
} from "@chakra-ui/react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { saveHighScore } from "../utils/supabase";
import { useScoreStore } from "../stores/useScoreStore";
import { useLoadingStore } from "../stores/useLoadingStore";
import { useLoginModalStore } from "@/stores/useLoginModalStore";
import userStore from "@/stores/userStore";
import { useScoreSavedModalStore } from "@/stores/useScoreSavedModalStore";
import toast from "react-hot-toast";

// const PhaserGame = dynamic(() => import("./PhaserGameComponent"), {
//   ssr: false,
// });

const SimplePhaserGame = dynamic(() => import("./SimplePhaserGameComponent"), {
  ssr: false,
});

export default function PhaserGameWrapper() {
  // const startGame = () => {
  //   setGameStarted(true);
  // };
  // const [gameStarted, setGameStarted] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const { showGameOverModal, setShowGameOverModal } = useGameOverModalStore();
  const score = useScoreStore((state) => state.score);
  const { showScoreSavedModal, setShowScoreSavedModal } =
    useScoreSavedModalStore();
  // const phaserCanvas = document.querySelector("#phaser-game canvas");

  const saveHighscore = async () => {
    useLoadingStore.getState().setLoadingStatus(true);
    console.log("loading status: ", useLoadingStore.getState().loadingStatus);
    if (
      userStore.getState().solana_wallet_address.trim() == "" ||
      userStore.getState().solana_wallet_address == null
    ) {
      console.log(
        "SWA in saveHighscore is: ",
        userStore.getState().solana_wallet_address
      );
      // console.log("HERE");
      setShowGameOverModal(false);
      // console.log("YESSS");
      console.log("show modal in saveHighscore is: ", showGameOverModal);
      useScoreStore.getState().setScore(score);
      useLoginModalStore.getState().setShowLoginModal(true);
      console.log(
        "show modal login state: ",
        useLoginModalStore.getState().showLoginModal
      );
    } else {
      if (loadingStatus == true) {
        saveHighScore(score)
          .then(() => {
            useLoadingStore.getState().setLoadingStatus(false);
            setShowScoreSavedModal(true);
            useScoreStore.getState().setScore(0);
          })
          .catch((error) => {
            useLoadingStore.getState().setLoadingStatus(false);
          });
      }
    }
  };

  const walletAddress = userStore((state) => state.solana_wallet_address);
  const loadingStatus = useLoadingStore((state) => state.loadingStatus);

  useEffect(() => {
    if (walletAddress.trim() !== "") {
      if (loadingStatus == true) {
        saveHighScore(score)
          .then(() => {
            useLoadingStore.getState().setLoadingStatus(false);
            setShowScoreSavedModal(true);
            toast.success("Score saved!");
          })
          .catch((error) => {
            console.error("Failed to save score: ", error);
            useLoadingStore.getState().setLoadingStatus(false);
            toast.error("Failed to save score!");
          });
      }
    }
  }, [walletAddress, score, loadingStatus, setShowScoreSavedModal]);

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Flex
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minH="360px"
      h="100%"
      w="100%"
      pt={2}
      fontFamily="'Montserrat', sans-serif"
    >
      <Modal
        isOpen={showGameOverModal}
        onClose={() => setShowGameOverModal(false)}
        closeOnOverlayClick={false}
        isCentered
        blockScrollOnMount={true}
      >
        <ModalOverlay />
        <ModalContent
          backgroundColor="black"
          border="2px solid white"
          borderRadius="0"
          mt="3rem"
          py="10px"
          w="362px"
          h="362px"
          onClick={stopPropagation}
        >
          <ModalFooter>
            <VStack spacing="25px" width="360px">
              {useLoadingStore.getState().loadingStatus ? (
                <VStack>
                  <Spinner color="#ffffff" /> =<Text color="white">SAVING</Text>
                </VStack>
              ) : (
                <>
                  <Button
                    bg="#665EFF"
                    color="white"
                    width="100%"
                    border="2px solid #665EFF"
                    height="6vh"
                    borderRadius="0"
                    fontWeight="800"
                    isDisabled={true}
                    _hover={{ bg: "#817df2", borderColor: "#817df2" }}
                    onClick={() => setShowGameOverModal(false)}
                  >
                    CLAIM PRIZE
                  </Button>
                  <Button
                    bg="#0dd353"
                    color="white"
                    width="100%"
                    border="2px solid #0dd353"
                    height="6vh"
                    borderRadius="0"
                    fontWeight="800"
                    isDisabled={showScoreSavedModal || score < 1}
                    _hover={{ bg: "#04e762", borderColor: "#04e762" }}
                    onClick={saveHighscore}
                  >
                    SAVE HIGHSCORE
                  </Button>

                  <Button
                    bg="#FF1644"
                    color="white"
                    width="100%"
                    border="2px solid #FF1644"
                    height="6vh"
                    mt="3rem"
                    borderRadius="0"
                    fontWeight="800"
                    _hover={{ bg: "#ff4769", borderColor: "#ff4769" }}
                    onClick={() => {
                      setShowGameOverModal(false);
                      setShowScoreSavedModal(false);
                    }}
                  >
                    CLOSE
                  </Button>
                </>
              )}
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* <PhaserGame /> */}
      <SimplePhaserGame />
    </Flex>
  );
}
