"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { Dispatch, SetStateAction } from "react";

type Props = {
  setFileInput: Dispatch<SetStateAction<FileList | null>>;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  setTabValue: Dispatch<SetStateAction<"upload" | "paste">>;
  onContinue: () => void;
};

export default function SourceConfig({
  setFileInput,
  setTabValue,
  input,
  setInput,
  onContinue,
}: Props) {
  return (
    <Tabs defaultValue="upload">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger onClick={() => setTabValue("upload")} value="upload">Upload</TabsTrigger>
        <TabsTrigger onClick={() => setTabValue("paste")} value="paste">Paste</TabsTrigger>
      </TabsList>
      <TabsContent value="upload">
        <div className="flex flex-col space-y-2 mt-2">
          <Input
            id="dataFile"
            type="file"
            accept="text/plain, application/pdf"
            onChange={(e) => setFileInput(e.target.files)}
          />
          <Button onClick={onContinue}>
            Continue <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="paste">
        <div className="flex flex-col space-y-2 mt-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[200px]"
            id="sourceText"
          />
          <Button onClick={onContinue}>
            Continue <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
