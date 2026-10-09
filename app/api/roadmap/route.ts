import { ApiResponse } from "@/app/utils/globalApiHandler";
import { ai } from "@/app/utils/Google_Gemini_AI_Config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json();
    if (!transcript) {
      throw new Error("No transcript provided");
    }

    const prompt = `Create a learning roadmap for: "${transcript}"
                        Return ONLY valid JSON.
                Format:

                {
                "title": "Roadmap",
                "nodes": [
                    {
                    "id": "1",
                    "title": "HTML",
                    "description": "Learn HTML basics."
                    },
                    {
                    "id": "2",
                    "title": "CSS",
                    "description": "Learn CSS."
                    }
                ],
                "edges": [
                    {
                    "source": "1",
                    "target": "2"
                    }
                ]
                }

                Do not include markdown.
                Do not use \`\`\`.
                Do not explain anything.
                `;

    const responseFromAi = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    if (!responseFromAi || !responseFromAi.text) {
      throw new Error("Failed to get response from AI");
    }
    const finalProperAiResponse = responseFromAi.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const roadmapJsonData = JSON.parse(finalProperAiResponse);
    const successResponse: ApiResponse = {
      success: true,
      message: "JSON message received",
      data: roadmapJsonData,
    };
    return NextResponse.json(successResponse, { status: 200 });
  } catch (er) {
    const errorResponse: ApiResponse = {
      success: false,
      message: "Failed to convert to JSON",
      error: er instanceof Error ? er.message : "Unknown error occurred",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
