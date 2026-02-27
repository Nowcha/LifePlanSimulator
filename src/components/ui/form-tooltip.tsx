import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CircleHelp } from 'lucide-react';

interface FormTooltipProps {
    text: string;
}

export function FormTooltip({ text }: FormTooltipProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <CircleHelp className="inline-block ml-1 h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-64">
                <p className="text-sm">{text}</p>
            </TooltipContent>
        </Tooltip>
    );
}
