import { message } from "antd";

export async function generateWithGemini(prompt: string) {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    console.log("API Key: ", apiKey);
    
    
    if (!apiKey) {
        message.error("Missing API Key");
    }

    try {
       const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
            const errorText = await res.text();
            console.error('Gemini API Error Response:', errorText);
            
            let errorMessage = 'AI Generation failed';
            try {
                const parsed = JSON.parse(errorText);
                errorMessage = parsed.error?.message || errorMessage;
            } catch (e) {
                errorMessage = errorText || errorMessage;
            }
            
            throw new Error(errorMessage);
        }

        const data = await res.json();
        
        if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
             console.error('Unexpected Gemini Response Format:', data);
             throw new Error("Invalid response format from Gemini");
        }

        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error in generateWithGemini:', error);
        throw error;
    }
}
