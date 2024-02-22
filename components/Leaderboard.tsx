import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  List,
  Flex,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { getLeaderboard, Score } from "../utils/supabase";
import theme from "@/styles/theme";

export function Leaderboard() {
  const [topScores, setTopScores] = useState<Score[]>([]);

  useEffect(() => {
    getLeaderboard().then((scores: Score[]) => setTopScores(scores));
  }, []);

  return (
    <>
      <Text
        color="white"
        fontSize="21px"
        fontWeight="700"
        width="100%"
        height="100%"
        textAlign="start"
      >
        LEADERBOARDS
      </Text>
      <Tabs variant="soft-rounded" colorScheme="current">
        <TabList pt="1rem">
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
            GLOBAL
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
            PERSONAL
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel
            py={0}
            px={0}
            maxHeight="calc(22rem - 6rem)"
            overflowY="auto"
          >
            <List mt="1rem" width="100%">
              {topScores.length > 0 ? (
                topScores.map((score: Score, index: number) => (
                  <Flex key={index} align="center" mb="12px" height="40px">
                    <Text
                      fontSize="18px"
                      fontWeight="800"
                      fontFamily="Montserrat"
                      color="white"
                      width="2ch"
                    >
                      {index + 1}
                    </Text>
                    <Box width="100%" ml={1} p={3} backgroundColor="#1A1A1D">
                      <Flex justifyContent="space-between" width="100%">
                        <Text fontSize="14px" color="white">
                          {score.user.slice(0, 3) +
                            "..." +
                            score.user.slice(-5)}
                        </Text>
                        <Text fontSize="14px" color="white">
                          {score.score}
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                ))
              ) : (
                <Text
                  color="#fbfbfb"
                  textAlign="start"
                  my="10px"
                  fontSize="0.8rem"
                >
                  NO SAVED SCORES FOUND
                </Text>
              )}
            </List>
          </TabPanel>
          <TabPanel py={2}>
            <Text
              color="#fbfbfb"
              textAlign="center"
              my="10px"
              fontSize="0.8rem"
            >
              {/* LOGIN TO VIEW PERSONAL LEADERBOARD */}
              PERSONAL LEADERBOARD COMING SOON
            </Text>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
