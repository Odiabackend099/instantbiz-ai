import { useState } from "react";
import { useTTS } from "@/hooks/useTTS";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2, Loader2 } from "lucide-react";

export default function TTSDemo() {
  const [text, setText] = useState("Welcome to ODIA SmartBiz AI! We help Nigerian businesses automate customer service with AI that responds in seconds.");
  const [voice, setVoice] = useState("en-NG-EzinneNeural");
  const { play, isLoading } = useTTS();

  const handleSpeak = () => {
    if (text.trim()) {
      play(text, voice);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          ODIA Text-to-Speech Demo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Text to Speak</label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Enter text to convert to speech..."
            className="resize-none"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Voice</label>
          <Input
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
            placeholder="e.g., en-NG-EzinneNeural"
          />
        </div>

        <Button
          onClick={handleSpeak}
          disabled={isLoading || !text.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Synthesizing...
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4 mr-2" />
              Speak
            </>
          )}
        </Button>

        <p className="text-sm text-muted-foreground">
          Tip: You must click the button (user gesture) before audio can play in most browsers.
        </p>
      </CardContent>
    </Card>
  );
}