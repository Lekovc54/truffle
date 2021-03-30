import React from "react";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import Divider from "ink-divider";

import type TruffleConfig from "@truffle/config";
import type { Db, Resources } from "@truffle/db";
import type { WireDecoder } from "@truffle/decoder";

import { useDecoder } from "@truffle/db-kit/cli/hooks";

export interface Props {
  config: TruffleConfig;
  db: Db;
  project: Resources.IdObject<"projects">;
  address: string;
  Screen: (props: {
    decoder: WireDecoder;
    address: string;
  }) => React.ReactElement | null;
}

export const DecodeAddressContainer = ({
  config,
  db,
  project,
  address,
  Screen
}: Props) => {
  const { decoder, statusByAddress } = useDecoder({
    config,
    db,
    project,
    network: { name: config.network },
    addresses: [address]
  });

  const spinners = Object.entries(statusByAddress).map(([address, status]) => {
    switch (status) {
      case "querying":
        return (
          <Box key={`address-${address}`}>
            <Box paddingLeft={1} paddingRight={1}>
              <Text dimColor color="green">
                <Spinner />
              </Text>
            </Box>
            <Text dimColor bold>
              {address}
            </Text>
            <Text dimColor color="red">
              {" "}
              ::{" "}
            </Text>
            <Text dimColor color="gray">
              Querying @truffle/db...
            </Text>
          </Box>
        );
      case "fetching":
        return (
          <Box key={`address-${address}`}>
            <Box paddingLeft={1} paddingRight={1}>
              <Text dimColor color="green">
                <Spinner />
              </Text>
            </Box>
            <Text dimColor bold>
              {address}
            </Text>
            <Text dimColor color="red">
              {" "}
              ::{" "}
            </Text>
            <Text dimColor color="gray">
              Fetching external...
            </Text>
          </Box>
        );
      case "ok":
        return (
          <Box key={`address-${address}`}>
            <Box paddingLeft={1} paddingRight={1}>
              <Text dimColor color="green">
                ✓
              </Text>
            </Box>
            <Text dimColor bold>
              {address}
            </Text>
            <Text dimColor color="red">
              {" "}
              ::{" "}
            </Text>
            <Text dimColor color="gray">
              OK
            </Text>
          </Box>
        );
      case "failed":
        return (
          <Box key={`address-${address}`}>
            <Box paddingLeft={1} paddingRight={1}>
              <Text dimColor color="yellow">
                ⚠
              </Text>
            </Box>
            <Text dimColor bold>
              {address}
            </Text>
            <Text dimColor color="red">
              {" "}
              ::{" "}
            </Text>
            <Text dimColor color="gray">
              Could not find
            </Text>
          </Box>
        );
    }
  });

  const showLoaders = Object.values(statusByAddress).find(
    status => status !== "ok"
  );

  const body = decoder && (
    <Box flexDirection="column">
      <Box justifyContent="center" marginBottom={1}>
        <Divider width={10} />
      </Box>
      <Screen decoder={decoder} address={address} />
    </Box>
  );

  return (
    <Box flexDirection="column">
      {showLoaders && (
        <Box
          key="loaders"
          flexDirection="column"
          borderStyle="round"
          borderColor="dim"
        >
          <Box paddingX={1}>
            <Text dimColor bold>
              Related addresses:
            </Text>
          </Box>
          <Box paddingX={2} flexDirection="column">
            {...spinners}
          </Box>
        </Box>
      )}
      {body}
    </Box>
  );
};