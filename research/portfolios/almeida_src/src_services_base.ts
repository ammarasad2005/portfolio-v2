const TIME = 120000;
const GATEWAY = "https://server-mail-seven.vercel.app";

interface BaseServiceProps<T> {
  payload: T;
  method: string;
  endPoint: string;
  errorMessage: string;
}

function timeoutRequestObject() {
  const controller = new AbortController();
  const timeoutId: ReturnType<typeof setTimeout> = setTimeout(() => {
    controller.abort();
  }, TIME);

  return {
    timeoutId,
  };
}

export async function baseService<T>({
  payload,
  method,
  endPoint,
  errorMessage,
}: BaseServiceProps<T>): Promise<{ success: boolean }> {
  const { timeoutId } = timeoutRequestObject();

  try {
    const response = await fetch(`${GATEWAY}${endPoint}`, {
      method,
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(errorMessage);
    }

    const data = (await response.json()) as { success: boolean };
    return data;
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Timeout: Request takes too much time");
    }
    throw error;
  }
}
