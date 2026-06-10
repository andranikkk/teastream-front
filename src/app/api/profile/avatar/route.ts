import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Получаем session cookie из запроса
    const cookieHeader = request.headers.get('cookie') || '';

    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      return NextResponse.json(
        { message: 'File is required' },
        { status: 400 }
      );
    }

    // Отправляем на бэк-сервис
    const backendFormData = new FormData();
    backendFormData.append('avatar', file);

    const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    if (!backendUrl) {
      throw new Error('NEXT_PUBLIC_SERVER_URL is not set');
    }

    console.log('Sending to backend:', `${backendUrl}/profile/avatar`);

    const backendResponse = await fetch(`${backendUrl}/profile/avatar`, {
      method: 'POST',
      body: backendFormData,
      headers: {
        // Передаем все cookies (включая session)
        cookie: cookieHeader
      }
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('Backend error:', errorText);

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || 'Upload failed' };
      }

      return NextResponse.json(errorData, { status: backendResponse.status });
    }

    const result = await backendResponse.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Avatar upload error:', error);

    const message =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
