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

interface UploadRequest {
  name: string;
  url: string;
  // typ: string;
  userId: object;
  year: string;
  branch: string;
  tags: string;
  subject:string;
  type:string
  
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
    const extractedData: Record<string, any> = {};
    for (const [key, value] of reqData.entries()) {
      extractedData[key] = value;
    }
    
    const { file, ...body } = extractedData;
    const fileUrl = await fileUpload(file, file?.name || "default_title");

    const newRepo = await db.insert(repo).values({
      filename: file.name,
      fileurl: fileUrl,
      userId: authUserId,
      tags: body.tags,
      year: body.year,
      branch: body.branch,
      type:body.type,
      subject:body.subject,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const formData = new FormData();
    formData.append('url',fileUrl)
    fetch('http://127.0.0.1:8800',{
      method:'POST',
      body: formData
    })

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