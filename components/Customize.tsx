import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  List,
  VStack,
  Spinner,
  Flex,
  Input,
  Button,
  TabPanel,
  TabPanels,
  TabList,
  Tab,
  Tabs,
  Textarea,
} from "@chakra-ui/react";
import { Tournament, getTournamentsByGameName } from "../utils/getTournaments";
import theme from "@/styles/theme";
import Link from "next/link";
import { useLoadingStore } from "@/stores/useLoadingStore";
import { Controller, useForm } from "react-hook-form";
import Image from "next/image";
import { useGameSettingsStore } from "@/stores/useGameSettingsStore";
import { generateImageFromPrompt } from "@/utils/imagen";
import toast from "react-hot-toast";
import { sleep } from "react-query/types/core/utils";

export function Customize() {
  const [selectedBallImage, setSelectedBallImage] = useState<string | null>(
    null
  );
  const [selectedBarrierImage, setSelectedBarrierImage] = useState<
    string | null
  >(null);
  const {
    handleSubmit: handleSubmitBall,
    control: controlBall,
    formState: { errors: errorsBall },
  } = useForm<FormData>();

  const {
    handleSubmit: handleSubmitBarrier,
    control: controlBarrier,
    formState: { errors: errorsBarrier },
  } = useForm<FormData>();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const {
    defaultBallImage,
    defaultBarrierImage,
    ballImage,
    barrierImage,
    ballGenerationPrompt,
    barrierGenerationPrompt,
    setBallImage,
    setBarrierImage,
    setBallGenerationPrompt,
    setBarrierGenerationPrompt,
  } = useGameSettingsStore();

  useEffect(() => {
    console.log("ball image: ", ballImage);
    console.log("selectedBallImage: ", selectedBallImage);
    if (
      (selectedBallImage != null &&
        selectedBallImage != "" &&
        ballImage != "/assets/ball.png") ||
      (selectedBarrierImage != null &&
        selectedBarrierImage != "" &&
        barrierImage != "/assets/barrierall.png")
    ) {
      setIsProcessing(false);
      console.log("ball image: ", ballImage);
      console.log("selectedBallImage: ", selectedBallImage);
      console.log("barrier image: ", barrierImage);
      console.log("selectedBarrierImage: ", selectedBarrierImage);
    } else {
    }
  }, [ballImage, barrierImage, selectedBallImage, selectedBarrierImage]);

  const handleGenerateBallImage = async (data: FormData) => {
    console.log("ran handleGenerateBallImage");
    const prompt = data.aiBallImageInput;

    // Validate prompt
    if (!prompt || prompt.trim().length < 2) {
      toast.error("Please enter a valid prompt");
      return;
    }

    setIsProcessing(true);
    setBallGenerationPrompt(prompt);

    const generatedImageUrl = await generateImageFromPrompt(prompt);

    if (generatedImageUrl) {
      setBallImage(generatedImageUrl);
      setSelectedBallImage(generatedImageUrl);
      toast.success("Generated ball image");
    } else {
      toast.error("Failed to generate image");
      setIsProcessing(false);
    }
    // setIsProcessing(false);
  };

  const handleGenerateBarrierImage = async (data: FormData) => {
    console.log("ran handleGenerateBarrierImage");
    const prompt = data.aiBarrierImageInput;

    // Validate prompt
    if (!prompt || prompt.trim().length < 2) {
      toast.error("Please enter a valid prompt");
      return;
    }

    setIsProcessing(true);
    setBarrierGenerationPrompt(prompt);

    const generatedImageUrl = await generateImageFromPrompt(prompt);

    if (generatedImageUrl) {
      setBarrierImage(generatedImageUrl);
      console.log("barrier image: ", barrierImage);
      setSelectedBarrierImage(generatedImageUrl);
      console.log("selectedBarrierImage: ", selectedBarrierImage);
      toast.success("Generated barrier image");
    } else {
      toast.error("Failed to generate image");
      setIsProcessing(false);
    }
    // setIsProcessing(false);
  };

  return (
    <>
      <Text color="#fbfbfb" fontSize="21px" fontWeight="700" textAlign="start">
        CUSTOMIZE GAME
      </Text>

      <VStack
        spacing="25px"
        mt="0.5rem"
        h="100%"
        justifyContent="center"
        alignContent="center"
        w="100%"
        overflowY="auto"
      >
        {useLoadingStore.getState().loadingStatus || isProcessing ? (
          <VStack>
            <Spinner color="#ffffff" />
            <Text color="white" fontSize="0.75rem">
              GENERATING
            </Text>
          </VStack>
        ) : (
          <Flex
            flexDirection="column"
            justifyContent="space-between"
            alignContent="center"
            h="100%"
            w="100%"
          >
            <Tabs variant="soft-rounded" colorScheme="current">
              <TabList pt="0rem">
                <Tab
                  flex={1}
                  borderColor="black"
                  borderWidth="2px"
                  borderRadius="0"
                  _selected={{
                    fill: "white",
                    borderColor: "white",
                    borderWidth: 2,
                    borderRadius: 0,
                  }}
                  fontSize="0.75rem"
                  fontWeight="700"
                  h="2rem"
                >
                  BALL
                </Tab>
                <Tab
                  flex={1}
                  borderColor="black"
                  borderWidth="2px"
                  borderRadius="0"
                  _selected={{
                    borderColor: "white",
                    borderWidth: 2,
                    borderRadius: 0,
                  }}
                  fontSize="0.75rem"
                  fontWeight="700"
                  h="2rem"
                >
                  BARRIER
                </Tab>
                <Tab
                  flex={1}
                  borderColor="black"
                  borderWidth="2px"
                  borderRadius="0"
                  _selected={{
                    borderColor: "white",
                    borderWidth: 2,
                    borderRadius: 0,
                  }}
                  fontSize="0.75rem"
                  fontWeight="700"
                  h="2rem"
                >
                  MECHANICS
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel py={0} px={0}>
                  <Flex
                    flexDirection="column"
                    w="100%"
                    color={theme.colors.white}
                    // bg={theme.colors.secondary}
                  >
                    <Flex alignItems="center" my="1.5rem">
                      <Flex
                        align="center"
                        justifyContent="start"
                        borderRadius="1px"
                        w="100%"
                      >
                        <Flex
                          align="center"
                          justifyContent="center"
                          w="100%"
                          boxSize="50px"
                          overflow="hidden"
                          borderRadius="50%"
                          marginRight="1rem"
                          bg={theme.colors.tertiary}
                          position="relative"
                        >
                          {selectedBallImage ? (
                            <Flex boxSize="50px">
                              <Image
                                src={selectedBallImage}
                                alt="Generated ball image"
                                layout="fill"
                                style={{
                                  borderRadius: "50%",
                                }}
                                unoptimized={true}
                              />
                            </Flex>
                          ) : (
                            <Image
                              src={"/assets/ball.png"} // Adjust the path according to your public directory structure
                              alt="Default ball image"
                              layout="fill"
                              style={{ borderRadius: "50%" }}
                            />
                          )}
                        </Flex>
                        {selectedBallImage ? (
                          <Flex
                            flexDirection="column"
                            justifyContent="center"
                            align="start"
                          >
                            <Text
                              textAlign="start"
                              h="100%"
                              color={theme.colors.white}
                              fontSize="0.75rem"
                              fontWeight="700"
                            >
                              GENERATED BALL IMAGE
                            </Text>
                            <Text
                              fontSize="0.75rem"
                              textAlign="start"
                              h="100%"
                              color={theme.colors.white}
                            >
                              Prompt: {ballGenerationPrompt}
                            </Text>
                          </Flex>
                        ) : (
                          <Flex
                            flexDirection="column"
                            justifyContent="center"
                            align="start"
                          >
                            <Text
                              textAlign="start"
                              h="100%"
                              color={theme.colors.white}
                              fontSize="0.75rem"
                              fontWeight="700"
                            >
                              DEFAULT BALL IMAGE
                            </Text>
                            <Text
                              textAlign="start"
                              h="100%"
                              color={theme.colors.white}
                              fontSize="0.75rem"
                            >
                              Color #FF0034
                            </Text>
                          </Flex>
                        )}
                      </Flex>
                    </Flex>

                    <Flex
                      flexDirection="column"
                      align="flex-end"
                      w="100%"
                      mt="0rem"
                    >
                      <VStack
                        as="form"
                        onSubmit={handleSubmitBall(handleGenerateBallImage)}
                      >
                        <Controller
                          name="aiBallImageInput"
                          control={controlBall}
                          defaultValue=""
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Textarea
                              {...field}
                              placeholder="Describe ball to generate"
                              w="100%"
                              minH="7rem"
                              resize="vertical"
                              overflowY="auto"
                              fontSize="0.75rem"
                              bg={theme.colors.input}
                              borderWidth="2px"
                              borderRadius="1px"
                              borderColor={theme.colors.input}
                              fontWeight="500"
                              letterSpacing="1px"
                              color={theme.colors.white}
                              focusBorderColor={theme.colors.input}
                              _placeholder={{
                                color: theme.colors.darkerGray,
                              }}
                              _focus={{ boxShadow: "none" }}
                            />
                          )}
                        />

                        {errorsBall.aiBallImageInput && (
                          <Flex
                            w="97%"
                            h="1rem"
                            justifyContent="start"
                            m="0"
                            p="0"
                          >
                            <Text fontSize="0.75rem" color="red" m="0" p="0">
                              Ball description is required
                            </Text>
                          </Flex>
                        )}
                        <Flex
                          w="100%"
                          gap="0.75rem"
                          mt={
                            errorsBall.aiBallImageInput ? "0.15rem" : "0.5rem"
                          }
                        >
                          <Button
                            bg={theme.colors.red}
                            color="white"
                            width="100%"
                            borderColor={theme.colors.red}
                            borderWidth="2px"
                            borderRadius="1px"
                            h="2.25rem"
                            w="100%"
                            fontSize="0.8rem"
                            fontWeight="700"
                            isDisabled={false}
                            _hover={{ bg: "#ea0000", borderColor: "#ea0000" }}
                            onClick={() => {
                              setIsProcessing(true);
                              setBallImage(defaultBallImage);
                              setIsProcessing(false);
                            }}
                          >
                            RESET TO DEFAULT
                          </Button>
                          <Button
                            bg={theme.colors.tertiary}
                            color="white"
                            width="100%"
                            borderColor={theme.colors.tertiary}
                            borderWidth="2px"
                            borderRadius="1px"
                            h="2.25rem"
                            w="100%"
                            fontSize="0.8rem"
                            fontWeight="700"
                            isDisabled={false}
                            _hover={{ bg: "#3c33e8", borderColor: "#3c33e8" }}
                            // onClick={() => {
                            //   console.log("check 1 ran");
                            //   handleSubmit(handleGenerateBallImage);
                            // }}
                            type="submit"
                          >
                            GENERATE W/ AI
                          </Button>
                        </Flex>
                      </VStack>
                    </Flex>

                    {/* <Text
                      textAlign="center"
                      w="100%"
                      fontWeight="700"
                      fontSize="0.8rem"
                      color={theme.colors.white}
                      my="1rem"
                    >
                      OR{" "}
                    </Text>
                    <Controller
                      name="ballImage"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <label
                          style={{
                            textAlign: "center",
                            display: "inline-block",
                            width: "auto",
                            padding: "0.5rem 1rem",
                            fontSize: "0.75rem",
                            backgroundColor: theme.colors.background,
                            borderWidth: "2px",
                            borderRadius: "1px",
                            borderColor: theme.colors.lightBlue,
                            fontWeight: "600",
                            color: theme.colors.lightBlue,
                            cursor: "pointer",
                          }}
                        >
                          UPLOAD IMAGE
                          <Input
                            {...field}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                setSelectedBallImage(e.target.files[0]);
                                field.onChange(e.target.files[0].name);
                              } else {
                                setSelectedBallImage(null);
                                field.onChange("");
                              }
                            }}
                            style={{
                              display: "none",
                            }}
                            value=""
                          />
                        </label>
                      )}
                    />

                    {errors.ballImage && <span>Ball image is required</span>} */}
                  </Flex>
                </TabPanel>
                <TabPanel py={0} px={0}>
                  <Flex
                    flexDirection="column"
                    w="100%"
                    color={theme.colors.white}
                  >
                    <Flex alignItems="center" my="1.5rem">
                      <Flex
                        align="center"
                        justifyContent="start"
                        borderRadius="1px"
                        w="100%"
                      >
                        <Flex
                          align="center"
                          justifyContent="center"
                          w="10px"
                          h="50px"
                          overflow="hidden"
                          marginRight="1rem"
                          position="relative"
                        >
                          {selectedBarrierImage ? (
                            <Flex boxSize="50px">
                              <Image
                                src={selectedBarrierImage}
                                alt="Generated barrier image"
                                layout="fill"
                                // style={{
                                //   width: "10px",
                                //   height: "50px",
                                // }}
                                unoptimized={true}
                              />
                            </Flex>
                          ) : (
                            <Image
                              src={"/assets/barrier.png"} // Adjust the path according to your public directory structure
                              alt="Default barrier image"
                              layout="fill"
                            />
                          )}
                        </Flex>
                        {selectedBarrierImage ? (
                          <Flex
                            flexDirection="column"
                            justifyContent="center"
                            align="start"
                          >
                            <Text
                              textAlign="start"
                              h="100%"
                              color={theme.colors.white}
                              fontSize="0.75rem"
                            >
                              GENERATED BARRIER IMAGE
                            </Text>
                            <Text
                              fontSize="0.75rem"
                              textAlign="start"
                              h="100%"
                              color={theme.colors.white}
                            >
                              Prompt: {barrierGenerationPrompt}
                            </Text>
                          </Flex>
                        ) : (
                          <Flex
                            flexDirection="column"
                            justifyContent="center"
                            align="start"
                          >
                            <Text
                              textAlign="start"
                              h="100%"
                              color={theme.colors.white}
                              fontSize="0.75rem"
                              fontWeight="700"
                            >
                              DEFAULT BARRIER IMAGE
                            </Text>
                            <Text
                              textAlign="start"
                              h="100%"
                              color={theme.colors.white}
                              fontSize="0.75rem"
                            >
                              Color #FF1644
                            </Text>
                          </Flex>
                        )}
                      </Flex>
                    </Flex>

                    <Flex
                      flexDirection="column"
                      align="flex-end"
                      w="100%"
                      mt="0rem"
                    >
                      <VStack
                        as="form"
                        onSubmit={handleSubmitBarrier(
                          handleGenerateBarrierImage
                        )}
                      >
                        <Controller
                          name="aiBarrierImageInput"
                          control={controlBarrier}
                          defaultValue=""
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Textarea
                              {...field}
                              placeholder="Describe barrier to generate"
                              w="100%"
                              minH="7rem"
                              resize="vertical"
                              overflowY="auto"
                              fontSize="0.75rem"
                              bg={theme.colors.input}
                              borderWidth="2px"
                              borderRadius="1px"
                              borderColor={theme.colors.input}
                              fontWeight="500"
                              letterSpacing="1px"
                              color={theme.colors.white}
                              focusBorderColor={theme.colors.input}
                              _placeholder={{
                                color: theme.colors.darkerGray,
                              }}
                              _focus={{ boxShadow: "none" }}
                            />
                          )}
                        />

                        {errorsBarrier.aiBarrierImageInput && (
                          <Flex
                            w="97%"
                            h="1rem"
                            justifyContent="start"
                            m="0"
                            p="0"
                          >
                            <Text fontSize="0.75rem" color="red" m="0" p="0">
                              Barrier description is required{" "}
                            </Text>
                          </Flex>
                        )}
                        <Flex
                          w="100%"
                          gap="0.75rem"
                          mt={
                            errorsBall.aiBallImageInput ? "0.15rem" : "0.5rem"
                          }
                        >
                          <Button
                            bg={theme.colors.red}
                            color="white"
                            width="100%"
                            borderColor={theme.colors.red}
                            borderWidth="2px"
                            borderRadius="1px"
                            h="2.25rem"
                            w="100%"
                            fontSize="0.8rem"
                            fontWeight="700"
                            isDisabled={false}
                            _hover={{ bg: "#ea0000", borderColor: "#ea0000" }}
                            onClick={() => {
                              setIsProcessing(true);
                              setBarrierImage(defaultBarrierImage);
                              setIsProcessing(false);
                            }}
                          >
                            RESET TO DEFAULT
                          </Button>
                          <Button
                            bg={theme.colors.tertiary}
                            color="white"
                            width="100%"
                            borderColor={theme.colors.tertiary}
                            borderWidth="2px"
                            borderRadius="1px"
                            h="2.25rem"
                            w="100%"
                            fontSize="0.8rem"
                            fontWeight="700"
                            isDisabled={false}
                            _hover={{ bg: "#3c33e8", borderColor: "#3c33e8" }}
                            // onClick={() => {}}
                            type="submit"
                          >
                            GENERATE W/ AI
                          </Button>
                        </Flex>
                      </VStack>
                    </Flex>
                  </Flex>
                </TabPanel>
                <TabPanel py={0} px={0}>
                  <Flex
                    h="14rem"
                    w="100%"
                    justifyContent="center"
                    align="center"
                  >
                    <Text color="#fbfbfb" textAlign="center" fontSize="0.8rem">
                      CUSTOM MECHANICS COMING SOON
                    </Text>
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Flex>
        )}
      </VStack>
    </>
  );
}

type FormData = {
  // ballImage: string;
  aiBallImageInput: string;
  // barrierImage: string;
  aiBarrierImageInput: string;
};

function truncateFilename(filename: string, maxLength = 30) {
  if (filename.length <= maxLength || !filename.includes(".")) return filename;

  const lastDotIndex = filename.lastIndexOf(".");
  const fileExtension = filename.slice(lastDotIndex);
  const threeCharsBeforeDot = filename.slice(lastDotIndex - 5, lastDotIndex);
  const mainPartLength =
    maxLength - threeCharsBeforeDot.length - fileExtension.length - 3; // -3 for "..."
  if (mainPartLength <= 0) return `...${threeCharsBeforeDot}${fileExtension}`;
  return `${filename.slice(
    0,
    mainPartLength
  )}...${threeCharsBeforeDot}${fileExtension}`;
}
