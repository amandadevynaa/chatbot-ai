import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Create system prompt for Polsek Rembang context
    const systemPrompt = `Anda adalah asisten virtual untuk Polsek Rembang. 
    Anda membantu masyarakat dengan informasi tentang layanan kepolisian, prosedur pelaporan, 
    dan pertanyaan umum terkait kepolisian. Jawab dengan ramah, profesional, dan informatif dalam bahasa Indonesia.`;

    const prompt = `${systemPrompt}\n\nPertanyaan: ${message}\n\nJawaban:`;

    // Generate response using Gemini 2.0 Flash
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return NextResponse.json({ 
      message: response.text,
      success: true 
    });

  } catch (error) {
    console.error('Error generating response:', error);
    return NextResponse.json(
      { error: 'Failed to generate response', success: false },
      { status: 500 }
    );
  }
}
