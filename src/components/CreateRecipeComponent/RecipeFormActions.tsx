import { Button } from "@/components/ui/button";

interface Props {
    loading: boolean
    isEditMode: boolean
    onCancel: () => void
}


export default function RecipeFormActions({ loading, isEditMode, onCancel }: Props) {
    return (
        <div className="sticky bottom-0 bg-linear-to-t from-white via-white to-transparent pt-6 pb-4 -mx-4 px-4 z-40">
            <div className="flex gap-4 justify-end max-w-5xl mx-auto">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                    className="border-stone-300 hover:bg-stone-50 px-8"
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                    className="bg-linear-to-r from-orange-500 to-orange-400 hover:scale-105 text-white font-semibold px-8 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                    {loading
                        ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                {isEditMode ? "Salvando..." : "Criando..."}
                            </div>
                        )
                        : (isEditMode ? "Salvar Alterações" : "Criar Receita")}
                </Button>
            </div>
        </div>
    )
}
