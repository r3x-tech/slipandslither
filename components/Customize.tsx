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
import { Tournament, getTournamentsByGameName } from "../utils/tournament";
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
  const [selectedAppleImage, setSelectedAppleImage] = useState<string | null>(
    null
  );
  const [selectedBombImage, setSelectedBombImage] = useState<string | null>(
    null
  );
  const [selectedSnakeBodyImage, setSelectedSnakeBodyImage] = useState<
    string | null
  >(null);

  const {
    handleSubmit: handleSubmitApple,
    control: controlApple,
    formState: { errors: errorsApple },
  } = useForm<FormData>();
  const {
    handleSubmit: handleSubmitBomb,
    control: controlBomb,
    formState: { errors: errorsBomb },
  } = useForm<FormData>();
  const {
    handleSubmit: handleSubmitSnakeBody,
    control: controlSnakeBody,
    formState: { errors: errorsSnakeBody },
  } = useForm<FormData>();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const {
    defaultAppleImage,
    defaultBombImage,
    defaultSnakeBodyImage,
    appleImage,
    bombImage,
    snakeBodyImage,
    appleGenerationPrompt,
    bombGenerationPrompt,
    snakeBodyGenerationPrompt,
    setAppleImage,
    setBombImage,
    setSnakeBodyImage,
    setAppleGenerationPrompt,
    setBombGenerationPrompt,
    setSnakeBodyGenerationPrompt,
  } = useGameSettingsStore();

  useEffect(() => {
    console.log("apple image: ", appleImage);
    console.log("selectedAppleImage: ", selectedAppleImage);
    if (
      (selectedAppleImage != null &&
        selectedAppleImage != "" &&
        appleImage != "/assets/ball.png") ||
      (selectedBombImage != null &&
        selectedBombImage != "" &&
        bombImage != "/assets/barrierall.png")
    ) {
      setIsProcessing(false);
      console.log("apple image: ", appleImage);
      console.log("selectedAppleImage: ", selectedAppleImage);
      console.log("bomb image: ", bombImage);
      console.log("selectedBombImage: ", selectedBombImage);
    } else {
    }
  }, [appleImage, bombImage, selectedAppleImage, selectedBombImage]);

  const handleGenerateAppleImage = async (data: FormData) => {
    console.log("ran handleGenerateappleImage");
    const prompt = data.aiAppleImageInput;

    // Validate prompt
    if (!prompt || prompt.trim().length < 2) {
      toast.error("Please enter a valid prompt");
      return;
    }

    setIsProcessing(true);
    setAppleGenerationPrompt(prompt);

    const generatedImageUrl = await generateImageFromPrompt(prompt);

    if (generatedImageUrl) {
      setAppleImage(generatedImageUrl);
      setSelectedAppleImage(generatedImageUrl);
      toast.success("Generated apple image");
    } else {
      toast.error("Failed to generate image");
      setIsProcessing(false);
    }
    // setIsProcessing(false);
  };

  const handleGenerateBombImage = async (data: FormData) => {
    console.log("ran handleGeneratebombImage");
    const prompt = data.aiBombImageInput;

    // Validate prompt
    if (!prompt || prompt.trim().length < 2) {
      toast.error("Please enter a valid prompt");
      return;
    }

    setIsProcessing(true);
    setBombGenerationPrompt(prompt);

    const generatedImageUrl = await generateImageFromPrompt(prompt);

    if (generatedImageUrl) {
      setBombImage(generatedImageUrl);
      console.log("bomb image: ", bombImage);
      setSelectedBombImage(generatedImageUrl);
      console.log("selectedBombImage: ", selectedBombImage);
      toast.success("Generated bomb image");
    } else {
      toast.error("Failed to generate image");
      setIsProcessing(false);
    }
    // setIsProcessing(false);
  };

  const handleGenerateSnakeBodyImage = async (data: FormData) => {
    console.log("ran handleGenerateSnakeBodyImage");
    const prompt = data.aiBombImageInput;

    // Validate prompt
    if (!prompt || prompt.trim().length < 2) {
      toast.error("Please enter a valid prompt");
      return;
    }

    setIsProcessing(true);
    setSnakeBodyGenerationPrompt(prompt);

    const generatedImageUrl = await generateImageFromPrompt(prompt);

    if (generatedImageUrl) {
      setSnakeBodyImage(generatedImageUrl);
      console.log("snake body image: ", bombImage);
      setSelectedSnakeBodyImage(generatedImageUrl);
      console.log("selectedSnakeBodyImage: ", selectedSnakeBodyImage);
      toast.success("Generated bomb image");
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
                  SNAKE BODY
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
                  BOMB
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
                  APPLE
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
                          {selectedSnakeBodyImage ? (
                            <Flex boxSize="50px">
                              <Image
                                src={selectedSnakeBodyImage}
                                alt="Generated snake body image"
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
                              alt="Default snake body image"
                              layout="fill"
                              style={{ borderRadius: "50%" }}
                            />
                          )}
                        </Flex>
                        {selectedSnakeBodyImage ? (
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
                              GENERATED SNAKE BODY IMAGE
                            </Text>
                            <Text
                              fontSize="0.75rem"
                              textAlign="start"
                              h="100%"
                              color={theme.colors.white}
                            >
                              Prompt: {snakeBodyGenerationPrompt}
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
                              DEFAULT SNAKE BODY IMAGE
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
                        onSubmit={handleSubmitSnakeBody(
                          handleGenerateSnakeBodyImage
                        )}
                      >
                        <Controller
                          name="aiSnakeBodyImageInput"
                          control={controlSnakeBody}
                          defaultValue=""
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Textarea
                              {...field}
                              placeholder="Describe snake body to generate"
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

                        {errorsSnakeBody.aiSnakeBodyImageInput && (
                          <Flex
                            w="97%"
                            h="1rem"
                            justifyContent="start"
                            m="0"
                            p="0"
                          >
                            <Text fontSize="0.75rem" color="red" m="0" p="0">
                              Snake body description is required
                            </Text>
                          </Flex>
                        )}
                        <Flex
                          w="100%"
                          gap="0.75rem"
                          mt={
                            errorsSnakeBody.aiSnakeBodyImageInput
                              ? "0.15rem"
                              : "0.5rem"
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
                              setSnakeBodyImage(defaultSnakeBodyImage);
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
                            //   handleSubmit(handleGenerateappleImage);
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
                      name="appleImage"
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
                                setselectedAppleImage(e.target.files[0]);
                                field.onChange(e.target.files[0].name);
                              } else {
                                setselectedAppleImage(null);
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

                    {errors.appleImage && <span>Apple image is required</span>} */}
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
                          {selectedBombImage ? (
                            <Flex boxSize="50px">
                              <Image
                                src={selectedBombImage}
                                alt="Generated bomb image"
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
                              alt="Default bomb image"
                              layout="fill"
                            />
                          )}
                        </Flex>
                        {selectedBombImage ? (
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
                              GENERATED BOMB IMAGE
                            </Text>
                            <Text
                              fontSize="0.75rem"
                              textAlign="start"
                              h="100%"
                              color={theme.colors.white}
                            >
                              Prompt: {bombGenerationPrompt}
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
                              DEFAULT BOMB IMAGE
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
                        onSubmit={handleSubmitBomb(handleGenerateBombImage)}
                      >
                        <Controller
                          name="aiBombImageInput"
                          control={controlBomb}
                          defaultValue=""
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Textarea
                              {...field}
                              placeholder="Describe bomb to generate"
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

                        {errorsBomb.aiBombImageInput && (
                          <Flex
                            w="97%"
                            h="1rem"
                            justifyContent="start"
                            m="0"
                            p="0"
                          >
                            <Text fontSize="0.75rem" color="red" m="0" p="0">
                              Bomb description is required{" "}
                            </Text>
                          </Flex>
                        )}
                        <Flex
                          w="100%"
                          gap="0.75rem"
                          mt={
                            errorsApple.aiAppleImageInput ? "0.15rem" : "0.5rem"
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
                              setBombImage(defaultBombImage);
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
                          {selectedAppleImage ? (
                            <Flex boxSize="50px">
                              <Image
                                src={selectedAppleImage}
                                alt="Generated apple image"
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
                              alt="Default apple image"
                              layout="fill"
                              style={{ borderRadius: "50%" }}
                            />
                          )}
                        </Flex>
                        {selectedAppleImage ? (
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
                              GENERATED APPLE IMAGE
                            </Text>
                            <Text
                              fontSize="0.75rem"
                              textAlign="start"
                              h="100%"
                              color={theme.colors.white}
                            >
                              Prompt: {appleGenerationPrompt}
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
                              DEFAULT APPLE IMAGE
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
                        onSubmit={handleSubmitApple(handleGenerateAppleImage)}
                      >
                        <Controller
                          name="aiAppleImageInput"
                          control={controlApple}
                          defaultValue=""
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Textarea
                              {...field}
                              placeholder="Describe apple to generate"
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

                        {errorsApple.aiAppleImageInput && (
                          <Flex
                            w="97%"
                            h="1rem"
                            justifyContent="start"
                            m="0"
                            p="0"
                          >
                            <Text fontSize="0.75rem" color="red" m="0" p="0">
                              Apple description is required
                            </Text>
                          </Flex>
                        )}
                        <Flex
                          w="100%"
                          gap="0.75rem"
                          mt={
                            errorsApple.aiAppleImageInput ? "0.15rem" : "0.5rem"
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
                              setAppleImage(defaultAppleImage);
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
                            //   handleSubmit(handleGenerateappleImage);
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
                      name="appleImage"
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
                                setselectedAppleImage(e.target.files[0]);
                                field.onChange(e.target.files[0].name);
                              } else {
                                setselectedAppleImage(null);
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

                    {errors.appleImage && <span>Apple image is required</span>} */}
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
  // appleImage: string;
  aiAppleImageInput: string;
  // bombImage: string;
  aiBombImageInput: string;
  // snakeBodyImage: string;
  aiSnakeBodyImageInput: string;
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
