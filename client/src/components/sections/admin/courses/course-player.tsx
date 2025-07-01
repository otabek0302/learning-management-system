import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

const CoursePlayer = ({ videoUrl }: { videoUrl: string }) => {
  const [videoData, setVideoData] = useState({
    otp: "",
    playbackInfo: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/courses/generate-video-otp`, {
        videoId: videoUrl,
      })
      .then((res: any) => {
        setVideoData(res.data);
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
        console.log(err);
      });
  }, [videoUrl]);

  return (
    <div className="h-full w-full">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        {loading ? (
          <div className="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-black/80">
            <Loader2 className="h-10 w-10 animate-spin text-white" />
          </div>
        ) : (
          <iframe
            src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}&player=`}
            style={{
              border: "0",
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
            allowFullScreen={true}
            allow="encrypted-media"
            title="Course Demo Video"
          />
        )}
      </div>
      <div className="mt-2 text-center text-sm text-gray-500">{loading ? "Loading video..." : "Secure video powered by VdoCipher"}</div>
    </div>
  );
};

export default CoursePlayer;
