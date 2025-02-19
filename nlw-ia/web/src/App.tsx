import { useState } from "react";
import { Wand2 } from "lucide-react";
import { useCompletion } from "ai/react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import { Slider } from "./components/ui/slider";
import { VideoInputFormat } from "./components/video-input-form";
import { PromptSelect } from "./components/prompt-select";
import { Header } from "./components/header";

export function App() {
  const [temperature, setTemperature] = useState(0.5);
  const [videoId, setVideoId] = useState<string | null>(null)

  function handlePromptSelection(template: string) {
    setInput(template)
  }

  function handleTemperatureSelection(value: number[]) {
    setTemperature(value[0])
  }

  function handleOnVideoUpload(id: string) {
    setVideoId(id)
  }

  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading
  } = useCompletion({
    api: import.meta.env.DEV ? 'http://localhost:3333/ai/complete' : import.meta.env.API_URL,
    body: {
      videoId,
      temperature
    },
    headers: {
      'content-type': 'application/json'
    }
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 p-6 flex gap-6">

        <div className="flex flex-col flex-1 gap-4">
          <section className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              placeholder="Inclua o prompt para a IA..."
              className="resize-none p-4 leading-relaxed"
              value={input}
              onChange={handleInputChange}
            />
            <Textarea
              placeholder="Resultado gerado pela IA..."
              className="resize-none p-4 leading-relaxed"
              readOnly
              value={completion}
            />
          </section>
          <p className="text-sm text-muted-foreground">Lembre-se: você pode utilizar a variável <code className="text-violet-400">{'{transcription}'}</code> no seu prompt para adicionar o conteúdo da transcrição do vídeo selecionado.</p>
        </div>

        <aside className="w-80 space-y-6">
          <VideoInputFormat onVideoUploaded={handleOnVideoUpload} />

          <Separator />

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Prompt</Label>
              <PromptSelect onPromptSelect={handlePromptSelection} />
            </div>
            <div className="space-y-2">
              <Label>Modelo</Label>
              <Select defaultValue="gpt3.5" disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs text-muted-foreground italic">Você poderá customizar essa opção em breve</span>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Temperatura</Label>
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={[temperature]}
                onValueChange={handleTemperatureSelection}
              />
              <span className="block text-xs text-muted-foreground italic leading-relaxed">Valores altos tendem a deixar o resultado mais criativo e com possíveis erros.</span>
            </div>

            <Separator />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Gerando...' : 'Executar'}
              {!isLoading && <Wand2 className="w-4 h-4 ml-2"/>}
            </Button>

          </form>
        </aside>
      </main>
    </div>
  )
}
