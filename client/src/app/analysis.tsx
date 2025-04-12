"use client";

import React from "react";

interface AnalysisPanelProps {
    title: string;
    loading: boolean;
    aiAnalysis: string;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ title, loading, aiAnalysis }) => {
    return (
        <div className="w-full mt-6">
            <div className="border border-gray-300 rounded-md p-4 w-full">
                <h2 className="text-xl font-semibold mb-3">{title}</h2>
                
                {loading ? (
                    <div className="text-center py-4">
                        <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                        <p className="mt-2 text-gray-600">Analüüsi koostamine...</p>
                    </div>
                ) : (
                    <div className="prose max-w-none">
                        {aiAnalysis ? (
                            <div dangerouslySetInnerHTML={{ __html: aiAnalysis.replace(/\n/g, '<br/>') }} />
                        ) : (
                            <p className="text-gray-500">Valige valdkond või ametinimetus analüüsi nägemiseks.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalysisPanel;