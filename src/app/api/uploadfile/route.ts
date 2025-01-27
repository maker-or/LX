import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { db } from "~/server/db";
import { repo } from "~/server/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!
  }
});

interface FormDataBody {
name: string;
year: string;
branch: string;
tags: string;
subject: string;
type: string;
file: File;
}

interface UploadedFile {
filename: string;
fileurl: string;
userId: string;
tags: string;
year: string;
branch: string;
type: string;
subject: string;
createdAt: Date;
updatedAt: Date;
}

const fileUpload = async (file: File, name: string) => {
  const fileBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(fileBuffer);
  const fileName = `${Date.now()}_${name}`;

  const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME;
  const DOMAIN = process.env.CLOUDFLARE_R2_SUBDOMAIN;

  if (!BUCKET_NAME || !DOMAIN) {
    throw new Error("Required environment variables are not set");
  }

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: file.type
  });

  await s3Client.send(command);
  return `${DOMAIN}/${fileName}`;
};

export async function POST(req: Request) {
  try {
    const { userId: authUserId } = (await auth()) as { userId: string | null };
    if (!authUserId) throw new Error("Unauthorized");

    const reqData = await req.formData();
    const uploadFile = reqData.get('file');

    if (!uploadFile || !(uploadFile instanceof File)) {
    throw new Error("File upload is required");
    }

    const formData: FormDataBody = {
    name: (reqData.get('name') ?? '') as string,
    year: (reqData.get('year') ?? '') as string,
    branch: (reqData.get('branch') ?? '') as string,
    tags: (reqData.get('tags') ?? '') as string,
    subject: (reqData.get('subject') ?? '') as string,
    type: (reqData.get('type') ?? '') as string,
    file: uploadFile
    };

    const { file, ...body } = formData;
    const fileUrl = await fileUpload(file, file.name || "default_title");

    const uploadedFile: UploadedFile = {
    filename: body.name,
    fileurl: fileUrl,
    userId: authUserId,
    tags: body.tags,
    year: body.year,
    branch: body.branch,
    type: body.type,
    subject: body.subject,
    createdAt: new Date(),
    updatedAt: new Date()
    };

    const newRepo = await db.insert(repo).values(uploadedFile);

    const aiFormData = new FormData();
    aiFormData.append('url', fileUrl);

    try {
    await fetch('http://127.0.0.1:8800', {
        method: 'POST',
        body: aiFormData
    });
    } catch (error) {
    console.error('Error sending file to AI service:', error);
    // Continue execution even if AI service fails
    }

    return NextResponse.json({ success: true, repo: newRepo });
  } catch (error) {
    console.error("Error updating database:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update database"
      },
      { status: 500 }
    );
  }
}