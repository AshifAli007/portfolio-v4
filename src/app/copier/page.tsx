"use client";

import React, { useState, useEffect, useCallback } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useDropzone } from "react-dropzone";
import { FaCloudUploadAlt } from "react-icons/fa";
import { BsFileEarmarkText, BsFileEarmarkArrowDown } from "react-icons/bs";
import { GiHummingbird } from "react-icons/gi";

const WS_BASE = "wss://portfolio-backend-ldta.onrender.com";

const DATA_SERVER = WS_BASE;
const FILE_SERVER = WS_BASE;

export default function CopierPage() {
  const [textOut, setTextOut] = useState("");
  const [textIn, setTextIn] = useState("");
  const [fileIn, setFileIn] = useState<string>("");

  // text socket
  const {
    sendMessage: sendTextMessage,
    lastMessage: lastTextMessage,
    readyState: dataReadyState,
  } = useWebSocket(DATA_SERVER, { shouldReconnect: () => true });

  // file socket
  const {
    sendMessage: sendFileMessage,
    lastMessage: lastFileMessage,
    readyState: fileReadyState,
  } = useWebSocket(FILE_SERVER, { shouldReconnect: () => true });

  // handle incoming text
  useEffect(() => {
    if (!lastTextMessage) return;
    const payload = lastTextMessage.data;
    if (payload instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => setTextIn((reader.result as string) ?? "");
      reader.readAsText(payload);
    } else {
      setTextIn(payload);
    }
  }, [lastTextMessage]);

  // handle incoming file
  useEffect(() => {
    if (!lastFileMessage) return;
    const payload = lastFileMessage.data;
    if (payload instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => setFileIn((reader.result as string) ?? "");
      reader.readAsDataURL(payload);
    } else {
      setFileIn(payload);
    }
  }, [lastFileMessage]);

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (!accepted.length) return;
      const file = accepted[0];
      const reader = new FileReader();
      reader.onload = e => {
        const arrBuf = e.target?.result;
        if (arrBuf) sendFileMessage(arrBuf as ArrayBuffer);
      };
      reader.readAsArrayBuffer(file);
    },
    [sendFileMessage]
  );

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({ onDrop });

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setTextOut(val);
    sendTextMessage(val);
  };

  const dataOk =
    dataReadyState === ReadyState.OPEN ||
    dataReadyState === ReadyState.CONNECTING;
  const fileOk =
    fileReadyState === ReadyState.OPEN ||
    fileReadyState === ReadyState.CONNECTING;

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-4 py-6 md:py-10 text-[0.78rem]">
      {/* Text sync panel */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-4 md:gap-6 mb-8">
        <div className="relative flex-1 flex flex-col">
          <label className="mb-2 font-semibold tracking-wide text-cyan-300">
            Outgoing (type to broadcast)
          </label>
            <textarea
              value={textOut}
              onChange={handleTextChange}
              rows={18}
              className="custom-scrollbar rounded-lg bg-black/50 border border-white/10 focus:border-cyan-400/60 focus:outline-none p-3 font-mono resize"
              placeholder="Start typing..."
            />
          <GiHummingbird
            size={30}
            className="absolute top-8 right-2"
            style={{ color: dataOk ? "rgb(111,211,131)" : "red" }}
            aria-label="Text socket status"
            title={`Text socket: ${ReadyState[dataReadyState]}`}
          />
        </div>

        <div className="relative flex-1 flex flex-col">
          <label className="mb-2 font-semibold tracking-wide text-cyan-300">
            Incoming (read-only)
          </label>
          <textarea
            value={textIn}
            readOnly
            rows={15}
            className="custom-scrollbar rounded-lg bg-black/30 border border-white/10 p-3 font-mono resize"
            placeholder="Waiting for remote text..."
          />
        </div>
      </div>

      {/* File sync panel */}
      <div className="w-full max-w-5xl grid md:grid-cols-3 gap-6">
        {/* Drop zone */}
        <div
          {...getRootProps()}
          className="md:col-span-2 border border-dashed border-white/15 rounded-xl h-60 flex flex-col items-center justify-center gap-3 cursor-pointer bg-black/30 hover:border-cyan-400/50 transition"
        >
          <input {...getInputProps()} />
          <FaCloudUploadAlt className="text-gray-400" size={60} />
          <p className="text-center text-gray-300">
            Drag & drop file here or click to select
          </p>
          {acceptedFiles.length > 0 && (
            <p className="text-xs text-cyan-300">
              Selected: {acceptedFiles[0].name} ({acceptedFiles[0].size} bytes)
            </p>
          )}
        </div>

        {/* Receive area */}
        <div className="relative h-60 border border-white/10 rounded-xl flex flex-col items-center justify-center bg-black/40">
          <GiHummingbird
            size={28}
            className="absolute top-2 right-2"
            style={{ color: fileOk ? "rgb(111,211,131)" : "red" }}
            aria-label="File socket status"
            title={`File socket: ${ReadyState[fileReadyState]}`}
          />
          {fileIn ? (
            <div className="flex flex-col items-center">
              <a
                href={fileIn}
                download="received_file"
                className="group"
                title="Download received file"
              >
                <BsFileEarmarkArrowDown
                  size={86}
                  className="text-emerald-400 drop-shadow transition group-hover:scale-105"
                />
              </a>
              <p className="mt-3 text-emerald-300">File ready – click to download</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <BsFileEarmarkText size={86} className="text-gray-500" />
              <p className="mt-3 text-gray-400">No file received</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}