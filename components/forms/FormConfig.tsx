"use client";

import { ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";

export default function FormConfig({
  onContinue,
}: {
  onContinue: (text: string) => void | Promise<void>;
}) {
  const [input, setInput] = useState<string>("");
  const [fileInput, setFileInput] = useState<FileList | null>(null);
  const [tabValue, setTabValue] = useState<string>("upload");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [link, setLink] = useState<string>("")

  async function handleContinue() {
    console.log(tabValue)

    if (tabValue == "upload" && fileInput) {
      setIsLoading(true)
      const formData = new FormData();
      formData.append("file", fileInput[0]);
      const res = await fetch("/api/file", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json()) as string;
      console.log(`Data: ${data}`)
      onContinue(data);
      setIsLoading(false);
      toast({
        description: <p className="flex items-center"><Check className="h-4 w-4 mr-2 "/>Source data configured.</p>
      });
      return
    } 
    
    if (tabValue == "link" && link) {
      console.log(link)
      setIsLoading(true)
      const res = await fetch(`/api/link?link=${link}`)
      const data = await res.json()
      onContinue(data)
      setIsLoading(false)
      toast({
        description: <p className="flex items-center"><Check className="h-4 w-4 mr-2 "/>Source data configured.</p>
      });
      return
    }   

    if (tabValue == "paste" && input) {
      console.log("foo")
      onContinue(input)
      toast({
        description: <p className="flex items-center"><Check className="h-4 w-4 mr-2 "/>Source data configured.</p>
      });
      return
    }
  }

  return (
    <Tabs value={tabValue} onValueChange={(value: string) => setTabValue(value)} defaultValue="upload">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="upload">
          Upload
        </TabsTrigger>
        <TabsTrigger value="paste">
          Paste
        </TabsTrigger>
        <TabsTrigger value="link">
          Link
        </TabsTrigger>
      </TabsList>
      <TabsContent value="upload">
        <div className="flex flex-col space-y-4 mt-2">
          <Input
            type="file"
            // accept="text/plain, application/pdf, video/*, audio/*"
            accept="text/plain, application/pdf"
            onChange={(e) => setFileInput(e.target.files)}
          />
          <Button className="w-fit" variant="ghost" onClick={handleContinue}>
            Continue{" "}
            {isLoading ? (
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4 ml-2" />
            )}
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="paste">
        <div className="flex flex-col space-y-2 mt-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[200px]"
            placeholder="Paste data source text here..."
          />
          <Button className="w-fit" variant="ghost" onClick={handleContinue}>
            Continue{" "}
            {isLoading ? (
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4 ml-2" />
            )}
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="link">
        <div className="flex flex-col space-y-2 mt-2">
          <Input
            type="url"
            // accept="text/plain, application/pdf, video/*, audio/*"
            accept="text/plain, application/pdf"
            onChange={(e) => setLink(e.target.value)}
            value={link}
            placeholder="Enter data source link here..."
          />
          <Button className="w-fit" variant="ghost" onClick={handleContinue}>
            Continue{" "}
            {isLoading ? (
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4 ml-2" />
            )}
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
