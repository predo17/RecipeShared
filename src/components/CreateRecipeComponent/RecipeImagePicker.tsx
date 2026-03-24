import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageUp, Link, Upload } from "lucide-react"

interface Props {
    imageUrl: string
    setImageUrl: (v: string) => void
    imagePreview: string | null
    imageUploading: boolean
    imageSourceMode: "url" | "upload"
    fileInputRef: React.RefObject<HTMLInputElement | null>
    onChangeSource: (mode: "url" | "upload") => void
    onUpload: (e: any) => void
}


export default function RecipeImagePicker({
    imageUrl,
    setImageUrl,
    imagePreview,
    imageUploading,
    imageSourceMode,
    fileInputRef,
    onChangeSource,
    onUpload
}: Props) {

    return (
        <Card className="space-y-3">
            <CardContent className="space-y-3 mt-6">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white border border-stone-200 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                        <img
                            src="/image.png"
                            alt="image"
                            className="w-5 h-5 object-contain"
                            loading="lazy"
                        />
                    </div>
                    <div>
                        <CardTitle className="inter text-lg">
                            Imagem da Receita
                        </CardTitle>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        variant={imageSourceMode === "upload" ? "default" : "outline"}
                        size="sm"
                        onClick={() => onChangeSource("upload")}
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                    </Button>
                    <Button
                        type="button"
                        variant={imageSourceMode === "url" ? "default" : "outline"}
                        size="sm"
                        onClick={() => onChangeSource("url")}
                    >
                        <Link className="w-4 h-4 mr-2" />
                        URL da imagem
                    </Button>
                </div>

                {imageSourceMode === "url" && (
                    <>
                        <Input
                            id="imageUrl"
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://exemplo.com/imagem-da-receita.jpg"
                            className="raleway font-medium text-sm h-11"
                        />
                        {imageUrl && (
                            <div className="mt-3 rounded border border-stone-200 p-2 bg-stone-50">
                                <img
                                    src={imageUrl}
                                    alt="Preview"
                                    className="w-full h-80 sm:h-105 md:h-125 lg:h-160 max-h-160 object-cover"
                                />
                            </div>
                        )}
                    </>
                )}


                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onUpload}
                />


                {imageSourceMode === "upload" && (
                    <div
                        role="button"
                        tabIndex={0}
                        aria-label="Enviar imagem da receita"
                        onClick={() => {
                            if (!imageUploading) {
                                fileInputRef.current?.click()
                            }
                        }}
                        onKeyDown={(e) => {
                            if (
                                (e.key === "Enter" || e.key === " ") &&
                                !imageUploading
                            ) {
                                fileInputRef.current?.click()
                            }
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault()
                            const file = e.dataTransfer.files?.[0]
                            if (file) {
                                onUpload({ target: { files: [file] } } as any)
                            }
                            
                        }}

                        className="
      mt-3
      rounded
      border
      border-stone-200
      border-dashed
      p-2
      bg-stone-50
      min-h-48 sm:min-h-64 md:min-h-80 lg:min-h-96
      flex
      items-center
      justify-center
      cursor-pointer
      hover:bg-stone-100
      transition-colors
      focus:outline-none
      focus:ring-2
      focus:ring-stone-400
      focus:ring-offset-2
    "
                    >
                        {imageUploading ? (
                            <span className="text-stone-500 text-sm">
                                Enviando imagem...
                            </span>
                        ) : imagePreview || imageUrl ? (
                            <img
                                src={imagePreview || imageUrl}
                                alt="Preview da receita"
                                className="w-full h-80 sm:h-105 md:h-125 lg:h-160 max-h-160 object-cover rounded"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center">
                                <ImageUp className="w-6 h-6 text-stone-500 mb-2" />
                                <p className="text-stone-500 text-sm">
                                    Clique para enviar
                                </p>
                                <p className="text-stone-500 text-xs">
                                    PNG, JPG ou WEBP
                                </p>
                            </div>
                        )}
                    </div>
                )}

            </CardContent>
        </Card>
    )
}
