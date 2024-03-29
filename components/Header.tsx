import {
  Box,
  Button,
  Flex,
  Image,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import theme from "@/styles/theme";
import { MdLeaderboard } from "react-icons/md";
import { LoginComponent } from "./LoginComponent";
import { Leaderboard } from "./Leaderboard";
import { Customize } from "./Customize";
import { TbMoodEdit } from "react-icons/tb";

const Header = ({
  onConnect,
  authStatus,
}: {
  onConnect: () => void;
  authStatus: string;
}) => (
  <Flex
    as="header"
    width="100%"
    justifyContent="center"
    alignItems="flex-end"
    minHeight="40px"
    mt="0rem"
    mb="10rem"
  >
    <Flex
      justifyContent="space-between"
      alignItems="center"
      maxWidth="360px"
      width="100%"
    >
      {/* <Flex flex="2" justifyContent="flex-start">
        <LoginComponent />
      </Flex> */}
      <Flex flex="1" justifyContent="center">
        <Popover placement="bottom-end">
          <PopoverTrigger>
            <Box cursor="pointer">
              <MdLeaderboard size="1.75rem" color="white" />
            </Box>
          </PopoverTrigger>

          <PopoverContent
            color="#fff"
            width="365px"
            border="2px solid white"
            borderRadius="0px"
            bg={theme.colors.black}
            height="23rem"
            mt="2px"
            py={3}
            px={5}
            style={{ marginRight: "-123px" }}
          >
            <PopoverCloseButton
              position="absolute"
              top={4}
              right={4}
              fontSize="0.75rem"
            />

            <Leaderboard />
          </PopoverContent>
        </Popover>
      </Flex>
      <Flex flex="1" justifyContent="flex-end">
        <Popover placement="bottom-end">
          <PopoverTrigger>
            <Box cursor="pointer">
              <TbMoodEdit size="1.75rem" color="white" />
            </Box>
          </PopoverTrigger>
          <PopoverContent
            color="#fff"
            width="365px"
            border="2px solid white"
            borderRadius="0px"
            bg={theme.colors.black}
            height="23rem"
            mt="2px"
            py={3}
            px={5}
            style={{ marginRight: "-2px" }}
          >
            <PopoverCloseButton
              position="absolute"
              top={4}
              right={4}
              fontSize="0.75rem"
            />
            <Customize />
          </PopoverContent>
        </Popover>
      </Flex>
    </Flex>
  </Flex>
);

export default Header;
