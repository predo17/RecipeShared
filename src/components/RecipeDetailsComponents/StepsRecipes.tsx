import { Card, CardContent } from "@/components/ui/card";

interface Step {
    id: string;
    order: number;
    instruction: string;
    timeMinutes?: number;
}

export default function StepsRecipes({ steps }: { steps: Step[] }) {
    return (
        <section className="container py-10">
            <div className="max-w-5xl ">
                {/* Header Section */}
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-stone-200">
                    <div className="w-11 h-11 flex items-center justify-center bg-linear-to-br from-stone-100 to-stone-50 border border-stone-200 rounded-lg shadow-sm">
                        <img src="/Bowl.png" alt="bowl" className="w-6 h-6 object-contain" />
                    </div>
                    <h2 className="text-xl font-bold text-stone-900 tracking-tight">
                        Passos de Preparo
                    </h2>
                    <div className="hidden sm:flex flex-1 items-center gap-3">
                        <div className="h-px flex-1 bg-stone-200"></div>
                        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500">
                            Para não ter erro
                        </span>
                    </div>
                </div>

                <div className="max-h-70 overflow-y-auto pr-1.5">
                    {/* Steps Timeline */}
                    <div className="space-y-6">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className="relative group"
                                style={{
                                    animation: `slideInUp 0.5s ease-out ${index * 0.1}s backwards`
                                }}
                            >
                                <Card className="border border-stone-200 shadow-sm hover:shadow-md hover:border-stone-300 transition-all duration-300 bg-white overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="flex gap-5 p-6">
                                            {/* Step Number Circle */}
                                            <div className="shrink-0 relative z-10">
                                                <div className="w-14 h-14 rounded-full bg-linear-to-br from-stone-800 to-stone-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                    <span className="text-white font-bold text-xl tabular-nums">
                                                        {step.order}
                                                    </span>
                                                </div>
                                                {step.timeMinutes && (
                                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                                        <div className="bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-full shadow-sm">
                                                            <span className="text-[10px] font-semibold text-amber-700 tabular-nums">
                                                                {step.timeMinutes} min
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Step Content */}
                                            <div className="flex-1 pt-1">
                                                <div className="flex items-start justify-between gap-4 mb-3">
                                                    <h3 className="text-sm font-bold uppercase tracking-widest text-stone-900">
                                                        Passo {step.order}
                                                    </h3>
                                                    {step.timeMinutes && (
                                                        <div className="hidden sm:flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-200">
                                                            <svg className="w-3.5 h-3.5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span className="text-xs font-medium text-stone-600 tabular-nums">
                                                                {step.timeMinutes} minutos
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <p className="text-[15px] leading-[1.75] text-stone-700 font-light">
                                                    {step.instruction}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}