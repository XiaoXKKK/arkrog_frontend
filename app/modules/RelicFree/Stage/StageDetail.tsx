import type {
  GameData,
  RogueKey,
  StageData,
  TopicData,
} from "~/types/gameData";
import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { styled } from "styled-components";
import { Skeleton } from "@heroui/react";
import { useNavigate } from "react-router";
import SubmitForm from "~/modules/RecordForm/SubmitForm";
import type { RecordType } from "~/types/recordType";

// @ts-ignore
const StyledDescriptionBlock = styled.div.attrs((props) => ({
  // @ts-ignore
  "data-type": props.type,
}))`
  padding: 1.5rem;
  background: var(--black-gray);
  white-space: pre-wrap;
  position: relative;
  &::after {
    display: ${(props) =>
      // @ts-ignore
      props.type ? "block" : "none"};
    content: attr(data-type);
    position: absolute;
    right: 1rem;
    top: 1rem;
    padding: 0.25rem 1rem;
    font-size: 0.8rem;
    background: ${(props) =>
      // @ts-ignore
      props.type === "紧急" ? "var(--ak-red)" : "var(--ak-purple)"};
  }
`;

const StyledBackButtonContainer = styled.div`
  position: absolute;
  width: 100vw;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
`;

const StyledBackButton = styled.button`
  position: absolute;
  right: 0;
  top: 2rem;
  padding: 0.5rem 2rem;
  background: var(--black-gray);
`;

export default function StageDetail({
  topicData,
  stageData,
  gameData,
  setRecords,
}: {
  topicData: TopicData;
  stageData: StageData;
  gameData: GameData;
  setRecords: Dispatch<SetStateAction<RecordType[]>>;
}) {
  const mapRef = useRef<HTMLImageElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.onload = () => {
        setMapLoaded(true);
      };
    }
  }, [mapRef]);

  const breadcrumb = useMemo(() => {
    // const [ro, type] = stageData.id.split("_");
    // console.log(topicData);
    return `${topicData.name} // 第？层 // 等待手工录入`;
  }, [topicData]);

  const eliteStageData: StageData | null = useMemo(() => {
    if (!stageData.id.match(/ro\d_n/)) return null;
    const eliteId = stageData.id.replace("n", "e");
    const [ro] = stageData.id.split("_");
    const rogueKey: RogueKey = ("rogue_" + ro.slice(-1)) as RogueKey;
    return gameData.stages[rogueKey][eliteId];
  }, [gameData, stageData]);

  const navigate = useNavigate();

  return (
    <div className="mb-10 relative">
      <StyledBackButtonContainer>
        <div className="relative">
          <StyledBackButton onClick={() => navigate(-1)}>返回</StyledBackButton>
        </div>
      </StyledBackButtonContainer>
      <h1 className="font-bold mb-2 flex items-end">
        <span className="text-[2.5rem] leading-10 me-2">{stageData.name}</span>
        <span className="text-2xl">{stageData.code}</span>
        <SubmitForm
          stageId={stageData.id}
          setRecords={setRecords}
          gameData={gameData}
        />
      </h1>
      <div className="text-ak-blue text-sm mb-8">{breadcrumb}</div>
      <div className="grid gap-4 grid-cols-2 mb-8">
        <StyledDescriptionBlock>{stageData.description}</StyledDescriptionBlock>
        {/* @ts-ignore */}
        <StyledDescriptionBlock type={eliteStageData ? "紧急" : "带船"}>
          {eliteStageData ? eliteStageData.eliteDesc : "带船信息需手动录入"}
        </StyledDescriptionBlock>
      </div>
      <div className="grid gap-4 grid-cols-2 mb-8">
        <div>
          <span className="text-lg font-bold mb-2">地图</span>
          <Skeleton className="w-full aspect-video" isLoaded={mapLoaded}>
            <img
              ref={mapRef}
              className="w-full"
              src={`https://torappu.prts.wiki/assets/map_preview/${stageData.id}.png`}
              alt="map"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
            />
          </Skeleton>
        </div>
        <div>
          <span className="text-lg font-bold mb-2">敌方情报</span>
          <Skeleton className="w-full" style={{ aspectRatio: "16/9" }}>
            <div className="bg-mid-gray" />
          </Skeleton>
        </div>
      </div>
    </div>
  );
}
