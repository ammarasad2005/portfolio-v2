"use client";

import Button from "../atoms/Button";

interface DownloadButtonProps {
  children: React.ReactNode;
  fileName: string;
  filePath: string;
}

export default function DownloadButton({
  children,
  filePath,
  fileName,
}: DownloadButtonProps) {
  const handleOnClick = () => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button variant="secondary" onClick={() => handleOnClick()}>
      {children}
    </Button>
  );
}
