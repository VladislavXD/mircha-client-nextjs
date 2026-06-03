// components/PollCreator.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Plus } from "lucide-react";

export interface PollDraft {
  question: string;
  options: string[];
  isMultiple: boolean;
  expiresAt?: string | null;
}

interface PollCreatorProps {
  onChange: (poll: PollDraft | null) => void;
  onClose: () => void;
  disabled?: boolean;
}

function uid() {
  return Math.random().toString(36).slice(2, 8);
}

export function PollCreator({ onChange, onClose, disabled }: PollCreatorProps) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { id: uid(), text: "" },
    { id: uid(), text: "" },
  ]);
  const [isMultiple, setIsMultiple] = useState(false);

  const notify = (q: string, opts: typeof options, multi: boolean) => {
    const validOptions = opts.map((o) => o.text.trim()).filter(Boolean);
    if (q.trim() && validOptions.length >= 2) {
      onChange({ question: q.trim(), options: validOptions, isMultiple: multi });
    } else {
      onChange(null);
    }
  };

  const updateQuestion = (val: string) => {
    setQuestion(val);
    notify(val, options, isMultiple);
  };

  const updateOption = (id: string, text: string) => {
    const next = options.map((o) => (o.id === id ? { ...o, text } : o));
    setOptions(next);
    notify(question, next, isMultiple);
  };

  const addOption = () => {
    if (options.length >= 6) return;
    const next = [...options, { id: uid(), text: "" }];
    setOptions(next);
    notify(question, next, isMultiple);
  };

  const removeOption = (id: string) => {
    if (options.length <= 2) return;
    const next = options.filter((o) => o.id !== id);
    setOptions(next);
    notify(question, next, isMultiple);
  };

  const toggleMultiple = (val: boolean) => {
    setIsMultiple(val);
    notify(question, options, val);
  };

  return (
    <div className="rounded-[1.25rem] border border-neutral-200 dark:border-neutral-800/70 bg-neutral-50 dark:bg-[#161616] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Опрос</span>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors text-muted-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <Input
        value={question}
        onChange={(e) => updateQuestion(e.target.value)}
        placeholder="Вопрос опроса"
        disabled={disabled}
        className="text-sm"
      />

      <div className="space-y-2">
        {options.map((opt, idx) => (
          <div key={opt.id} className="flex items-center gap-2">
            <Input
              value={opt.text}
              onChange={(e) => updateOption(opt.id, e.target.value)}
              placeholder={`Вариант ${idx + 1}`}
              disabled={disabled}
              className="flex-1 text-sm"
            />
            {options.length > 2 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeOption(opt.id)}
                disabled={disabled}
                className="h-9 w-9 p-0 shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {options.length < 6 && (
        <Button
          type="button"
          onClick={addOption}
          variant="outline"
          size="sm"
          disabled={disabled}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить вариант
        </Button>
      )}

      <div className="flex items-center gap-2.5">
        <Checkbox
          id="multiselect"
          checked={isMultiple}
          onCheckedChange={(v) => toggleMultiple(v as boolean)}
          disabled={disabled}
        />
        <label
          htmlFor="multiselect"
          className="text-sm text-muted-foreground cursor-pointer select-none"
        >
          Несколько вариантов ответа
        </label>
      </div>
    </div>
  );
}