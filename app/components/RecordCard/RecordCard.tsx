import { StageTypes } from "~/types/constant";
import type { RecordType } from "~/types/recordType";
import { Divider } from "@heroui/react";
import { _post } from "~/utils/tools";
import type { Dispatch, SetStateAction } from "react";
import { useGameDataStore } from "~/stores/gameDataStore";
import { styled } from "styled-components";
import RecordTypeLabel from "~/components/RecordCard/RecordTypeLabel";
import CharAvatar from "~/components/RecordCard/CharAvatar";
import { SVGIcon } from "~/components/SVGIcon/SVGIcon";
import { useUserInfoStore } from "~/stores/userInfoStore";

const StyledCardContainer = styled.div`
  width: 100%;
  height: 24rem;
  position: relative;
  overflow: hidden;
  background: #4e4e4e;
  box-shadow: 4px 4px 6px 0 rgba(0, 0, 0, 0.25);
`;

const StyledBasic = styled.div`
  position: absolute;
  background-size: auto 100%;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
`;

const StyledLeftTopDecoration = styled(StyledBasic)`
  background-image: url("/images/card/rogue_4_deco.png");
`;

const StyledRightBottomDecoration = styled(StyledBasic)`
  background-image: url("/images/card/rogue_4_deco.png");
  transform: rotate(180deg);
`;

const StyledLogo = styled(StyledBasic)`
  background-image: url(/images/card/rogue_4_logo.png);
  background-size: auto 40%;
`;

const StyledDotLayer = styled(StyledBasic)`
  background-image: url(/images/card/dots.png);
  background-repeat: repeat-x;
`;

const StyledChar = styled(StyledBasic)`
  background-image: url("/images/char/wsde-1.png");
  background-size: auto 300%;
  background-position: 100% 80%;
`;

const StyledLeftInfo = styled(StyledBasic)`
  display: flex;
  flex-direction: column;
  justify-content: end;
  z-index: 1;
  padding: 0 0 2rem 2rem;
`;

const StyledRightTeam = styled(StyledBasic)`
  width: 50%;
  height: unset;
  left: unset;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
`;

const StyledCornerMark = styled.div`
  position: absolute;
  height: 4rem;
  width: 4rem;
  right: 0;
  top: 0;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0) 50%,
    var(--ak-red) 50%
  );
  & > span {
    position: absolute;
    right: 0.5rem;
    top: 0;
    font-family: "Novecento", sans-serif;
    font-size: 1.8rem;
  }
`;

const bustOrderMapping = (i: number) => {
  if (i === 0) return -1;
  if (i >= 1 && i <= 6) return 2 * i - 1;
  if (i === 7) return 0;
  return 2 * (i - 7);
};

export default function RecordCard({
  isStagePage,
  record,
  setRecords,
}: {
  isStagePage?: boolean;
  record?: RecordType;
  setRecords?: Dispatch<SetStateAction<RecordType[]>>;
}) {
  const { gameData } = useGameDataStore();
  const { userInfo } = useUserInfoStore();

  async function handleDeleteRecord() {
    if (!record) return;
    if (!window.confirm("是否确定删除")) return;
    await _post("/record/delete", { _id: record._id });
    setRecords?.((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((r) => r._id === record._id);
      updated.splice(index, 1);
      return updated;
    });
  }

  if (!record) {
    return (
      <div className="w-full h-72 mb-4 p-8 last-of-type:mb-0 bg-mid-gray"></div>
    );
  }
  return (
    <div className="mb-4">
      {!isStagePage && record.type !== "normal" && (
        <div>
          <span>{StageTypes[record.type]}</span>
          <span
            className={
              record.type === "challenge" ? "text-ak-red" : "text-ak-purple"
            }
          >
            {record.team.length}
          </span>
        </div>
      )}
      <StyledCardContainer>
        <StyledRightBottomDecoration />
        <StyledDotLayer />
        <StyledLeftTopDecoration />
        <StyledLogo />
        <StyledChar />
        <StyledCornerMark>
          <span>{record.level.replace("N", "")}</span>
        </StyledCornerMark>
        <StyledLeftInfo>
          <div className="">
            <span className="text-[7rem] me-4">
              {record.team.length + "人"}
            </span>
            <RecordTypeLabel type={record.type} />
          </div>
          <Divider className="mb-4 bg-white w-1/3" style={{ height: "1px" }} />
          <a
            href={record.raiderLink}
            className="mb-2 flex"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={record.raiderImage}
              alt="raiderImage"
              className="w-10 h-10 rounded me-2"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
            />
            <div className="flex flex-wrap content-center">
              <div>
                <div>{record.raider}</div>
                <div className="text-ak-blue">
                  {new Date(record.date_published).toLocaleDateString("zh-CN")}
                </div>
              </div>
            </div>
          </a>
          <div className="font-light">{record.note}</div>
        </StyledLeftInfo>
        <StyledRightTeam>
          <div className="flex flex-wrap">
            {Array(14)
              .fill(0)
              .map((_, i) => {
                return (
                  <CharAvatar
                    memberData={record.team[bustOrderMapping(i)]}
                    className="w-[14.2%] p-1"
                    isBust={false}
                  />
                );
              })}
          </div>
          <div className="flex justify-end h-8 mt-2">
            <div className="flex justify-evenly w-24 bg-default-50 content-center flex-wrap">
              <SVGIcon
                name="star"
                className="hover:text-yellow-300"
                role="button"
              />
              <SVGIcon
                name="report"
                className="hover:text-yellow-300"
                role="button"
              />
              {userInfo && (
                <SVGIcon
                  name="delete"
                  className="hover:text-yellow-300"
                  role="button"
                  onClick={handleDeleteRecord}
                />
              )}
            </div>
            <div className="w-28 bg-ak-deep-blue flex justify-center content-center flex-wrap">
              <a href={record.url} target="_blank" rel="noopener noreferrer">
                跳转原址
              </a>
            </div>
          </div>
        </StyledRightTeam>
      </StyledCardContainer>
    </div>
  );
}
