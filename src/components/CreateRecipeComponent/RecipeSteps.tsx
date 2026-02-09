import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Clock, Plus, X } from "lucide-react";
import type { StepForm } from "./CreateRecipe";

interface Props {
  steps: StepForm[]
  onAdd: () => void
  onRemove: (index: number) => void
  onUpdate: (
    index: number,
    field: keyof StepForm,
    value: string | number
  ) => void
}

export default function RecipeSteps({ steps, onAdd, onRemove, onUpdate }: Props) {
    return (
        <Card className="border-stone-200 shadow-md overflow-hidden">
            <CardHeader className="bg-linear-to-r from-stone-50 to-transparent border-b border-stone-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white border border-stone-200 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                            <img 
                                src="/Bowl.png" 
                                alt="bowl" 
                                className="w-5 h-5 object-contain"
                                loading="lazy"
                            />
                        </div>
                        <div>
                            <CardTitle className="inter text-lg">
                                Modo de Preparo
                            </CardTitle>
                            <CardDescription className="raleway font-medium text-xs ">
                                Descreva passo a passo como preparar
                            </CardDescription>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onAdd}
                        className="border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all self-start sm:self-auto w-full sm:w-auto"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        <span className="truncate">Novo Passo</span>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 pt-4 sm:pt-6 px-3 sm:px-6">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className="group relative"
                        style={{
                            animation: `slideIn 0.3s ease-out ${index * 0.05}s backwards`
                        }}
                    >

                        <div className="flex flex-col sm:flex-row gap-4 items-start bg-stone-50/50 border border-stone-200 rounded-lg p-3 sm:p-4 hover:bg-white hover:border-amber-200 hover:shadow-sm transition-all relative z-10">
                            {/* Número do passo */}
                            <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:justify-center sm:w-12">
                                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 border border-amber-200 rounded-full flex items-center justify-center font-bold text-amber-700 text-base sm:text-lg shadow-md group-hover:scale-110 transition-transform">
                                    {step.order}
                                </div>
                                
                                {/* Botão de remover visível em mobile */}
                                {steps.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onRemove(index)}
                                        className="absolute top-3.5 right-1.5 sm:hidden opacity-100 hover:bg-red-50 hover:text-red-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>

                            {/* Conteúdo do passo */}
                            <div className="flex-1 w-full space-y-3">
                                <Textarea
                                    placeholder="Descreva este passo detalhadamente..."
                                    value={step.instruction}
                                    onChange={(e) =>
                                        onUpdate(index, "instruction", e.target.value)
                                    }
                                    rows={3}
                                    required
                                    className="raleway leading-relaxed font-medium border-stone-300 resize-none w-full min-h-25 sm:min-h-30 text-sm "
                                />
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                                        <Input
                                            type="number"
                                            min="0"
                                            placeholder="Tempo (minutos)"
                                            value={step.timeMinutes}
                                            onChange={(e) =>
                                                onUpdate(index, "timeMinutes", e.target.value)
                                            }
                                            className="border-stone-300 focus:border-blue-400 h-9 raleway font-medium text-sm w-full sm:w-48"
                                        />
                                    </div>
                                    
                                    {/* Botão de remover visível em desktop */}
                                    {steps.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onRemove(index)}
                                            className="hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600 shrink-0"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Estado vazio responsivo */}
                {steps.length === 0 && (
                    <div className="text-center py-8 sm:py-12">
                        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-stone-100 rounded-full flex items-center justify-center mb-4">
                            <img 
                                src="/Bowl.png" 
                                alt="bowl" 
                                className="w-8 h-8 sm:w-10 sm:h-10 object-contain opacity-50"
                                loading="lazy"
                            />
                        </div>
                        <h3 className="inter font-semibold text-lg sm:text-xl text-stone-700 mb-2">
                            Nenhum passo adicionado
                        </h3>
                        <p className="raleway text-stone-500 text-sm sm:text-base mb-6 max-w-md mx-auto">
                            Comece adicionando o primeiro passo da sua receita
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={onAdd}
                            className="border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all mx-auto"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Adicionar Primeiro Passo
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}