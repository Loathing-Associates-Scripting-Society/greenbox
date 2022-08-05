import { Accordion, Container, ToastId, useToast } from "@chakra-ui/react";
import { RawSnapshotData } from "greenbox-data";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchAll, RootState, store } from "../store";

import Familiars from "./Familiars";
import Header from "./Header";
import Skills from "./Skills";
import Tattoos from "./Tattoos";
import Trophies from "./Trophies";

export default function MainPage() {
  const [data, setData] = useState<RawSnapshotData | null>(null);

  const dispatch = useDispatch<typeof store.dispatch>();

  useEffect(() => {
    dispatch(fetchAll(false));
  }, [dispatch]);

  const toast = useToast();
  const clashToast = useRef<ToastId>();
  const loading = useSelector((state: RootState) => state.loading);
  const error = useSelector((state: RootState) => state.error);

  const id = "clash-toast";

  useEffect(() => {
    if (loading.wikiClashes && !toast.isActive(id)) {
      clashToast.current = toast({
        description: "Detecting name clashes for wiki links (takes a few seconds)...",
        duration: null,
        id,
      });
    } else if (clashToast.current) {
      if (error.wikiClashes) {
        toast.update(clashToast.current, {
          description: "Clash detection errored (probably don't support web workers)",
          status: "error",
          duration: 2000,
        });
      } else {
        toast.update(clashToast.current, {
          description: "Clash detection complete",
          status: "success",
          duration: 2000,
        });
      }
    }
  }, [loading.wikiClashes]);

  return (
    <Container maxWidth="1000px" width="100%">
      <Accordion allowMultiple allowToggle defaultIndex={0}>
        <Header value={data} onChange={setData} />
        <Skills skills={data?.skills ?? []} />
        <Familiars familiars={data?.familiars ?? []} />
        <Tattoos outfitTattoos={data?.outfitTattoos ?? []} />
        <Trophies trophies={data?.trophies ?? []} />
      </Accordion>
    </Container>
  );
}