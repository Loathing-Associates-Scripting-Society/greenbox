import { IotMDef, IotMStatus, ItemDef } from "greenbox-data";

import Thing from "./Thing";

type Props = {
  item: ItemDef;
  iotm: IotMDef;
  status: IotMStatus;
};

function iotmStatusToThingStatus(status: IotMStatus) {
  switch (status) {
    case IotMStatus.BOUND:
      return "complete";
    case IotMStatus.BOXED:
      return "partial";
    default:
      return null;
  }
}

function itomStatusToTitle(iotm: IotMDef, status: IotMStatus) {
  switch (status) {
    case IotMStatus.BOUND:
      return iotm.type !== "vip" ? "Have" : "Have access if your clan owns one";
    case IotMStatus.BOXED:
      return "Have store item";
    default:
      return "Do not have";
  }
}

export default function IotM({ item, status, iotm }: Props) {
  if (!item) return null;
  return (
    <Thing
      type="trophy"
      name={item.name}
      image={`itemimages/${item.image}`}
      state={iotmStatusToThingStatus(status)}
      title={itomStatusToTitle(iotm, status)}
    />
  );
}
