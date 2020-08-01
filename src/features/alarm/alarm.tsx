import React, { useEffect, useState, useCallback } from "react";
import Player from "react-audio-player";
import { useAlarm } from "./alarmSlice";
export const Alarm: React.FC = () => {
  const [emitAt, setEmitAt] = useState(Date.now());
  const [autoPlay, setAutoPlay] = useState(false);
  const [src, setSrc] = useState("");
  const evt = useAlarm.useEvt();
  const handleEnded = useCallback(() => {
    setAutoPlay(false);
  }, [setAutoPlay]);
  useEffect(() => {
    if (emitAt < evt.emitAt) {
      setAutoPlay(true);
      setEmitAt(evt.emitAt);
      setSrc(`${process.env.PUBLIC_URL}/${evt.type}.mp3`);
    }
  }, [emitAt, evt]);
  if (autoPlay) {
    return <Player autoPlay={autoPlay} src={src} onEnded={handleEnded} />;
  } else {
    return <></>;
  }
};
