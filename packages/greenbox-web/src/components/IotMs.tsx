import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import { IotMStatus, RawIotM } from "greenbox-data";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import { RootState } from "../store";
import { chunk, notNullOrUndefined, useItemMap } from "../utils";

import IotM from "./IotM";
import RotatedHeading from "./RotatedHeading";
import Section from "./Section";

type Props = {
  iotms: RawIotM[];
};

export default function IotMs({ iotms: playerIotMs }: Props) {
  const iotms = useSelector((state: RootState) => state.iotms);
  const loading = useSelector((state: RootState) => state.loading.iotms || false);

  // Put together a map of item ids to item definitions for this Path
  const idToItem = useItemMap(iotms.map((i) => i.id));

  const numberOfIotMs = useMemo(
    () => playerIotMs.filter((i) => i[1] == IotMStatus.BOUND).length,
    [playerIotMs]
  );
  const idToIotM = useMemo(
    () => playerIotMs.reduce((acc, i) => ({ ...acc, [i[0]]: i }), {} as { [id: number]: RawIotM }),
    [playerIotMs]
  );

  const iotmChunks = useMemo(() => chunk([...Array(9).map((_) => null), ...iotms], 12), [iotms]);

  return (
    <Section
      title="IotMs"
      icon="itemimages/mracc.gif"
      loading={loading}
      values={[
        {
          color: "complete",
          value: numberOfIotMs,
          name: `${numberOfIotMs} / ${iotms.length} IotMs bound`,
        },
      ]}
      max={iotms.length}
    >
      <SimpleGrid columns={[13]} spacing={1} gridTemplateColumns="auto repeat(12, minmax(0, 1fr))">
        {iotmChunks.map((yearChunk, year) => {
          const all = yearChunk
            .filter(notNullOrUndefined)
            .map((i) => idToIotM[i.id]?.[1] ?? IotMStatus.NONE)
            .every((status) => status !== IotMStatus.NONE);
          return [
            <Flex alignItems="center" justifyContent="flex-end">
              <RotatedHeading bg={all ? "complete" : undefined}>{year + 2004}</RotatedHeading>
            </Flex>,
            ...yearChunk.map((iotm, i) =>
              iotm ? (
                <IotM
                  key={iotm.id}
                  item={idToItem[iotm.id]}
                  iotm={iotm}
                  status={idToIotM[iotm.id]?.[1] ?? 0}
                />
              ) : (
                <Box key={`blank-${i}`} />
              )
            ),
          ];
        })}
      </SimpleGrid>
    </Section>
  );
}
