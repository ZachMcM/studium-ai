"use client";

import { Check, Settings2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Notes } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { RequestOptions } from "ai";

type Props = {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  complete: (
    prompt: string,
    options?: RequestOptions | undefined
  ) => Promise<string | null | undefined>;
};

export default function NotesConfig({ input, setInput, complete }: Props) {
  const [open, setOpen] = useState<boolean>(false);

  function handleSave() {
    console.log(input)
    complete(input);
    setOpen(false);
  }

  async function handleFileUplaod(e: ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (fileList) {
      const fileContents = await fileList[0].text();
      setInput(fileContents);
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Configuration <Settings2 className="h-4 w-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] md:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Configure notes</DialogTitle>
          <DialogDescription>
            Generate your notes be either uploading a txt file or pasting text
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="upload">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="paste">Paste</TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload data source file</CardTitle>
                <CardDescription>
                  Generate your notes using a txt file.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Label htmlFor="dataFile">Data Source File</Label>
                <Input
                  id="dataFile"
                  type="file"
                  accept=".txt"
                  onChange={handleFileUplaod}
                />
              </CardContent>
              <CardFooter>
                {/* TODO */}
                <Button onClick={handleSave}>
                  Save <Check className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="paste">
            <Card>
              <CardHeader>
                <CardTitle>Paste data source</CardTitle>
                <CardDescription>
                  Generate your notes by pasting the text.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Label htmlFor="sourceText">Data Source Text</Label>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[200px]"
                  id="sourceText"
                />
              </CardContent>
              <CardFooter>
                {/* TODO */}
                <Button onClick={handleSave}>
                  Save <Check className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
