import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Flex,
  Text,
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
  NumberInput,
  NumberInputField,
  Spinner,
  useDisclosure,
  VStack,
  CloseButton,
  Input,
} from "@chakra-ui/react";
import theme from "@/styles/theme";
import { useLoadingStore } from "../stores/useLoadingStore";
import { useForm, Controller } from "react-hook-form";
import Image from "next/image";

interface CustomizeModalProps {
  gameInProgress: boolean;
}

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  gameInProgress,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedBallImage, setSelectedBallImage] = useState<File | null>(null);
  const { handleSubmit, control, formState, setValue } = useForm<FormData>();
  const { errors } = formState;

  return (
    <Flex>
      <Button
        my="1rem"
        w="362px"
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
        onClick={onOpen}
      >
        CUSTOMIZE GAME
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent
          backgroundColor="black"
          border="2px solid white"
          borderRadius="0"
          mt="3rem"
          w="360px"
          minH="425px"
        >
          <ModalHeader>
            <Flex justifyContent="space-between" alignItems="center">
              <Text color="#fbfbfb" fontSize="1.25rem" fontWeight="700">
                CUSTOMIZE GAME
              </Text>
              <Button
                mr="-0.5rem"
                p="0"
                onClick={onClose}
                size="sm"
                fontSize="1.25rem"
                color="white"
                variant="ghost"
              >
                <CloseButton />
              </Button>
            </Flex>
          </ModalHeader>
          <ModalBody w="100%">
            <VStack spacing="25px">
              {useLoadingStore.getState().loadingStatus ? (
                <VStack>
                  <Spinner color="#ffffff" />
                  <Text color="white">GENERATING</Text>
                </VStack>
              ) : (
                <Flex
                  flexDirection="column"
                  justifyContent="space-between"
                  alignContent="center"
                  h="100%"
                  w="100%"
                >
                  <Flex
                    flexDirection="column"
                    w="100%"
                    mt="0rem"
                    p="1rem"
                    color={theme.colors.white}
                    bg={theme.colors.secondary}
                  >
                    <Text
                      color={theme.colors.white}
                      fontSize="0.75rem"
                      fontWeight="700"
                      mb="0.5rem"
                    >
                      BALL IMAGE
                    </Text>
                    <Flex alignItems="center" marginBottom="0.5rem">
                      {/* Image Preview or Placeholder */}
                      <Flex
                        align="center"
                        justifyContent="center"
                        borderRadius="1px"
                        flexDirection="column"
                        marginRight="1rem"
                        w="5rem"
                        gap={2}
                      >
                        <Flex
                          align="center"
                          justifyContent="center"
                          boxSize="50px"
                          overflow="hidden"
                          borderRadius="50%"
                          bg={theme.colors.secondary}
                          marginRight="1rem"
                          position="relative"
                        >
                          {selectedBallImage ? (
                            <Image
                              src={URL.createObjectURL(selectedBallImage)}
                              alt="Selected game key image"
                              layout="fill"
                              style={{
                                borderRadius: "50%",
                              }}
                            />
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
                          <Text fontSize="0.75rem" textAlign="center">
                            {selectedBallImage &&
                              truncateFilename(selectedBallImage.name)}
                          </Text>
                        ) : (
                          <Text
                            textAlign="center"
                            w="100%"
                            h="100%"
                            color={theme.colors.white}
                            fontSize="0.75rem"
                          >
                            Default
                          </Text>
                        )}
                      </Flex>
                      <Flex
                        flexDirection="column"
                        align="flex-end"
                        w="100%"
                        mt="0rem"
                      >
                        <Controller
                          name="aiBallImageInput"
                          control={control}
                          defaultValue=""
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="Describe ball to generate"
                              w="100%"
                              h="2.5rem"
                              fontSize="0.75rem"
                              bg={theme.colors.input}
                              borderWidth="2px"
                              borderRadius="1px"
                              borderColor={theme.colors.input}
                              fontWeight="500"
                              letterSpacing="1px"
                              color={theme.colors.lightBlue}
                              focusBorderColor={theme.colors.input}
                              _placeholder={{
                                color: theme.colors.evenLighterBlue,
                              }}
                              _focus={{ boxShadow: "none" }}
                            />
                          )}
                        />

                        {errors.aiBallImageInput && (
                          <span>Description is required</span>
                        )}
                        <Button
                          mt="0.5rem"
                          bg="#665EFF"
                          color="white"
                          width="100%"
                          border="2px solid #665EFF"
                          borderRadius="1px"
                          h="2rem"
                          w="8rem"
                          fontSize="0.8rem"
                          letterSpacing="1px"
                          fontWeight="700"
                          isDisabled={false}
                          _hover={{ bg: "#817df2", borderColor: "#817df2" }}
                          onClick={() => {}}
                        >
                          GENERATE
                        </Button>
                      </Flex>
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
                </Flex>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

type FormData = {
  ballImage: string;
  aiBallImageInput: string;
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
