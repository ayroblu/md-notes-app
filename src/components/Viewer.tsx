import { useRecoilValue } from "recoil";

import { dropboxFileBlobUrlState } from "@/data-model/dropbox";
import { getViewerExtensionInfo } from "@/data-model/mimetypes";
import { exhaustiveCheck } from "@/utils/main";

import styles from "./Viewer.module.css";

type Props = {
  filename: string;
};
export function Viewer({ filename }: Props) {
  const viewerInfo = getViewerExtensionInfo(filename)!;
  switch (viewerInfo.viewer) {
    case "iframe":
      return <IframeViewer filename={filename} />;
    case "audio":
      return <AudioViewer filename={filename} />;
    case "video":
      return <VideoViewer filename={filename} />;
    case "image":
      return <ImageViewer filename={filename} />;
    default:
      exhaustiveCheck(viewerInfo.viewer);
      return null;
  }
}
function IframeViewer({ filename }: Props) {
  const url = useRecoilValue(dropboxFileBlobUrlState(filename));
  return <iframe className={styles.iframe} src={url} />;
}

function ImageViewer({ filename }: Props) {
  const url = useRecoilValue(dropboxFileBlobUrlState(filename));
  return <img className={styles.iframe} src={url} />;
}

function AudioViewer({ filename }: Props) {
  const url = useRecoilValue(dropboxFileBlobUrlState(filename));
  return <audio className={styles.iframe} src={url} />;
}

function VideoViewer({ filename }: Props) {
  const url = useRecoilValue(dropboxFileBlobUrlState(filename));
  return <video className={styles.iframe} src={url} />;
}
