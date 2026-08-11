"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VideoForm } from "@/components/admin/video-form";
import { VideoUploadForm } from "@/components/admin/video-upload-form";

export function VideoSourceTabs() {
  return (
    <Tabs defaultValue="youtube">
      <TabsList>
        <TabsTrigger value="youtube">Link do YouTube</TabsTrigger>
        <TabsTrigger value="upload">Enviar arquivo</TabsTrigger>
      </TabsList>
      <TabsContent value="youtube" className="mt-6">
        <VideoForm />
      </TabsContent>
      <TabsContent value="upload" className="mt-6">
        <VideoUploadForm />
      </TabsContent>
    </Tabs>
  );
}
