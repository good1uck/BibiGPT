import { fetchBilibiliSubtitleUrls } from "~/lib/bilibili/fetchBilibiliSubtitleUrls";
import { reduceBilibiliSubtitleTimestamp } from "~/utils/reduceSubtitleTimestamp";

export async function fetchBilibiliSubtitle(
  videoId: string,
  shouldShowTimestamp?: boolean
) {
  const res = await fetchBilibiliSubtitleUrls(videoId);
  const { title, desc, dynamic } = res || {};
  const hasDescription = desc || dynamic;
  const descriptionText = hasDescription ? `${desc} ${dynamic}` : undefined;
  const subtitleList = res?.subtitle?.list;
  if (!subtitleList || subtitleList?.length < 1) {
    return { title, subtitlesArray: null, descriptionText };
  }

  const betterSubtitle =
    subtitleList.find(({ lan }: { lan: string }) => lan === "zh-CN") ||
    subtitleList[0];
  const subtitleUrl = betterSubtitle?.subtitle_url;
  console.log("subtitle_url", subtitleUrl);

  const subtitleResponse = await fetch(subtitleUrl);
  const subtitles = await subtitleResponse.json();
  const transcripts = reduceBilibiliSubtitleTimestamp(
    subtitles?.body,
    shouldShowTimestamp
  );
  return { title, subtitlesArray: transcripts, descriptionText };
}

// const res = await pRetry(async () => await fetchBilibiliSubtitles(videoId), {
//   onFailedAttempt: (error) => {
//     console.log(
//       `Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`
//     );
//   },
//   retries: 2,
// });
// @ts-ignore
