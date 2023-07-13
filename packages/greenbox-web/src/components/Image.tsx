import { Image as ChakraImage, ImageProps } from "@chakra-ui/react";

import { useColorModeFilter } from "../theme";

export default function Image(props: ImageProps) {
  const filter = useColorModeFilter();

  return <ChakraImage {...props} filter={filter} />;
}
