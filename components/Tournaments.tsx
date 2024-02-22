import React, { useState, useEffect } from "react";
import { Box, Text, List, VStack } from "@chakra-ui/react";
import { Tournament, getTournamentsByGameName } from "../utils/tournament";
import theme from "@/styles/theme";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import Link from "next/link";

dayjs.extend(duration);

export function Tournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    getTournamentsByGameName("Meteor Crash").then((data: Tournament[]) => {
      setTournaments(data);
    });
  }, []);

  const formatNumber = (num: number) => {
    return num.toString().padStart(2, "0");
  };

  const timeRemaining = (start: string, end: string) => {
    let now = dayjs();
    let startDate = dayjs(start);
    let endDate = dayjs(end);

    let diff;
    let status;

    if (now.isBefore(startDate)) {
      diff = dayjs.duration(startDate.diff(now));
      status = "Starts in";
    } else if (now.isBefore(endDate)) {
      diff = dayjs.duration(endDate.diff(now));
      status = "Ends in";
    } else {
      diff = dayjs.duration(0);
      status = "Ended";
    }

    return {
      time: `${formatNumber(diff.days())}d ${formatNumber(
        diff.hours()
      )}h ${formatNumber(diff.minutes())}m`,
      status: status,
    };
  };

  return (
    <>
      <Text color="#fbfbfb" fontSize="21px" fontWeight="700" textAlign="start">
        TOURNAMENTS
      </Text>

      <List mt={2} width="100%" spacing={3}>
        {tournaments.length > 0 ? (
          tournaments.map((tournament: Tournament, index: number) => {
            const { time, status } = timeRemaining(
              tournament.start_datetime,
              tournament.end_datetime
            );
            return (
              <Link
                key={index}
                href={`https://rex-retro-tournaments.r3x.tech/tournament/${tournament.id}`}
              >
                <Box
                  width="100%"
                  height="90px"
                  p={3}
                  mb={3}
                  backgroundColor="#1A1A1D"
                  cursor="pointer"
                >
                  <VStack align="start" spacing={1}>
                    <Text fontSize="14px" color="#fbfbfb" fontWeight="bold">
                      {`${tournament.tournament_name}`}
                    </Text>
                    <Text fontSize="14px" color="#fbfbfb">
                      {`${status}: ${time}`}
                    </Text>
                  </VStack>
                </Box>
              </Link>
            );
          })
        ) : (
          <Text color="#fbfbfb" textAlign="start" my="10px" fontSize="0.8rem">
            NO ACTIVE TOURNAMENTS
          </Text>
        )}
      </List>
    </>
  );
}
