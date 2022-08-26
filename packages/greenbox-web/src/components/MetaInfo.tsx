import { Text } from "@chakra-ui/react";
import { format, formatDistance, intlFormat, parseISO } from "date-fns";
import { Meta } from "greenbox-data";
import { useEffect, useMemo, useState } from "react";

type Props = {
  meta: Meta;
};

export default function MetaInfo({ meta }: Props) {
  const [now, setNow] = useState(new Date());
  const date = useMemo(() => parseISO(meta.timestamp), [meta.timestamp]);
  const humanDate = useMemo(
    () =>
      intlFormat(date, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }),
    [date]
  );

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const timeago = useMemo(() => formatDistance(date, now, { addSuffix: true }), [now, date]);

  return (
    <Text fontSize="large">
      <span title={`r${meta.revision}`}>Snapshot</span> by{" "}
      <b title={`Player #${meta.id}`}>{meta.name}</b> from <span title={humanDate}>{timeago}</span>
    </Text>
  );
}