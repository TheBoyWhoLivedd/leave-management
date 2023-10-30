import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions, CustomUser } from "../auth/[...nextauth]/options";

const f = createUploadthing();

const checkUserSession = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
};

export const ourFileRouter: FileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      const session = await checkUserSession();
      const userId = (session.user as CustomUser).id;
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
    }),
};

export type OurFileRouter = typeof ourFileRouter;
