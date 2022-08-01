import { Flex, Text } from "@chakra-ui/react";

import AlphaImage from "./AlphaImage";

type StateType = "complete" | "partial" | null | undefined;

type Props = {
  state?: StateType;
  name: string;
  image: string;
  title?: string;
};

function styleFromState(state: StateType) {
  switch (state) {
    case "complete": {
      return { backgroundColor: "complete" };
    }
    case "partial": {
      return {
        backgroundColor: "partial",
        backgroundImage:
          "repeating-linear-gradient(45deg, white 25%, transparent 25%, transparent 75%, white 75%, white), repeating-linear-gradient(45deg, white 25%, transparent 25%, transparent 75%, white 75%, white)",
        backgroundPosition: "0 0, 10px 10px",
        backgroundSize: "20px 20px",
      };
    }
    default: {
      return {};
    }
  }
}

export default function Thing({
  state,
  name,
  image,
  title = `${name} (${state || "none"})`,
}: Props) {
  const style = styleFromState(state);

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      border="1px solid black"
      p={1}
      {...style}
      title={title}
    >
      <AlphaImage
        src={`http://images.kingdomofloathing.com/itemimages/${image}`}
      />
      <Text textAlign="center" fontSize="10px">
        {name}
      </Text>
    </Flex>
  );
}
