import { useEffect, useRef, useState } from "react";

const URL = "https://orbi.orbious.ai/api/chat";

export const useOrbiousAI = ({
  systemInstructions,
}: {
  systemInstructions: string;
}) => {
  const controller = useRef<AbortController | null>(null);
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (controller.current) {
        controller.current.abort();
        controller.current = null;
      }
    };
  }, []);

  const prompt = async (prompt: string) => {
    if (controller.current) {
      controller.current.abort();
      controller.current = null;
    }

    controller.current = new AbortController();

    setLoading(true);
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Connection: "keep-alive",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        model: "orbiousdanger",
        stream: true,
        messages: [
          { role: "system", content: systemInstructions },
          { role: "user", content: prompt },
        ],
      }),
      signal: controller.current.signal,
      keepalive: true,
    });

    setLoading(false);

    if (!response.body) {
      throw new Error("can't get reader from body");
    }

    const reader = response.body.getReader();
    let resText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = new TextDecoder().decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          const data = JSON.parse(line);
          if (data.message.content) {
            resText += data.message.content;
            setResponse(resText);
          }

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
          // console.error("Error parsing . JSON:", e);
        }
      }
    }
  };

  return {
    prompt,
    response,
    loading,
  };
};
