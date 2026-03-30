import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(request: Request) {
  // 1. Validate Service Role Key configuration
  if (!serviceRoleKey) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY. Cannot generate signed upload URLs.");
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY is not configured in the environment.' }, { status: 500 });
  }

  try {
    const { filename } = await request.json();

    if (!filename) {
      return NextResponse.json({ error: 'Missing filename in request body' }, { status: 400 });
    }

    // 2. Instantiate Supabase Admin client (bypasses RLS strictly for token generation)
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // 3. Create a unique, collision-free object path
    const ext = filename.split('.').pop() || 'png';
    const safeFilename = filename.split('.')[0].replace(/[^a-zA-Z0-9_-]/g, '');
    const uniqueFilename = `${Date.now()}-${safeFilename}-${Math.random().toString(36).substring(7)}.${ext}`;
    const filePath = `posts/${uniqueFilename}`;

    // 4. Generate the presigned upload URL token for the 'blog-images' bucket
    const { data, error } = await supabaseAdmin.storage
      .from('blog-images')
      .createSignedUploadUrl(filePath);

    if (error) {
      console.error("Supabase Storage Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 5. Return the token and path to the client
    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path,
    });

  } catch (err: any) {
    console.error("Upload Endpoint Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
