import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

function sanitizeFilename(value) {
  return value.replace(/[^a-zA-Z0-9.-]/g, "-").toLowerCase();
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "blog";

    if (!file || typeof file === "string") {
      return NextResponse.json({ message: "No file provided." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = path.extname(file.name || ".png") || ".png";
    const safeName = sanitizeFilename(path.basename(file.name || "upload", ext));
    const filename = `${Date.now()}-${safeName}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads", String(folder));
    await mkdir(uploadDir, { recursive: true });
    const uploadPath = path.join(uploadDir, filename);
    await writeFile(uploadPath, buffer);

    return NextResponse.json({
      url: `/uploads/${folder}/${filename}`,
    });
  } catch (error) {
    return NextResponse.json({ message: "Upload failed.", detail: String(error) }, { status: 500 });
  }
}
