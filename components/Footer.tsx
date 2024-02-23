import { Box, Text, Flex, Image } from "@chakra-ui/react";

export const Footer = () => (
  // <Flex w="100%" justifyContent="center" alignItems="center">
  //   <Flex
  //     w="360px"
  //     justifyContent="flex-end"
  //     alignItems="end"
  //     color="white"
  //     padding="0rem 0rem"
  //     mt="-2rem"
  //   >
  //     <Image src="../assets/poweredby.svg" h="1.5rem" alt="POWERED BY REX" />
  //   </Flex>
  // </Flex>
  <Flex w="100%" justifyContent="center" bg="pink">
    <Flex w="360px" justifyContent="space-between">
      <Box
        textAlign="center"
        color="white"
        padding="0rem"
        margin="1rem 0rem 0rem 0rem"
        fontFamily="Montserrat"
        fontSize="0.5rem"
        fontWeight="500"
        onClick={() => {
          if (typeof window !== "undefined") {
            window.open("https://www.r3x.tech/", "_blank");
          }
        }}
        cursor="pointer"
      >
        2023 REX Slip & Slither. All rights reserved.
      </Box>

      <Text
        textAlign="center"
        color="white"
        padding="0rem"
        margin="1rem 0rem 0rem 0rem"
        fontFamily="Montserrat"
        fontSize="0.5rem"
        fontWeight="800"
        onClick={() => {
          if (typeof window !== "undefined") {
            window.open("https://forms.gle/YXZSaH2PJNvkkucX7", "_blank");
          }
        }}
        cursor="pointer"
      >
        REPORT AN ISSUE?
      </Text>
    </Flex>
  </Flex>
);
