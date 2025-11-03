import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const speakersDir = join(process.cwd(), 'public', 'images', 'speakers');
    const files = await readdir(speakersDir);

    // Filter only image files (png, jpg, jpeg) and sort alphabetically
    const imageFiles = files
      .filter(file => /\.(png|jpg|jpeg)$/i.test(file))
      .sort((a, b) => {
        // Natural sort for filenames like A_01.png, B_02.png, etc.
        return a.localeCompare(b, undefined, {
          numeric: true,
          sensitivity: 'base'
        });
      });

    return NextResponse.json({ images: imageFiles }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error reading speakers directory:', error);
    return NextResponse.json({ images: [] }, { status: 500 });
  }
}
