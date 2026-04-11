export async function generateWithGemini(prompt: string) {
    try {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: prompt }],
                        },
                    ],
                }),
            }
        );

        if (!res.ok) {
            const error = await res.text();
            throw new Error(error);
        }

        const data = await res.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error generating content with Gemini:', error);
        throw error;
    }
}
